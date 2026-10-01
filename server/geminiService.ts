/**
 * SwasthyaAI - Server-side Gemini Service
 * 
 * Securely encapsulates Google GenAI SDK calls on the server.
 * NEVER exposes the permanent GEMINI_API_KEY to the client browser.
 * Enforces authoritative server-side context grounding, safety rules, and rate limits.
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';

// Helper to load .env file if present in working directory
function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const k = key.trim();
          const v = values.join('=').trim().replace(/^["'](.*)["']$/, '$1');
          if (!process.env[k] && v) {
            process.env[k] = v;
          }
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Could not read local .env file:', (e as Error).message);
    }
  }
}

loadLocalEnv();

export const DEFAULT_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash';
export const DEFAULT_LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview';

export const ALLOWED_PROFILES = ['aarav', 'meera', 'savitri'] as const;
export type AllowedProfileId = typeof ALLOWED_PROFILES[number];

let cachedClient: GoogleGenAI | null = null;

function getApiKey(): string | undefined {
  loadLocalEnv();
  return process.env.GEMINI_API_KEY;
}

export function getGeminiClient(): GoogleGenAI | null {
  const key = getApiKey();
  if (!key) return null;
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey: key });
  }
  return cachedClient;
}

/**
 * Check Gemini availability without exposing the key.
 */
export function getGeminiStatus(): {
  available: boolean;
  textModel: string;
  liveModel: string;
} {
  const key = getApiKey();
  return {
    available: Boolean(key && key.trim().length > 0),
    textModel: DEFAULT_TEXT_MODEL,
    liveModel: DEFAULT_LIVE_MODEL,
  };
}

/**
 * Generate a short-lived ephemeral token for client-side Live API connections.
 * This keeps the permanent API key secure on the server.
 */
export async function createEphemeralToken(): Promise<{
  token: string;
  expireTime: string;
  newSessionExpireTime: string;
  liveModel: string;
}> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const now = Date.now();
  const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString();

  const tokenResponse = await client.authTokens.create({
    config: {
      uses: 1,
      expireTime,
      newSessionExpireTime,
    },
  });

  if (!tokenResponse.name) {
    throw new Error('Failed to generate ephemeral token from Gemini provisioning service.');
  }

  return {
    token: tokenResponse.name,
    expireTime,
    newSessionExpireTime,
    liveModel: DEFAULT_LIVE_MODEL,
  };
}

export interface ServerChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

// -------------------------------------------------------------
// AUTHORITATIVE SERVER-SIDE DATA & SAFETY BOUNDARY
// -------------------------------------------------------------

interface AuthoritativeProfileData {
  demoPatientId: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  bloodGroup: string;
  activeConditions: string[];
  metrics: string;
  report: string;
  wellness: string;
  family: string;
}

