/**
 * SwasthyaAI - Centralized Gemini & Model Configuration
 * 
 * Single source of truth for model identifiers, limits, and supported profiles.
 * Model names verified against current official Google Gemini documentation:
 * - Text reasoning: gemini-3.8-flash
 * - Real-time Live WebSockets: gemini-3.1-flash-live-preview
 */

export const GEMINI_CONFIG = {
  // Official Flash-class text chat model
  TEXT_MODEL: 'gemini-3.8-flash',

  // Official native-audio real-time WebSocket model
  LIVE_MODEL: 'gemini-3.1-flash-live-preview',

  // Live API version for ephemeral token WebSocket connection
  LIVE_API_VERSION: 'v1alpha',

  // Valid synthetic demo profiles (strictly enforced server-side)
  ALLOWED_PROFILES: ['aarav', 'meera', 'savitri'] as const,

  // Server-side safety & rate limiting boundaries
  RATE_LIMIT_MAX_PER_MINUTE: 30,
  MAX_HISTORY_MESSAGES: 10,
  MAX_MESSAGE_CHARACTERS: 2000,
  MAX_SNIPPET_CHARACTERS: 500,
} as const;

export type AllowedProfileId = typeof GEMINI_CONFIG.ALLOWED_PROFILES[number];

export function isAllowedProfileId(id: unknown): id is AllowedProfileId {
  return typeof id === 'string' && (GEMINI_CONFIG.ALLOWED_PROFILES as readonly string[]).includes(id);
}
