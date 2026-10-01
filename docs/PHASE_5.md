# SwasthyaAI Phase 5: Health Intelligence & Decision-Support Experience

> **CRITICAL BOUNDARY NOTICE**  
> *Phase 5 uses deterministic synthetic data and does not provide real medical diagnosis, treatment, clinical decision-making, or medical advice.*

---

## 1. Phase Objective

Phase 5 introduces a quiet, grounded, and explainable **Health Intelligence & Decision-Support Layer** to the SwasthyaAI web-only prototype. 

Building upon the foundations established across Phases 0–4 (Profile, Journey, Reports, Metrics, Wellness, Goals, Family, Assistant, Search), Phase 5 answers the central user question:
> **"What does all of this information mean together?"**

The experience focuses on:
- Contextual health intelligence connecting biometric logs, diagnostic reports, wellness goals, and family access.
- Transparent, inspectable reasoning through a 5-factor explainability panel ("Why am I seeing this?").
- Source traceability linking every observation back to specific synthetic demo records.
- Strict non-causal pattern recognition ("observed alongside", "appeared during the same period").
- Seamless contextual handoff into the existing conversational assistant ("Ask about this").
- Multi-profile isolation across Aarav Sharma, Meera Sharma, and Savitri Devi.
- Bilingual parity (English and Hindi via Noto Sans Devanagari) and Senior Mode (~60px touch targets, high contrast).

---

## 2. Intelligence Architecture

```
[ Synthetic Records: Biometrics, Lab Reports, Milestones, Wellness Routines, Family Permissions ]
                                   │
                                   ▼
             Deterministic Health Intelligence Engine
             (src/data/intelligenceData.ts & intelligenceTypes.ts)
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
  /prototype/intelligence   /prototype/patterns     /prototype/summary
  (Health Intelligence Hub) (Non-Causal Patterns)   (Personal Story)
           │                       │                       │
           └───────────────────────┼───────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
Explainability Panel                               Contextual Assistant Handoff
("Why am I seeing this?")                          ("Ask about this" with context banner)
  • Observation                                      • Injected context snippet
  • Synthetic Sources                                • Source route traceability
  • Time Window                                      • Dynamic starter questions
  • Related Context
  • Honest Limitations
```

The system strictly avoids AI hype, neon/glowing HUDs, fake confidence percentages (e.g., "98% accuracy"), and ungrounded claims. It communicates intelligence through **information design, evidence counting, and observational language**.

---

## 3. New Routes

1. **`/prototype/intelligence`** — **Health Intelligence Center**:
   - Primary intelligence hub answering "What is worth noticing?".
   - Time-range filters: 7 Days, 30 Days, 90 Days, 6 Months.
   - Category filtering: All, Changes, Reports, Wellness, Family Access.
   - Data coverage indicators (e.g., "Based on 4 comparable demo observations").
   - Simulated Prototype Evaluation Activity Drawer with traceable records.
   - Grounded context summary and boundary notices.

2. **`/prototype/patterns`** — **Health Pattern Explorer**:
   - Interactive multi-metric relationships visualized via comparative dual-axis SVG trend charts.
   - Strictly enforces non-causal language ("Observed alongside", "Appeared during the same period").
   - Categories: Rest & Movement, Routine & Biometrics, Wellness Goals.
   - Source chips linking to relevant metrics, reports, and journey events.

3. **`/prototype/summary`** — **Personal Health Summary**:
   - Longitudinal synthesis ("Your recent health story") over 7d, 30d, 90d, 6m windows.
   - Aggregate counts: Biometric logs, illustrative reports, journey events, wellness goals.
   - Ordered grounded observations with source traceability chips and direct "Ask" action.
   - Explicit **"What this summary does NOT include"** boundaries:
     - No continuous clinical monitoring or hospital telemetry
     - No physician diagnostic clinical examination or treatment decisions
     - No real-world physical laboratory sample verification
     - No comprehensive historical medical records prior to the prototype window

---

## 4. New & Enhanced Components

### New Components (`src/components/intelligence/`):
- `InsightCard.tsx`: Structured intelligence card displaying title, observational nature badges (`OBSERVATION`, `INTERPRETATION`, `GENERAL EDUCATION`), date, relevance indicators, data coverage metrics, source chips, and action triggers.
- `InsightExplanation.tsx`: Accessible dialog (with `Escape` key trap and focus restoration) displaying the 5 transparent reasoning factors.
- `HealthPatternCard.tsx`: SVG dual-series line charts with responsive viewBox, grid markers, metric legends, non-causal disclaimers, and contextual assistant handoff.
- `SourceChipList.tsx`: Traceable chips mapping sources (`report`, `metric`, `timeline`, `goal`, `wellness`, `family`) with icons and deep navigation links.
- `ContextualAskButton.tsx`: Unified trigger injecting current item context into state and transitioning to the Assistant.
- `TimeRangeSelector.tsx`: Accessible radio-group pill selector supporting 7d, 30d, 90d, and 6m intervals with keyboard navigation.
- `IntelligenceActivityDrawer.tsx`: Transparent simulated log of evaluation actions with direct links to records.

