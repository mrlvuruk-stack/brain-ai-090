/**
 * SwasthyaAI - Web Audio Live Pipeline for Gemini Live API
 * 
 * Manages:
 * - 16kHz 16-bit PCM microphone capture with real-time resampling
 * - 24kHz 16-bit PCM streaming audio playback with gapless scheduling
 * - AnalyserNodes for microphone and speaker frequency visualization
 * - Instant barge-in / interruption buffer flushing
 */

export interface LiveAudioHandlers {
  onAudioData: (base64Chunk: string) => void;
  onVolumeChange?: (volume: number, isAiSpeaking: boolean) => void;
}

export class LiveAudioPipeline {
  private micStream: MediaStream | null = null;
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private inputAnalyser: AnalyserNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;

  private isMuted: boolean = false;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private animFrameId: number | null = null;
  private handlers: LiveAudioHandlers;

  constructor(handlers: LiveAudioHandlers) {
    this.handlers = handlers;
  }

  /**
   * Request microphone access and initialize audio processing.
   */
  async startMicrophone(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone access is not supported by your browser.');
    }

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      const e = err as Error;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        throw new Error('Microphone access was denied. Please allow microphone permissions in your browser settings.');
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        throw new Error('No microphone device found on your system.');
      }
      throw new Error(`Microphone error: ${e.message}`);
    }

    // Create Input AudioContext
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.inputContext = new AudioContextClass();
    if (this.inputContext.state === 'suspended') {
      await this.inputContext.resume();
    }

    const sampleRate = this.inputContext.sampleRate;
    this.micSourceNode = this.inputContext.createMediaStreamSource(this.micStream);

    // Setup input Analyser
    this.inputAnalyser = this.inputContext.createAnalyser();
    this.inputAnalyser.fftSize = 64;
    this.micSourceNode.connect(this.inputAnalyser);

    // Setup ScriptProcessor for PCM capture (buffer size 4096 = ~85ms at 48kHz, ~250ms at 16kHz)
    this.processorNode = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (this.isMuted) return;

      const inputData = e.inputBuffer.getChannelData(0);
      // Resample to 16kHz PCM
      const pcm16 = this.downsampleTo16kHzPCM(inputData, sampleRate);
      if (pcm16.length > 0) {
        const base64 = this.arrayBufferToBase64(pcm16.buffer);
        this.handlers.onAudioData(base64);
      }
    };

    this.micSourceNode.connect(this.processorNode);
    // ScriptProcessor must connect to destination to process audio in some browsers
    this.processorNode.connect(this.inputContext.destination);

    // Setup output AudioContext at 24kHz for Gemini Live Audio
    this.outputContext = new AudioContextClass({ sampleRate: 24000 });
    this.outputAnalyser = this.outputContext.createAnalyser();
    this.outputAnalyser.fftSize = 64;
    this.outputAnalyser.connect(this.outputContext.destination);

    this.startVolumeMonitoring();
  }

  /**
   * Resample Float32 audio to 16kHz 16-bit Linear PCM
   */
  private downsampleTo16kHzPCM(input: Float32Array, inputSampleRate: number): Int16Array {
    const targetSampleRate = 16000;
    if (inputSampleRate === targetSampleRate) {
      const output = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      return output;
    }

    const ratio = inputSampleRate / targetSampleRate;
    const newLength = Math.round(input.length / ratio);
    const output = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const srcIdx = Math.floor(i * ratio);
      const s = Math.max(-1, Math.min(1, input[srcIdx] || 0));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    return output;
  }

  /**
   * Play streaming 24kHz 16-bit PCM chunk from Gemini Live
   */
  playAudioChunk(base64Pcm: string): void {
    if (!this.outputContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.outputContext = new AudioContextClass({ sampleRate: 24000 });
    }

    if (this.outputContext.state === 'suspended') {
      this.outputContext.resume();
    }

    const binaryString = atob(base64Pcm);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const sampleCount = Math.floor(len / 2);
    if (sampleCount === 0) return;

    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const float32Data = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
      const int16 = dataView.getInt16(i * 2, true); // little endian
      float32Data[i] = int16 / (int16 < 0 ? 32768 : 32767);
    }

    const audioBuffer = this.outputContext.createBuffer(1, sampleCount, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const sourceNode = this.outputContext.createBufferSource();
    sourceNode.buffer = audioBuffer;

    if (this.outputAnalyser) {
      sourceNode.connect(this.outputAnalyser);
    } else {
      sourceNode.connect(this.outputContext.destination);
    }

    const currentTime = this.outputContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }

    sourceNode.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
    this.activeSources.push(sourceNode);

    sourceNode.onended = () => {
      const idx = this.activeSources.indexOf(sourceNode);
      if (idx !== -1) {
        this.activeSources.splice(idx, 1);
      }
    };
  }

  /**
   * Interrupt: Immediately stop and flush all queued AI audio
   */
  interruptPlayback(): void {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Source may already have completed
      }
    }
    this.activeSources = [];
    if (this.outputContext) {
      this.nextPlayTime = this.outputContext.currentTime;
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous volume animation loop
   */
  private startVolumeMonitoring(): void {
    const dataArray = new Uint8Array(32);

    const update = () => {
      let maxVal = 0;
      let isAiSpeaking = this.activeSources.length > 0;

      if (isAiSpeaking && this.outputAnalyser) {
        this.outputAnalyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > maxVal) maxVal = dataArray[i];
        }
      } else if (!this.isMuted && this.inputAnalyser) {
        this.inputAnalyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > maxVal) maxVal = dataArray[i];
        }
      }

      const normalized = Math.min(1, maxVal / 180);
      if (this.handlers.onVolumeChange) {
        this.handlers.onVolumeChange(normalized, isAiSpeaking);
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  private arrayBufferToBase64(buffer: ArrayBufferLike): string {
    let binary = '';
    const bytes = new Uint8Array(buffer as ArrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.interruptPlayback();

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.micSourceNode) {
      this.micSourceNode.disconnect();
      this.micSourceNode = null;
    }

    if (this.inputAnalyser) {
      this.inputAnalyser.disconnect();
      this.inputAnalyser = null;
    }

    if (this.outputAnalyser) {
      this.outputAnalyser.disconnect();
      this.outputAnalyser = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.inputContext && this.inputContext.state !== 'closed') {
      this.inputContext.close();
      this.inputContext = null;
    }

    if (this.outputContext && this.outputContext.state !== 'closed') {
      this.outputContext.close();
      this.outputContext = null;
    }
  }
}
