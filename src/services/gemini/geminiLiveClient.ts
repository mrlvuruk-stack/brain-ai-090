/**
 * SwasthyaAI - Gemini Live Client for Real-Time Voice Sessions
 * 
 * Orchestrates:
 * - Ephemeral token authorization
 * - Web Audio pipeline (mic capture & 24kHz playback)
 * - WebSocket connection with Gemini Live API via @google/genai
 * - Bidirectional streaming and live transcription
 * - Natural barge-in / interruption handling
 */

import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import { LiveAudioPipeline } from './geminiLiveAudio';
import { GEMINI_CONFIG } from './geminiConfig';
import type { VoiceState, LiveVoiceTranscription } from './geminiTypes';

export interface LiveClientCallbacks {
  onStateChange: (state: VoiceState) => void;
  onTranscription: (transcription: LiveVoiceTranscription) => void;
  onVolumeChange: (volume: number, isAiSpeaking: boolean) => void;
  onError: (error: Error) => void;
}

export class GeminiLiveSession {
  private audioPipeline: LiveAudioPipeline | null = null;
  private session: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;
  private callbacks: LiveClientCallbacks;
  private isConnecting: boolean = false;
  private isConnected: boolean = false;
  private accumulatedAiText: string = '';

  constructor(callbacks: LiveClientCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Start the live voice conversation
   */
  async start({
    token,
    liveModel = 'gemini-3.1-flash-live-preview',
    systemInstruction,
    groundedContext,
  }: {
    token: string;
    liveModel?: string;
    systemInstruction: string;
    groundedContext?: string;
  }): Promise<void> {
    if (this.isConnecting || this.isConnected) return;

    this.isConnecting = true;
    this.callbacks.onStateChange('CONNECTING');

    try {
      // 1. Initialize audio pipeline and request microphone
      this.audioPipeline = new LiveAudioPipeline({
        onAudioData: (base64Chunk: string) => {
          if (this.session && this.isConnected) {
            try {
              this.session.sendRealtimeInput({
                audio: {
                  data: base64Chunk,
                  mimeType: 'audio/pcm;rate=16000',
                },
              });
            } catch (err) {
              console.warn('[GeminiLive] Error sending audio chunk:', err);
            }
          }
        },
        onVolumeChange: (vol: number, isAiSpeaking: boolean) => {
          this.callbacks.onVolumeChange(vol, isAiSpeaking);
        },
      });

      await this.audioPipeline.startMicrophone();

      // 2. Prepare System Instruction + Grounded Context
      let fullInstruction = systemInstruction;
      if (groundedContext) {
        fullInstruction += `\n\n--- ACTIVE DEMO CONTEXT ---\n${groundedContext}\n--- END CONTEXT ---`;
      }
      fullInstruction += '\nNOTE: You are in real-time voice mode. Keep spoken responses concise, warm, natural, and structured without markdown symbols or long tables.';

      // 3. Initialize GoogleGenAI client with the Ephemeral Token
      const client = new GoogleGenAI({
        apiKey: token,
        httpOptions: { apiVersion: GEMINI_CONFIG.LIVE_API_VERSION },
      });

      // 4. Connect to Gemini Live WebSocket
      this.session = await client.live.connect({
        model: liveModel,
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: {
            parts: [{ text: fullInstruction }],
          },
        },
        callbacks: {
          onopen: () => {
            this.isConnected = true;
            this.isConnecting = false;
            this.callbacks.onStateChange('LISTENING');
          },
          onmessage: (msg) => {
            this.handleServerMessage(msg);
          },
          onerror: (err) => {
            console.error('[GeminiLive] WebSocket error:', err);
            this.callbacks.onError(new Error(err instanceof Error ? err.message : 'Live voice connection error.'));
            this.callbacks.onStateChange('ERROR');
          },
          onclose: () => {
            this.isConnected = false;
            this.isConnecting = false;
            this.callbacks.onStateChange('ENDED');
          },
        },
      });

      this.isConnected = true;
      this.isConnecting = false;
      this.callbacks.onStateChange('LISTENING');
    } catch (err) {
      this.isConnecting = false;
      this.isConnected = false;
      this.cleanup();
      const error = err instanceof Error ? err : new Error(String(err));
      this.callbacks.onError(error);
      this.callbacks.onStateChange('ERROR');
      throw error;
    }
  }

  private handleServerMessage(msg: LiveServerMessage): void {
    const sc = msg.serverContent;
    if (!sc) return;

    // A. Interruption / Barge-In
    if (sc.interrupted) {
      this.audioPipeline?.interruptPlayback();
      this.callbacks.onStateChange('LISTENING');
      return;
    }

    // B. User Input Live Transcription
    if (sc.inputTranscription?.text) {
      this.callbacks.onTranscription({
        speaker: 'user',
        text: sc.inputTranscription.text,
        isFinal: true,
        timestamp: Date.now(),
      });
      this.callbacks.onStateChange('PROCESSING');
    }

    // C. Model Spoken Turn & Audio Output
    if (sc.modelTurn?.parts) {
      for (const part of sc.modelTurn.parts) {
        if (part.inlineData?.data) {
          this.audioPipeline?.playAudioChunk(part.inlineData.data);
          this.callbacks.onStateChange('AI_SPEAKING');
        }
      }
    }

    // D. Model Live Speech Transcription
    if (sc.outputTranscription?.text) {
      this.accumulatedAiText += sc.outputTranscription.text;
      this.callbacks.onTranscription({
        speaker: 'assistant',
        text: this.accumulatedAiText,
        isFinal: false,
        timestamp: Date.now(),
      });
    }

    // E. Turn Complete
    if (sc.turnComplete) {
      if (this.accumulatedAiText) {
        this.callbacks.onTranscription({
          speaker: 'assistant',
          text: this.accumulatedAiText,
          isFinal: true,
          timestamp: Date.now(),
        });
        this.accumulatedAiText = '';
      }
      this.callbacks.onStateChange('LISTENING');
    }
  }

  /**
   * Stop AI audio immediately (Barge-in / Stop Talking)
   */
  interrupt(): void {
    this.audioPipeline?.interruptPlayback();
    this.callbacks.onStateChange('LISTENING');
  }

  /**
   * Toggle microphone mute
   */
  toggleMute(): boolean {
    if (!this.audioPipeline) return false;
    const current = this.audioPipeline.getMuted();
    const next = !current;
    this.audioPipeline.setMuted(next);
    this.callbacks.onStateChange(next ? 'MUTED' : 'LISTENING');
    return next;
  }

  get isMuted(): boolean {
    return this.audioPipeline?.getMuted() ?? false;
  }

  /**
   * Send text during live session if needed
   */
  sendText(text: string): void {
    if (this.session && this.isConnected) {
      this.session.sendRealtimeInput({ text });
      this.callbacks.onTranscription({
        speaker: 'user',
        text,
        isFinal: true,
        timestamp: Date.now(),
      });
      this.callbacks.onStateChange('PROCESSING');
    }
  }

  /**
   * Disconnect and release all audio/network resources
   */
  cleanup(): void {
    this.isConnected = false;
    this.isConnecting = false;

    if (this.audioPipeline) {
      this.audioPipeline.cleanup();
      this.audioPipeline = null;
    }

    if (this.session) {
      try {
        this.session.close();
      } catch {
        // already closed
      }
      this.session = null;
    }

    this.accumulatedAiText = '';
  }
}
