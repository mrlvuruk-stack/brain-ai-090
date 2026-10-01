/**
 * SwasthyaAI - Gemini Service Types
 * 
 * Contracts for text conversation, live voice sessions, audio pipeline,
 * and contextual grounding.
 */

export type VoiceState =
  | 'IDLE'
  | 'CONNECTING'
  | 'LISTENING'
  | 'USER_SPEAKING'
  | 'PROCESSING'
  | 'AI_SPEAKING'
  | 'MUTED'
  | 'ERROR'
  | 'ENDED';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceContext?: {
    title: string;
    route?: string;
    date?: string;
  };
  isStreaming?: boolean;
  isError?: boolean;
}

export interface GroundedPatientContext {
  profileId: string;
  fullName: string;
  age: number;
  gender: string;
  city: string;
  bloodGroup: string;
  demoPatientId: string;
  activeConditions: string[];
  recentMetricsSummary: string;
  latestReportSummary: string;
  wellnessRoutineSummary: string;
  familyCaregiverSummary: string;
  injectedContextSnippet?: string;
  injectedContextTitle?: string;
  injectedContextRoute?: string;
}

export interface EphemeralTokenResponse {
  token: string;
  expireTime: string;
  newSessionExpireTime: string;
  liveModel: string;
}

export interface GeminiStatusResponse {
  available: boolean;
  textModel: string;
  liveModel: string;
}

export interface LiveVoiceTranscription {
  speaker: 'user' | 'assistant';
  text: string;
  isFinal: boolean;
  timestamp: number;
}