### Enhanced Existing Views:
- **`PrototypeOverviewPage.tsx`**: Added restrained "Health Intelligence (Recent Observations)" section featuring 3 prioritized demo insights with direct "View explanation" triggers.
- **`ReportAnalysisPage.tsx`**: Extended with Key Observations, a 3-step Traceability Flow (Report Value → Related Metric → Timeline Event), Contextual Questions to explore, and certified laboratory disclaimer.
- **`AssistantPage.tsx`**: Added Injected Context Banner with quote snippet, origin attribution, clear button, and dynamically injected starter questions.
- **`ReportsLibraryPage.tsx`**, **`HealthJourneyPage.tsx`**, **`HealthGoalsPage.tsx`**, **`HealthIntelligencePage.tsx`**: Integrated `ContextualAskButton` across cards.

---

## 5. New Data Architecture & Types

Defined in `src/data/intelligenceTypes.ts`:
- `HealthInsight`: Unique ID, profileId, title, summary, category (`change` | `pattern` | `report` | `wellness` | `timeline` | `family` | `general_education`), date, timeRange, relevance (`recent_observation` | `contextual_routine` | `needs_review` | `informative`), observation nature (`observation` | `interpretation` | `general_education`), sources array, evidenceCount, dataCoverageLabel, explanation, relatedRoutes, and suggestedQuestions.
- `InsightSource`: ID, title, type (`report` | `metric` | `timeline` | `goal` | `wellness` | `family`), date, and route.
- `InsightExplanationData`: 5 factors: `observationEn`/`Hi`, `sourcesEn`/`Hi`, `timeWindowEn`/`Hi`, `contextEn`/`Hi`, `limitationsEn`/`Hi`.
- `HealthPattern`: Metric pairings, series values, observation summaries, and non-causal disclaimers.
- `HealthSummaryData`: Profile metadata, narrative summary, counts, grounded observation list, and exclusion list.
- `InjectedAssistantContext`: Transport payload passing title, date, snippet, source route, and starter questions into the assistant.

---

## 6. Deterministic Insight Rules

The local deterministic engine (`src/data/intelligenceData.ts`) implements grounded evaluation logic:
1. **Change Observations**: Produced only when at least 2 comparable synthetic biometric logs exist within the active time window (e.g., fasting glucose shifting from 144 to 138 mg/dL).
2. **Timeline & Report Co-occurrences**: Evaluated when diagnostic report timestamps coincide with biometric spikes or milestones within a 7-day window.
3. **Routine Adherence Relationships**: Generated when wellness habits (e.g., Shatapadi evening walks) reach >= 7 check-ins alongside active step metrics.
4. **Caregiver Consent Records**: Triggered by active time-bounded consent events in the family circle.
5. **No Data / Coverage Limits**: When a profile lacks records for a selected window (e.g., 6 months for a newer profile), the engine returns an honest empty state ("Not enough illustrative data for this period") without fabricating synthetic entries.

---

## 7. Explainability Model (5-Factor Panel)

When the user activates **"Why am I seeing this?"**, the prototype presents:
1. **OBSERVATION (What changed?)**: The exact delta between recorded demo entries.
2. **SOURCES (Which demo records support this?)**: Specific count and links to supporting logs, reports, and journey milestones.
3. **TIME WINDOW (Which dates were considered?)**: Explicit start and end date bounds.
4. **CONTEXT (What related information was considered?)**: Diurnal timing (morning vs evening), fasting status, or routine streaks.
5. **LIMITATIONS (What information was NOT available?)**: Clarifies that continuous clinical telemetry and full medical history are absent.

No fabricated internal weights or AI "chain-of-thought" are presented.

---

## 8. Source Traceability

Every insight, summary point, and pattern links directly to synthetic demo evidence:
- `Report · 12 Sep 2026` ➔ Navigates to `/prototype/report-analysis?id=rep-001`
- `Metric · 18 Sep 2026` ➔ Navigates to `/prototype/health-intelligence`
- `Timeline · 18 Sep 2026` ➔ Navigates to `/prototype/journey`
- `Goal · 15 Sep 2026` ➔ Navigates to `/prototype/goals`
- `Family · 01 Sep 2026` ➔ Navigates to `/prototype/family`