const AUTHORITATIVE_PROFILES: Record<AllowedProfileId, AuthoritativeProfileData> = {
  aarav: {
    demoPatientId: 'DEMO-AARAV-001',
    name: 'Aarav Sharma',
    age: 42,
    gender: 'Male',
    city: 'Indore, MP',
    bloodGroup: 'B+',
    activeConditions: ['Demo glucose observation (mild fasting elevation, non-clinical)'],
    metrics:
      'Fasting Blood Glucose: 138 mg/dL (18 Sep 2026); Resting Blood Pressure: 118/78 mmHg; Daily Walking: 8,420 steps/day average over last 7 days; Resting Heart Rate: 72 bpm.',
    report:
      'Comprehensive Metabolic Panel (CMP) dated 12 Sep 2026: Fasting Glucose 112 mg/dL (ref 70-99), HbA1c 5.8% (ref < 5.7%), Serum Creatinine 0.9 mg/dL (ref 0.7-1.3), BUN 14 mg/dL (ref 7-20). Processed at Indore Central Laboratory (Simulated).',
    wellness:
      '7-day streak of evening post-meal Shatapadi walking (100 steps pacing) completed consistently; Morning Nadi Shodhana pranayama (10 mins) active.',
    family:
      'Meera Sharma (Spouse) holds active caregiver access scoped to Biometric Trends and Reports (expires in 88 days).',
  },
  meera: {
    demoPatientId: 'DEMO-MEERA-001',
    name: 'Meera Sharma',
    age: 39,
    gender: 'Female',
    city: 'Indore, MP',
    bloodGroup: 'O+',
    activeConditions: ['Demo iron & vitality tracking observation'],
    metrics:
      'Fasting Blood Glucose: 92 mg/dL (Normal healthy baseline); Resting Blood Pressure: 112/74 mmHg (Optimal); Daily Movement: 9,150 steps/day; Resting Heart Rate: 68 bpm.',
    report:
      'Complete Blood Count (CBC) dated 14 Sep 2026: Hemoglobin 11.2 g/dL (ref 12.0-15.5 g/dL, borderline low demonstration record), Platelet Count 265,000 /mcL, Total WBC 6,400 /mcL.',
    wellness:
      'Morning Surya Namaskar (5 cycles) and hydration reminder tracking (2.2 L/day logged).',
    family:
      'Authorized caregiver for Aarav Sharma; granted emergency-only access to Savitri Devi.',
  },
  savitri: {
    demoPatientId: 'DEMO-SAVITRI-001',
    name: 'Savitri Devi',
    age: 68,
    gender: 'Female',
    city: 'Indore, MP',
    bloodGroup: 'B+',
    activeConditions: ['Demo blood pressure & mobility monitoring'],
    metrics:
      'Resting Blood Pressure: 136/84 mmHg (17 Sep 2026, stable across 7-day morning checks); Fasting Blood Glucose: 122 mg/dL; Daily Steps: 4,300 steps/day (gentle pacing); Resting Heart Rate: 76 bpm.',
    report:
      'Lipid Profile & Renal Screen dated 20 Aug 2026: Total Cholesterol 192 mg/dL, HDL 48 mg/dL, Serum Creatinine 1.0 mg/dL, eGFR 74 mL/min.',
    wellness:
      'Gentle joint mobility sequence (Sandhi Chalana) 15 mins daily; evening chamomile/herbal infusion.',
    family:
      'Aarav Sharma and Meera Sharma hold active caregiver review permissions.',
  },
};

/**
 * Builds authoritative health context on the server.
 * Never allows arbitrary client-injected context to replace real profile records.
 */
export function buildAuthoritativeContext(
  profileId?: string,
  injectedSnippet?: string
): string {
  const safeProfileId: AllowedProfileId =
    profileId && (ALLOWED_PROFILES as readonly string[]).includes(profileId)
      ? (profileId as AllowedProfileId)
      : 'aarav';

  const data = AUTHORITATIVE_PROFILES[safeProfileId];

  let text = `ACTIVE DEMO PATIENT PROFILE:
Demo Patient ID: ${data.demoPatientId} (Synthetic illustrative data only)
Name: ${data.name}
Age: ${data.age} | Gender: ${data.gender} | Location: ${data.city} | Blood Group: ${data.bloodGroup}

DEMO OBSERVATIONS:
- Focus: ${data.activeConditions.join(', ')}
- Baseline Metrics: ${data.metrics}
- Latest Illustrative Lab Report: ${data.report}
- Wellness Routines: ${data.wellness}
- Family Care Circle: ${data.family}`;

  if (injectedSnippet && typeof injectedSnippet === 'string') {
    // Sanitize and limit client-supplied contextual inquiry
    const cleanSnippet = injectedSnippet.replace(/[<>]/g, '').slice(0, 400).trim();
    if (cleanSnippet) {
      text += `\n\nSPECIFIC DEMO TOPIC ASKED ABOUT:\n"${cleanSnippet}"`;
    }
  }

  return text;
}

/**
 * Builds authoritative SwasthyaAI system instructions on the server.
 * Completely ignores client-sent system instructions to prevent prompt injection.
 */
