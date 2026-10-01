/**
 * SwasthyaAI - Client-side Gemini API Service
 * 
 * Interacts with the local server API endpoints (/api/gemini/*).
 * Never holds or transmits the permanent API key.
 */

import type { EphemeralTokenResponse, GeminiStatusResponse } from './geminiTypes';
import { GEMINI_CONFIG } from './geminiConfig';

export async function checkGeminiStatus(): Promise<GeminiStatusResponse> {
  try {
    const res = await fetch('/api/gemini/status', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return { available: false, textModel: GEMINI_CONFIG.TEXT_MODEL, liveModel: GEMINI_CONFIG.LIVE_MODEL };
    }
    return await res.json();
  } catch {
    return { available: false, textModel: GEMINI_CONFIG.TEXT_MODEL, liveModel: GEMINI_CONFIG.LIVE_MODEL };
  }
}

export async function requestEphemeralToken(): Promise<EphemeralTokenResponse> {
  const res = await fetch('/api/gemini/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    let errMessage = 'Failed to generate voice session token';
    try {
      const errData = await res.json();
      if (errData.error) errMessage = errData.error;
    } catch {
      // fallback
    }
    throw new Error(errMessage);
  }

  return await res.json();
}

export interface StreamChatOptions {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  profileId?: string;
  language?: 'en' | 'hi';
  injectedSnippet?: string;
  systemInstruction?: string;
  groundedContext?: string;
  signal?: AbortSignal;
  onChunk: (token: string) => void;
  onError?: (error: Error) => void;
}

export async function streamChatMessage({
  messages,
  profileId,
  language,
  injectedSnippet,
  signal,
  onChunk,
  onError,
}: StreamChatOptions): Promise<string> {
  let fullAccumulatedText = '';

  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        messages,
        profileId,
        language,
        injectedSnippet,
      }),
      signal,
    });

    if (!res.ok) {
      let errorMsg = `Server returned status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.error) errorMsg = errJson.error;
      } catch {
        // fallback
      }
      throw new Error(errorMsg);
    }

    if (!res.body) {
      throw new Error('Readable stream not supported by browser.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') {
          return fullAccumulatedText;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            fullAccumulatedText += parsed.text;
            onChunk(parsed.text);
          }
        } catch (e) {
          if ((e as Error).message && (e as Error).message !== 'Unexpected end of JSON input') {
            console.warn('[GeminiClient] SSE parse error:', e);
          }
        }
      }
    }

    return fullAccumulatedText;
  } catch (err) {
    if (signal?.aborted) {
      return fullAccumulatedText;
    }
    const error = err instanceof Error ? err : new Error(String(err));
    if (onError) onError(error);
    throw error;
  }
}