---

## 9. Assistant Integration ("Ask About This")

Contextual handoff allows users to query specific observations without retyping details:
1. User clicks **"Ask SwasthyaAI"** or **"Ask about this measurement"**.
2. State stores `injectedContext` payload via `PrototypeContext`.
3. Navigation transitions to `/prototype/assistant`.
4. Assistant renders the **Context Injected Banner**:
   - Displays: *"Context provided by: [Title] ([Date])"*
   - Displays excerpt snippet.
   - Shows boundary reminder: *"The assistant answers questions based only on this supplied demo record context."*
   - Pre-populates contextual starter questions.
   - Provides `[X Clear context]` button.

---

## 10. Accessibility (WCAG 2.2 AA)

- **Semantic HTML**: `<header>`, `<main>`, `<section>`, `<article>`, `<button>`, `<dialog>` with proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
- **Focus Management**: Focus trapped within `InsightExplanation` modal; `Escape` key closes dialog; focus returns to the triggering button.
- **Touch Targets**: Minimum 48px target sizes; in Senior Mode, targets expand to approximately 60px.
- **Color Independence**: Badges and status pills pair distinct colors with unambiguous text labels and iconography.
- **Reduced Motion**: All transitions and SVG animations respect `prefers-reduced-motion: reduce`.
- **Keyboard Navigation**: Complete tab sequence, `Ctrl+K` search modal trigger, `Escape` key dismissal.

---

## 11. Responsive QA Matrix

Validated across all 6 required viewport resolutions with zero horizontal scroll, clipping, or overlapping:

| Viewport | Device Class | Layout Adaptation | Status |
| :--- | :--- | :--- | :--- |
| **1440 × 900** | Desktop Standard | Full sidebar, 2-column intelligence layout, activity sidebar | Verified |
| **1280 × 800** | Desktop Compact | Sidebar collapsed if needed, responsive grid cards | Verified |
| **1024 × 768** | Small Desktop / Tablet Landscape | Flex-wrapped filter pills, aligned SVG pattern charts | Verified |
| **768 × 1024** | Tablet Portrait | Off-canvas drawer navigation, simplified topbar breadcrumb | Verified |
| **390 × 844** | Modern Mobile (iPhone 14) | Sticky bottom navigation bar, single-column cards | Verified |
| **375 × 667** | Small Mobile (iPhone SE) | Stacked metrics, responsive touch buttons, 0 horizontal scroll | Verified |

---

## 12. Safety & Compliance Audit

A comprehensive codebase audit verified compliance with non-diagnostic and prototype rules:
- **No Unsafe Claims**: Zero occurrences of `risk score`, `clinical accuracy`, `confidence %`, `real-time vitals`, or algorithmic medical assertions.
- **No Fake Identifiers**: Replaced any government-style identifiers with fictional IDs (`DEMO-AARAV-001`, `DEMO-MEERA-001`, `DEMO-SAVITRI-001`).
- **Diagnostic Boundaries**: Disclaimers present across headers, cards, modals, and footer boundaries confirming:
  > *"This system does not provide medical diagnosis, clinical treatment plans, or emergency dispatch. Never submit real patient data or make clinical decisions based on illustrative simulation outputs."*
- **Non-Causal Pattern Explanations**: Standardized across all multi-series views with visual badges: `OBSERVED ALONGSIDE` and `APPEARED DURING THE SAME PERIOD`.

---

## 13. Technical Validation

- **Linter**: `oxlint` executed with **0 errors and 0 warnings** across 69 files.
- **TypeScript Compiler**: `tsc -b` compiled with **0 errors**.
- **Production Bundle**: `vite build` completed successfully with optimized chunks.
- **Browser Runtime Console**: Inspected via Chrome DevTools protocol with **0 runtime errors**.

---

## 14. Known Limitations & Prototype Boundaries

1. **Synthetic Deterministic Engine**: All insights, patterns, and summaries are derived from pre-indexed client-side structures; no server-side LLM or remote AI API is called.
2. **Non-Clinical Dataset**: Biometric ranges and laboratory values are illustrative scenarios designed to demonstrate software architecture and user experience.
3. **Fictional Profiles**: Multi-profile isolation is client-state driven and does not use enterprise access-control mechanisms.
4. **No Real Emergency Dispatch**: Emergency support routes to illustrative protocol workflows and does not contact 112/108 services.
