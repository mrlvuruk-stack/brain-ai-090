# Phase 5.5 — Real Gemini AI + Real-Time Voice Experience Documentation

> **SwasthyaAI** — Educational Healthcare Intelligence Web Prototype  
> **Status**: Phase 5.5 Hardened Engineering & Verification Pass Complete  
> **Design Philosophy**: Calm Clinical Intelligence  
> **Prototype Boundary**: Strictly non-diagnostic; uses synthetic demonstration data only.

---

## 1. Overview & Realistic Experience Goals

Phase 5.5 transitions the SwasthyaAI web prototype from simulated deterministic interactions into a **realistic prototype experience** powered by Google's official Gemini API.

It implements:
1. **Server-Side Trust Boundary**: Authoritative health context and non-diagnostic system instructions are built and enforced on the server. The permanent `GEMINI_API_KEY` is strictly confined to server-side memory and never exposed to client bundles or browser storage.
2. **Real-Time Streaming Text Assistant**: Powered by `gemini-3.8-flash` via Server-Sent Events (SSE) with application-level safety interception.
3. **Real-Time Voice Assistant (Web Audio + WebSockets)**: Powered by `gemini-3.1-flash-live-preview` via official `@google/genai` Live API using short-lived ephemeral tokens, 16kHz PCM microphone capture, 24kHz PCM audio streaming output, live bi-directional transcription, and natural barge-in interruption.
4. **Synthetic Health Data Grounding**: Authoritative grounding in fictional demonstration records (`DEMO-AARAV-001`, `DEMO-MEERA-001`, `DEMO-SAVITRI-001`) with strict profile isolation.
5. **Non-Diagnostic Guardrails & Emergency Interception**: Prohibits diagnosis, prescriptions, or clinical certainty claims, with application-level safety interception directing users to 112 / 108.
6. **Graceful Deterministic Fallback**: Automatic failover to local prototype intelligence if API quotas or network connections drop.

---

## 2. System Architecture & Trust Boundary

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT                                │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │  AssistantPage        │             │  LiveVoiceModal            │  │
│  │  - SSE Streaming Chat │             │  - Web Audio Context       │  │
│  │  - Contextual Banner  │             │  - 16kHz PCM Downsampler   │  │
│  │  - Copy & Retry       │             │  - 24kHz PCM Player        │  │
│  │  - Profile Isolation  │             │  - Real Audio Visualizer   │  │
│  └───────────▲───────────┘             │  - Voice Emergency Interc. │  │
│              │                         └─────────────▲──────────────┘  │
│              │ POST /api/gemini/chat                 │ Live WebSocket  │
│              │ (SSE Stream)                          │ (Ephemeral Tok) │
└──────────────┼───────────────────────────────────────┼─────────────────┘
               │                                       │
┌──────────────▼───────────────────────────────────────┼─────────────────┐
│               LOCAL BACKEND & API LAYER (Node / Vite)│                 │
│                                                      │                 │
│  GET  /api/gemini/status ──> Check API Availability  │                 │
│  POST /api/gemini/token  ──> Mint Ephemeral Token ───┘                 │
│  POST /api/gemini/chat   ──> Authoritative Context & SSE Stream        │
│                                                                        │
│  • Enforces Max 10 Messages & 2000 Chars/Msg                           │
│  • Rate Limiter: Max 30 req/min per IP (Sliding Window)                │
│  • Ignores untrusted client system instructions                        │
│  • Builds authoritative grounded context from allowed profile IDs      │
│  • Permanent GEMINI_API_KEY never leaks to browser                     │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   GOOGLE GEMINI API CLOUD                              │
│                                                                        │
│  • ai.authTokens.create(...)  [Provisioning short-lived session token] │
│  • ai.models.generateContentStream(...)           [Text Assistant Chat]│
│  • wss://generativelanguage.googleapis.com/...    [Live Audio Session] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Exact Model Configuration

All Gemini models are centralized in `src/services/gemini/geminiConfig.ts` and `server/geminiService.ts`:

| Purpose | Model Identifier | API Protocol | Reference |
|:---|:---|:---|:---|
| **Text Reasoning & Chat** | `gemini-3.8-flash` | HTTP POST (SSE stream) | Current official Flash-class chat model |
| **Real-Time Live Voice** | `gemini-3.1-flash-live-preview` | WebSockets via `@google/genai` | Current official native audio Live API |
| **Live WebSocket Version** | `v1alpha` | WebSocket Subprotocol | Required for ephemeral token Live sessions |

Environment overrides (`.env`):
```bash
GEMINI_API_KEY=your_key_here
GEMINI_TEXT_MODEL=gemini-3.8-flash
GEMINI_LIVE_MODEL=gemini-3.1-flash-live-preview
```

---

## 4. Ephemeral Token Security Architecture

To allow the browser to initiate a real-time WebSocket connection to Gemini Live without exposing the permanent API key:
1. **Client Request**: Browser calls `POST /api/gemini/token`.
2. **Server-Side Minting**: The server invokes `ai.authTokens.create({ config: { uses: 1, expireTime, newSessionExpireTime } })` using the secret master `GEMINI_API_KEY`.
3. **Scoped Lifetime**:
   - `newSessionExpireTime`: 2 minutes (token must be used to establish the connection within 120 seconds).
   - `expireTime`: 30 minutes (session terminates automatically after 30 minutes).
   - `uses`: Exactly 1 connection allowed per token.
4. **Zero Key Transmission**: The permanent key never touches browser memory, local storage, or network responses. Tokens are ephemeral and single-use.

---

## 5. Server-Side Trust Boundary Hardening

In `/api/gemini/chat`:
- **Allowed Profiles**: Only `'aarav' | 'meera' | 'savitri'` are accepted. Unknown profile IDs default safely to `'aarav'`.
- **Authoritative Context**: The server builds the grounded profile context directly from server-side synthetic patient records (`DEMO-AARAV-001`, `DEMO-MEERA-001`, `DEMO-SAVITRI-001`).
- **Ignored Client Prompts**: Client-supplied `systemInstruction` is discarded. The server constructs the non-bypassable educational prompt with non-diagnostic boundaries.
- **Payload & History Limits**:
  - Request body size strictly capped at 256KB.
  - Maximum message history limited to 10 messages.
  - Maximum character count per message capped at 2,000 characters.
  - Injected snippets sanitized and capped at 400 characters.
- **Rate Limiting**: Sliding window tracking up to 30 requests per minute per IP address. Excess requests return HTTP 429 (`Too Many Requests`).

---

## 6. Synthetic Grounding & Profile Isolation

The assistant is strictly grounded using `buildGeminiHealthContext(profileId, injectedContext)`:
- **Aarav Sharma (`DEMO-AARAV-001`)**: Demo glucose observation (mild fasting elevation, non-clinical), Comprehensive Metabolic Panel dated 12 Sep 2026, evening Shatapadi walk routine, caregiver link to Meera Sharma.
- **Meera Sharma (`DEMO-MEERA-001`)**: Demo iron & vitality tracking observation, Complete Blood Count dated 14 Sep 2026 (Hb 11.2 g/dL), Surya Namaskar routine, caregiver link to Aarav and emergency access to Savitri.
- **Savitri Devi (`DEMO-SAVITRI-001`)**: Demo blood pressure & mobility monitoring, Lipid & Renal Screen dated 20 Aug 2026, gentle joint mobility routine, caregiver link to Aarav and Meera.

### Profile Switching Boundary
Switching profiles via the top navigation triggers an automatic purge:
- Assistant conversation history is cleared.
- Injected context from previous pages is cleared.
- Active voice modal re-initializes and re-indexes context specifically for the new active profile.
- Verified: *"Profile context is switched without intentionally mixing the synthetic demo records between profiles."*

---

## 7. Safety, Emergency & Medical Language Guardrails

