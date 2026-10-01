/**
 * SwasthyaAI - Vite Plugin for Gemini API endpoints
 * 
 * Injects lightweight API routes into Vite dev and preview servers:
 * - GET  /api/gemini/status
 * - POST /api/gemini/token
 * - POST /api/gemini/chat
 */

import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  getGeminiStatus,
  createEphemeralToken,
  streamGeminiChat,
  checkRateLimit,
  type ServerChatMessage,
} from './geminiService.ts';

// Helper to parse JSON body from incoming stream with strict 256KB limit
async function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Protect against overly large payloads (max 256KB)
      if (body.length > 256 * 1024) {
        reject(new Error('Payload too large. Maximum allowed is 256KB.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function handleApiRoutes(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url?.split('?')[0];

  if (!url?.startsWith('/api/gemini')) {
    return next();
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));

  if (!rateLimit.allowed) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded for prototype assistant. Please wait a minute before sending more queries.',
    });
  }

  // 1. GET /api/gemini/status
  if (req.method === 'GET' && url === '/api/gemini/status') {
    try {
      const status = getGeminiStatus();
      return sendJson(res, 200, status);
    } catch (e) {
      return sendJson(res, 500, { error: (e as Error).message });
    }
  }

  // 2. POST /api/gemini/token (Create ephemeral token for Live API)
  if (req.method === 'POST' && url === '/api/gemini/token') {
    (async () => {
      try {
        const tokenData = await createEphemeralToken();
        return sendJson(res, 200, tokenData);
      } catch (e) {
        return sendJson(res, 500, {
          error: (e as Error).message || 'Failed to generate Live API token',
        });
      }
    })();
    return;
  }

  // 3. POST /api/gemini/chat (Stream text generation)
  if (req.method === 'POST' && url === '/api/gemini/chat') {
    (async () => {
      try {
        const body = await parseJsonBody<{
          messages?: ServerChatMessage[];
          profileId?: string;
          language?: 'en' | 'hi';
          injectedSnippet?: string;
        }>(req);

        if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
          return sendJson(res, 400, { error: 'Missing or empty messages array in request body.' });
        }

        // Set up Server-Sent Events headers
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        await streamGeminiChat({
          messages: body.messages,
          profileId: body.profileId,
          language: body.language,
          injectedSnippet: body.injectedSnippet,
          onChunk: (chunk: string) => {
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          },
        });

        res.write('data: [DONE]\n\n');
        res.end();
      } catch (e) {
        if (!res.headersSent) {
          return sendJson(res, 500, { error: (e as Error).message || 'Gemini streaming failed' });
        } else {
          res.write(`data: ${JSON.stringify({ error: (e as Error).message })}\n\n`);
          res.end();
        }
      }
    })();
    return;
  }

  return next();
}

export function vitePluginGemini(): Plugin {
  return {
    name: 'vite-plugin-gemini',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => handleApiRoutes(req, res, next));
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => handleApiRoutes(req, res, next));
    },
  };
}
