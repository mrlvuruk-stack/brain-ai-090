/**
 * SwasthyaAI - Live Real-Time Voice Modal
 * 
 * Provides an interactive voice conversation with Gemini Live API:
 * - Real-time microphone capture and streaming
 * - Real-time 24kHz audio playback
 * - Live transcriptions for user and assistant
 * - Natural barge-in / interruption
 * - Accessible controls and Senior Mode support
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Square,
  PhoneOff,
  RefreshCw,
  X,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  PhoneCall,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { GeminiLiveSession } from '../../services/gemini/geminiLiveClient';
import { requestEphemeralToken } from '../../services/gemini/geminiClient';
import { getSwasthyaSystemInstruction, formatGroundedContextText } from '../../services/gemini/geminiPrompts';
import { buildGeminiHealthContext } from '../../services/gemini/geminiContext';
import type { VoiceState, LiveVoiceTranscription } from '../../services/gemini/geminiTypes';
import type { InjectedAssistantContext } from '../../data/intelligenceTypes';
import './LiveVoiceModal.css';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  injectedContext?: InjectedAssistantContext | null;
  language: 'en' | 'hi';
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  profileId,
  injectedContext,
  language,
}) => {
  const isHindi = language === 'hi';

  const [voiceState, setVoiceState] = useState<VoiceState>('CONNECTING');
  const [transcriptions, setTranscriptions] = useState<LiveVoiceTranscription[]>([]);
  const [currentAiSpeech, setCurrentAiSpeech] = useState<string>('');
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptions, currentAiSpeech]);

  // Emergency red-flag symptom detector for real-time speech
  const detectVoiceEmergency = useCallback((text: string): boolean => {
    const lower = text.toLowerCase();
    const patterns = [
      'chest pain',
      'heart attack',
      'difficulty breathing',
      'shortness of breath',
      'breathless',
      "can't breathe",
      'cannot breathe',
      'unconscious',
      'passed out',
      'fainted',
      'severe bleeding',
      'massive bleeding',
      'stroke',
      'facial drooping',
      'sudden numbness',
      'sudden weakness',
      'choking',
      'seizure',
      'सीने में दर्द',
      'सांस लेने में तकलीफ',
      'सांस नहीं आ रही',
      'बेहोश',
      'खून बह रहा',
      'दिल का दौरा',
      'अचानक कमजोरी',
    ];
    return patterns.some((p) => lower.includes(p));
  }, []);

  // Connect to Gemini Live Session
  const initSession = useCallback(async () => {
    // Explicitly clean up any previous active session before re-initializing
    if (sessionRef.current) {
      sessionRef.current.cleanup();
      sessionRef.current = null;
    }

    setVoiceState('CONNECTING');
    setErrorMessage(null);
    setTranscriptions([]);
    setCurrentAiSpeech('');
    setIsMuted(false);
    setIsEmergencyActive(false);

    try {
      // 1. Get Ephemeral Token from local secure server endpoint
      const tokenData = await requestEphemeralToken();

      // 2. Prepare grounded context for the active profile
      const groundedObj = buildGeminiHealthContext(profileId, injectedContext);
      const groundedText = formatGroundedContextText(groundedObj);
      const systemInstruction = getSwasthyaSystemInstruction(language);

      // 3. Instantiate Live Session
      const session = new GeminiLiveSession({
        onStateChange: (state) => {
          setVoiceState(state);
          if (state === 'AI_SPEAKING') {
            setIsAiSpeaking(true);
          } else if (state === 'LISTENING') {
            setIsAiSpeaking(false);
          }
        },
        onTranscription: (t) => {
          if (t.speaker === 'assistant') {
            if (t.isFinal) {
              setTranscriptions((prev) => [...prev, t]);
              setCurrentAiSpeech('');
            } else {
              setCurrentAiSpeech(t.text);
            }
          } else {
            setTranscriptions((prev) => [...prev, t]);
            // Emergency voice interception check on user speech
            if (detectVoiceEmergency(t.text)) {
              setIsEmergencyActive(true);
              setTranscriptions((prev) => [
                ...prev,
                {
                  speaker: 'assistant',
                  text: isHindi
                    ? 'आपातकालीन चेतावनी: संभावित गंभीर लक्षण पाए गए हैं। कृपया तुरंत आपातकालीन नंबर (112 या 108) पर कॉल करें या नजदीकी अस्पताल जाएं। यह प्रोटोटाइप आपातकालीन देखभाल प्रदान नहीं करता है।'
                    : 'EMERGENCY ADVISORY: Potential acute emergency symptoms detected. Please immediately contact emergency services at 112 or 108, or go to the nearest emergency department. This prototype cannot provide emergency medical care.',
                  isFinal: true,
                  timestamp: Date.now(),
                },
              ]);
            }
          }
        },
        onVolumeChange: (vol, aiSpeaking) => {
          setAudioVolume(vol);
          setIsAiSpeaking(aiSpeaking);
        },
        onError: (err) => {
          console.error('[LiveVoiceModal] Error:', err);
          setErrorMessage(err.message || 'Voice connection encountered an issue.');
        },
      });

      sessionRef.current = session;

      // 4. Start session with ephemeral token
      await session.start({
        token: tokenData.token,
        liveModel: tokenData.liveModel,
        systemInstruction,
        groundedContext: groundedText,
      });
    } catch (err) {
      const e = err as Error;
      setErrorMessage(e.message || 'Unable to establish live voice connection.');
      setVoiceState('ERROR');
    }
  }, [profileId, injectedContext, language, detectVoiceEmergency, isHindi]);

  const handleClose = useCallback(() => {
    sessionRef.current?.cleanup();
    sessionRef.current = null;
    onClose();
  }, [onClose]);

  // Start on open, cleanup on close
  useEffect(() => {
    let timer: number | null = null;
    if (isOpen) {
      timer = window.setTimeout(() => {
        void initSession();
      }, 0);
    } else {
      sessionRef.current?.cleanup();
      sessionRef.current = null;
    }

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      sessionRef.current?.cleanup();
      sessionRef.current = null;
    };
  }, [isOpen, initSession]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleToggleMute = () => {
    const next = sessionRef.current?.toggleMute() ?? false;
    setIsMuted(next);
  };

  const handleInterrupt = () => {
    sessionRef.current?.interrupt();
  };

  const handleRetry = () => {
    void initSession();
  };

  if (!isOpen) return null;

  // Status text mapping
  const getStatusText = () => {
    switch (voiceState) {
      case 'CONNECTING':
        return isHindi ? 'कनेक्ट हो रहा है...' : 'Connecting to Gemini Live...';
      case 'LISTENING':
        return isHindi ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak naturally';
      case 'USER_SPEAKING':
        return isHindi ? 'आप बोल रहे हैं...' : 'Listening to you...';
      case 'PROCESSING':
        return isHindi ? 'समझ रहा हूँ...' : 'Processing...';
      case 'AI_SPEAKING':
        return isHindi ? 'स्वास्थ्य एआई बोल रहा है' : 'SwasthyaAI is speaking';
      case 'MUTED':
        return isHindi ? 'माइक म्यूट है' : 'Microphone is muted';
      case 'ERROR':
        return isHindi ? 'कनेक्शन में त्रुटि' : 'Connection issue';
      case 'ENDED':
        return isHindi ? 'बातचीत समाप्त' : 'Conversation ended';
      default:
        return isHindi ? 'तैयार' : 'Ready';
    }
  };

  const scaleValue = 1 + audioVolume * 0.25;

  return (
    <div
      className="sw-voice-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sw-voice-modal-title"
    >
      <div className="sw-voice-modal" ref={modalRef}>
        {/* Header */}
        <header className="sw-voice-header">
          <div className="sw-voice-header__title-group">
            <span
              className={`sw-voice-badge ${
                voiceState === 'ERROR'
                  ? 'sw-voice-badge--muted'
                  : voiceState === 'CONNECTING'
                  ? 'sw-voice-badge--connecting'
                  : isMuted
                  ? 'sw-voice-badge--muted'
                  : 'sw-voice-badge--live'
              }`}
            >
              <Sparkles size={13} aria-hidden="true" />
              <span>{isHindi ? 'जेमिनी लाइव वॉइस' : 'Gemini Live Voice'}</span>
            </span>
          </div>

          <button
            type="button"
            className="sw-voice-close-btn"
            onClick={handleClose}
            aria-label={isHindi ? 'वॉइस मोड बंद करें' : 'Close voice mode'}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Body */}
        <div className="sw-voice-body">
          {/* Grounded patient tag */}
          <div className="sw-voice-grounding-indicator">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>
              {isHindi
                ? `सक्रिय प्रोफ़ाइल: ${profileId.toUpperCase()} (केवल सांकेतिक डेटा)`
                : `Grounded in ${profileId.toUpperCase()} synthetic demonstration records`}
            </span>
          </div>

          {/* Emergency Safety Advisory Interception */}
          {isEmergencyActive && (
            <div className="sw-voice-emergency-banner" role="alert">
              <div className="sw-voice-emergency-banner__header">
                <AlertTriangle size={18} aria-hidden="true" />
                <span>{isHindi ? 'आपातकालीन चेतावनी: संभावित चिकित्सा आपातकाल' : 'EMERGENCY ADVISORY: Potential Medical Emergency'}</span>
              </div>
              <p>
                {isHindi
                  ? 'यदि आप तीव्र सीने में दर्द या सांस लेने में गंभीर तकलीफ महसूस कर रहे हैं, तो तुरंत कॉल करें:'
                  : 'If you are experiencing acute chest pain, shortness of breath, or critical symptoms, immediately call:'}
              </p>
              <div className="sw-voice-emergency-banner__actions">
                <a href="tel:112" className="sw-voice-emergency-btn">
                  <PhoneCall size={14} aria-hidden="true" />
                  <span>112 (National Emergency)</span>
                </a>
                <a href="tel:108" className="sw-voice-emergency-btn sw-voice-emergency-btn--ambulance">
                  <PhoneCall size={14} aria-hidden="true" />
                  <span>108 (Ambulance)</span>
                </a>
              </div>
            </div>
          )}

          {/* Visualizer Orb */}
          <div className="sw-voice-visualizer-container">
            <div className="sw-voice-orb-wrapper">
              <div
                className={`sw-voice-orb-ring ${
                  (voiceState === 'LISTENING' || voiceState === 'AI_SPEAKING') && !isMuted
                    ? 'sw-voice-orb-ring--speaking'
                    : ''
                }`}
                style={{ transform: `scale(${scaleValue * 1.1})` }}
              />
              <div
                className={`sw-voice-orb ${
                  voiceState === 'AI_SPEAKING'
                    ? 'sw-voice-orb--ai'
                    : voiceState === 'ERROR'
                    ? 'sw-voice-orb--error'
                    : isMuted
                    ? 'sw-voice-orb--muted'
                    : ''
                }`}
                style={{ transform: `scale(${scaleValue})` }}
              >
                {voiceState === 'AI_SPEAKING' ? (
                  <Volume2 size={40} aria-hidden="true" />
                ) : isMuted ? (
                  <MicOff size={40} aria-hidden="true" />
                ) : (
                  <Mic size={40} aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="sw-voice-status-label" id="sw-voice-modal-title">
              {getStatusText()}
            </div>
            <div className="sw-voice-status-sub">
              {isHindi
                ? 'हेडफ़ोन का उपयोग करने से आवाज़ साफ़ रहती है'
                : 'Using headphones provides optimal echo cancellation'}
            </div>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="sw-voice-error-banner" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <div>
                <strong>{isHindi ? 'सूचना:' : 'Notice:'}</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Live Transcription Box */}
          <div
            className="sw-voice-transcripts"
            aria-live="polite"
            aria-label={isHindi ? 'लाइव संवाद ट्रांसक्रिप्शन' : 'Live conversation transcript'}
          >
            {transcriptions.length === 0 && !currentAiSpeech ? (
              <div className="sw-voice-empty-prompt">
                {isHindi
                  ? 'अपनी हालिया रिपोर्ट, शुगर या वॉक रूटीन के बारे में पूछें...'
                  : 'Ask about your recent report, glucose readings, or walking routine...'}
              </div>
            ) : (
              transcriptions.map((item, idx) => (
                <div key={idx} className="sw-voice-item">
                  <span
                    className={`sw-voice-item__badge ${
                      item.speaker === 'user' ? 'sw-voice-item__badge--user' : 'sw-voice-item__badge--ai'
                    }`}
                  >
                    {item.speaker === 'user' ? (isHindi ? 'आप' : 'You') : 'SwasthyaAI'}
                  </span>
                  <p className="sw-voice-item__text">{item.text}</p>
                </div>
              ))
            )}

            {/* Interim stream from Assistant */}
            {currentAiSpeech && (
              <div className="sw-voice-item">
                <span className="sw-voice-item__badge sw-voice-item__badge--ai">SwasthyaAI</span>
                <p className="sw-voice-item__text sw-voice-item__interim">{currentAiSpeech}</p>
              </div>
            )}
            <div ref={transcriptsEndRef} />
          </div>
        </div>

        {/* Footer / Controls */}
        <footer className="sw-voice-footer">
          {voiceState === 'ERROR' ? (
            <>
              <button
                type="button"
                className="sw-voice-btn sw-voice-btn--retry"
                onClick={handleRetry}
              >
                <RefreshCw size={18} aria-hidden="true" />
                <span>{isHindi ? 'पुनः प्रयास करें' : 'Try Again'}</span>
              </button>
              <button
                type="button"
                className="sw-voice-btn sw-voice-btn--mute"
                onClick={handleClose}
              >
                <span>{isHindi ? 'टेक्स्ट में जारी रखें' : 'Continue with Text'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Mute Button */}
              <button
                type="button"
                className={`sw-voice-btn sw-voice-btn--mute ${isMuted ? 'sw-voice-btn--muted' : ''}`}
                onClick={handleToggleMute}
                aria-label={isMuted ? (isHindi ? 'माइक अनम्यूट करें' : 'Unmute microphone') : (isHindi ? 'माइक म्यूट करें' : 'Mute microphone')}
              >
                {isMuted ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                <span>{isMuted ? (isHindi ? 'अनम्यूट' : 'Unmute') : (isHindi ? 'म्यूट' : 'Mute')}</span>
              </button>

              {/* Stop / Interrupt Button (when AI is speaking) */}
              {isAiSpeaking && (
                <button
                  type="button"
                  className="sw-voice-btn sw-voice-btn--interrupt"
                  onClick={handleInterrupt}
                  aria-label={isHindi ? 'बोलना रोकें' : 'Stop speaking'}
                >
                  <Square size={16} aria-hidden="true" />
                  <span>{isHindi ? 'रोकें' : 'Interrupt'}</span>
                </button>
              )}

              {/* End Call Button */}
              <button
                type="button"
                className="sw-voice-btn sw-voice-btn--end"
                onClick={handleClose}
                aria-label={isHindi ? 'वॉइस कॉल समाप्त करें' : 'End voice session'}
              >
                <PhoneOff size={18} aria-hidden="true" />
                <span>{isHindi ? 'समाप्त करें' : 'End Session'}</span>
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};
