/**
 * SwasthyaAI - Standalone Production Server
 * 
 * Serves the built frontend from `dist` and provides the /api/gemini routes.
 * Run with: node server/index.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getGeminiStatus,
  createEphemeralToken,
  streamGeminiChat,
  checkRateLimit,
} from './geminiService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Protect against overly large payloads (256KB limit)
      if (body.length > 256 * 1024) reject(new Error('Payload too large. Maximum allowed is 256KB.'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.end(JSON.stringify(data));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

const server = http.createServer(async (req, res) => {
  const url = req.url?.split('?')[0];

  // API Routes
  if (url?.startsWith('/api/gemini')) {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);
    res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));

    if (!rateLimit.allowed) {
      return sendJson(res, 429, {
        error: 'Rate limit exceeded for prototype assistant. Please wait a minute before sending more queries.',
      });
    }

    if (url === '/api/gemini/status' && req.method === 'GET') {
      return sendJson(res, 200, getGeminiStatus());
    }

    if (url === '/api/gemini/token' && req.method === 'POST') {
      try {
        const tokenData = await createEphemeralToken();
        return sendJson(res, 200, tokenData);
      } catch (e) {
        return sendJson(res, 500, { error: e.message || 'Failed to generate token' });
      }
    }

    if (url === '/api/gemini/chat' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
          return sendJson(res, 400, { error: 'Missing or empty messages array' });
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');

        await streamGeminiChat({
          messages: body.messages,
          profileId: body.profileId,
          language: body.language,
          injectedSnippet: body.injectedSnippet,
          onChunk: (chunk) => {
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          },
        });

        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } catch (e) {
        if (!res.headersSent) {
          return sendJson(res, 500, { error: e.message || 'Gemini streaming failed' });
        } else {
          res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
          res.end();
          return;
        }
      }
    }
  }

  // Static File Serving from dist
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // If file doesn't exist, serve index.html for SPA client-side routing
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const isHashedAsset = url?.startsWith('/assets/');
  const isHtml = ext === '.html' || filePath.endsWith('index.html');

  try {
    const data = fs.readFileSync(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (isHashedAsset) {
      // Vite hashed static chunks are immutable
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (isHtml) {
      // Always revalidate the entry HTML so new builds are immediately loaded
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      // Standard static assets (e.g. favicon, manifest)
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    res.end(data);
  } catch {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`[SwasthyaAI Production Server] Listening on http://localhost:${PORT}`);
});