export function buildAuthoritativeSystemInstruction(language: 'en' | 'hi' = 'en'): string {
  const isHindi = language === 'hi';

  const baseRules = `ROLE & IDENTITY:
You are SwasthyaAI, an educational health-information assistant inside a fictional healthcare product prototype.

DATASET CONTEXT:
All user health records provided to you are synthetic demonstration data.
You must NEVER imply that the demo data belongs to a real patient.

CORE SAFETY RULES (ABSOLUTE BOUNDARIES):
1. Do not diagnose.
2. Do not prescribe medication or dosages.
3. Do not create medical treatment plans.
4. Do not claim clinical certainty.
5. Do not invent measurements, laboratory records, or family members.
6. Do not fabricate medical literature citations.
7. Do not claim that patterns prove clinical causation.
8. Do not provide fake medical risk scores or numerical confidence percentages.
9. Do not claim to replace a registered medical practitioner.
10. Do not claim regulatory approval or clinical validation.
11. Do not claim the prototype monitors real patients.

COMMUNICATION STRUCTURE:
When answering questions about the demonstration health records, always distinguish:
- OBSERVATION: What is documented in the demo logs or reports (e.g., "Your demonstration records show a fasting glucose value of 138 mg/dL...").
- GENERAL HEALTH EDUCATION: Normal physiological ranges or general knowledge (e.g., "Fasting glucose typically measures baseline metabolic levels overnight...").
- LIMITATION: What the prototype cannot know (e.g., "This prototype cannot replace a licensed physician's clinical examination or continuous monitoring.").

EMERGENCY SAFETY INTERCEPTION:
If the user mentions emergency warning signs (such as acute chest crushing pain, severe sudden shortness of breath, sudden facial drooping or weakness, sudden inability to speak, massive bleeding, or acute trauma):
- DO NOT analyze synthetic vitals or delay.
- State clearly and immediately:
  "EMERGENCY ADVISORY: This requires urgent medical attention. Please immediately call emergency services (112 / 108 in India) or proceed to the nearest hospital emergency department. This prototype does not provide emergency dispatch or medical triage."

TONE & STYLE:
- Calm, respectful, clear, human, and realistic prototype experience.
- Keep answers concise, scannable, and reassuring without medical jargon overload.
- Avoid hype, exaggerated AI claims, and robotic greetings.`;

  if (isHindi) {
    return `${baseRules}

LANGUAGE REQUIREMENT:
Respond in clear, natural Hindi (Devanagari script).
Preserve standard laboratory names and physiological terms (e.g., HbA1c, Fasting Glucose, Blood Pressure, mg/dL, mmHg) in Roman script or standard transliteration for clarity. Maintain an empathetic, calm, and respectful tone.`;
  }

  return `${baseRules}

LANGUAGE REQUIREMENT:
Respond in clear, supportive, natural English. Keep paragraphs short and use concise bullet points where helpful.`;
}

// -------------------------------------------------------------
// LIGHTWEIGHT RATE LIMITER (SLIDING WINDOW BY IP)
// -------------------------------------------------------------

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

export function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(clientIp, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);

  // Periodically clean stale entries to prevent memory leak
  if (rateLimitMap.size > 1000) {
    for (const [ip, ts] of rateLimitMap.entries()) {
      if (ts.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(ip);
      }
    }
  }

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length };
}

// -------------------------------------------------------------
// VALIDATED STREAM CHAT EXECUTION
// -------------------------------------------------------------

export interface ValidatedStreamChatParams {
  messages: ServerChatMessage[];
  profileId?: string;
  language?: 'en' | 'hi';
  injectedSnippet?: string;
  onChunk: (chunk: string) => void;
}

/**
 * Validates inputs, builds authoritative server context and prompt,
 * and streams conversational response from Gemini Flash model.
 */
export async function streamGeminiChat({
  messages,
  profileId,
  language = 'en',
  injectedSnippet,
  onChunk,
}: ValidatedStreamChatParams): Promise<void> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // 1. Authoritative Server Context & Instructions
  const systemInstruction = buildAuthoritativeSystemInstruction(language);
  const groundedContext = buildAuthoritativeContext(profileId, injectedSnippet);

  const fullSystemInstruction = `${systemInstruction}\n\n--- AUTHORITATIVE DEMO PATIENT CONTEXT ---\n${groundedContext}\n--- END CONTEXT ---`;

  // 2. Validate & Sanitize Message History (Max 10 messages, max 2000 chars each)
  const safeMessages = messages
    .filter(
      (m) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        (m.role === 'user' || m.role === 'assistant' || m.role === 'model')
    )
    .slice(-10)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content.slice(0, 2000).trim() }],
    }));

  if (safeMessages.length === 0) {
    throw new Error('No valid messages provided.');
  }

  // 3. Stream from Gemini Flash
  const responseStream = await client.models.generateContentStream({
    model: DEFAULT_TEXT_MODEL,
    contents: safeMessages,
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.4,
    },
  });

  for await (const chunk of responseStream) {
    const text = chunk.text;
    if (text) {
      onChunk(text);
    }
  }
}