### Core System Instruction
```
ROLE & IDENTITY:
You are SwasthyaAI, an educational health-information assistant inside a fictional healthcare product prototype.

DATASET CONTEXT:
All user health records provided to you are synthetic demonstration data.
You must NEVER imply that the demo data belongs to a real patient.

CORE SAFETY RULES:
- Do not diagnose.
- Do not prescribe medication or dosages.
- Do not create medical treatment plans.
- Do not claim clinical certainty.
- Do not invent measurements or records.
- Always distinguish OBSERVATION from GENERAL HEALTH EDUCATION from LIMITATION.
```

### Emergency Safety Interception (Text & Voice)
- **Text Queries**: Detected red-flag symptoms (e.g., severe chest pain, shortness of breath, loss of consciousness) are intercepted immediately by application safety logic before LLM generation. Renders an emergency alert banner directing users to **112 (National Emergency)** and **108 (Ambulance)**.
- **Voice Sessions**: Real-time user audio transcription is monitored for emergency keywords. If detected, playback is interrupted, an emergency advisory transcription is inserted, and a high-priority red alert banner with quick-call buttons appears in the modal.
- **Medical Terminology Audit**: Synthetic records consistently use `illustrative laboratory report`, `illustrative lab report`, and `synthetic laboratory data`. Legitimate mentions of "diagnostic" are restricted to disclaimers affirming the prototype does not provide medical diagnosis.

---

## 8. Verification Results & Status

| Verification Item | Status | Details |
|:---|:---:|:---|
| **Linter (`oxlint`)** | PASSED | 0 warnings, 0 errors across 80 files |
| **TypeScript (`npx tsc -b`)** | PASSED | Strict type checking with 0 errors |
| **Production Build (`vite build`)** | PASSED | Bundled cleanly (`dist/`) in <1s |
| **Status API (`/api/gemini/status`)** | PASSED | Returns `available: true`, model names |
| **Token API (`/api/gemini/token`)** | PASSED | Mints 30-min single-use ephemeral token |
| **Text Chat Streaming (`/api/gemini/chat`)** | PASSED | Real SSE token streaming with `gemini-3.8-flash` |
| **Standalone Node Server (`server/index.mjs`)** | PASSED | Serves SPA, handles API routes, enforces rate limits |
| **Server Trust Boundary** | PASSED | Authoritative server prompts, 256KB limit, 429 on rate limit |
| **Profile Isolation** | PASSED | Aarav ➔ Meera ➔ Savitri purges conversation and re-indexes context |
| **Emergency Interception (Text)** | PASSED | Immediate red alert banner and helpline guidance |
| **Emergency Interception (Voice)** | PASSED | Client-side transcript interceptor & prompt protocol |
| **Browser Voice Verification** | PROGRAMMATICALLY VERIFIED | Programmatically verified WebSocket handshake, audio pipelines, and UI states. *Physical microphone/speaker interaction requires manual browser verification.* |
| **Responsive QA (6 Viewports)** | PASSED | 1440x900, 1280x800, 1024x768, 768x1024, 390x844, 375x667 all confirmed 0 horizontal overflow |
| **Browser Console Audit** | PASSED | 0 console errors or uncaught promise rejections |
| **Secret Audit** | PASSED | `GEMINI_API_KEY` absent from client code, HTML, and dist bundle |

---

## 9. Known Prototype Limitations

1. **Physical Audio Verification**: While the Web Audio capture pipeline, 16kHz PCM downsampler, 24kHz PCM playback engine, and Gemini Live WebSocket handshakes are programmatically and structurally verified, real-world acoustic echo cancellation and physical hardware microphone behavior depend on user browser and hardware environments.
2. **Prototype Boundary**: SwasthyaAI is an **educational software demonstration prototype**. It does not connect to real clinical telemetries, hospitals, ABHA registries, or real emergency dispatch centers.
3. **Session-Only Memory**: Conversations are held in client-side session memory only and are intentionally not persisted across reloads or profile switches.
