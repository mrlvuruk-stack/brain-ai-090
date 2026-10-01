/**
 * SWASTHYAAI AI HEALTH INTELLIGENCE ASSISTANT — TYPES
 * Fictional illustrative assistant contracts for client-side prototype.
 * Strict boundary: Simulated educational responses only; NOT a clinical AI or diagnostic system.
 */

export type AssistantIntent =
  | 'REPORT_EXPLANATION'
  | 'METRIC_EXPLANATION'
  | 'HEALTH_SUMMARY'
  | 'TREND_SUMMARY'
  | 'WELLNESS_GUIDANCE'
  | 'FAMILY_CONTEXT'
  | 'GENERAL_HEALTH_EDUCATION'
  | 'EMERGENCY'
  | 'UNSUPPORTED_MEDICAL_REQUEST';

export interface AssistantSourceCard {
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  badgeEn: string;
  badgeHi: string;
  targetRoute: string;
  ctaTextEn: string;
  ctaTextHi: string;
  itemsEn?: string[];
  itemsHi?: string[];
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  textEn: string;
  textHi: string;
  timestamp: string;
  intent?: AssistantIntent;
  sourceCard?: AssistantSourceCard;
  isEmergency?: boolean;
  highlightedMetrics?: Array<{
    labelEn: string;
    labelHi: string;
    value: string;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
  }>;
  isStreaming?: boolean;
  engine?: 'gemini' | 'deterministic';
  error?: string;
}

export interface SuggestedQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  category: 'reports' | 'metrics' | 'summary' | 'wellness' | 'trends';
  profileId?: string; // Optional: specifically tailored for a profile
}

export interface QuickInsight {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  route: string;
  badgeEn: string;
  badgeHi: string;
  iconName: 'file-text' | 'activity' | 'heart' | 'users';
}
