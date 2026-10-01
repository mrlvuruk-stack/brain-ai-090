# SwasthyaAI Web Prototype — Phase 0 Foundation Report

## 1. Project Objective
SwasthyaAI is an interactive, responsive health-tech web prototype engineered to communicate:
**Healthcare + AI + Family + Safety + Wellness + Privacy** without making unsupported clinical or regulatory claims.

The project is built specifically as a **web-only software prototype** starting from zero in this directory. It simulates an AI-powered healthcare platform designed around:
- Medical report understanding
- Multilingual healthcare interaction (English and Hindi)
- Multi-generational family health circles
- Longitudinal health intelligence and vital tracking
- Integrative wellness (Ayurveda and therapeutic yoga)
- Emergency preparedness (108 ambulance card and rapid triage)
- Privacy-aware health information architecture

### Pilot Context
The conceptual and pilot simulation context is focused on the urban and semi-urban realities of **Indore and Ujjain in the Malwa plateau region of Madhya Pradesh, India**. The visual identity strictly rejects superficial ethnic stereotypes (no saffron/green cultural motifs, monuments, or flags), representing India through thoughtful product context and bilingual linguistic inclusion.

---

## 2. Technology Stack
- **Core Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (`strict` mode enabled via `tsconfig.json`)
- **Build Tool & Dev Server**: Vite 8 with HMR
- **Routing**: React Router DOM (`react-router-dom` v7)
- **Iconography**: Lucide React (`lucide-react`)
- **Styling Architecture**: Centralized CSS custom properties (design tokens) + scoped modular CSS + accessible CSS reset
- **Typography Engine**: Google Fonts CDN (`Outfit`, `Inter`, `Noto Sans Devanagari`)

---

## 3. Project Folder Structure
```
c:/Dev/SIH2/
├── docs/
│   └── PHASE_0.md                     # Comprehensive Phase 0 architectural documentation
├── public/
│   ├── favicon.svg                    # Clinical SwasthyaAI brand favicon
│   └── ...
├── src/
│   ├── app/
│   │   └── App.tsx                    # Root application component with BrowserRouter
│   ├── assets/
│   │   └── brand/
│   │       └── swasthya-mark.svg      # Text-based brand treatment & clinical mark
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Responsive marketing navigation header
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.tsx             # Platform footer with pilot context & disclaimers
│   │   │   ├── Footer.css
│   │   │   ├── PageShell.tsx          # Layout shell for marketing views
│   │   │   ├── PageShell.css
│   │   │   ├── PrototypeShell.tsx     # Dedicated interactive prototype application shell
│   │   │   └── PrototypeShell.css
│   │   └── ui/
│   │       ├── Badge.tsx              # Clinical & status indicators with accessible contrast
│   │       ├── Badge.css
│   │       ├── BrandLogo.tsx          # Restrained clinical brand treatment
│   │       ├── BrandLogo.css
│   │       ├── Button.tsx             # Interactive button (variants, 48px touch target)
│   │       ├── Button.css
│   │       ├── Card.tsx               # Content container with restrained shadows
│   │       ├── Card.css
│   │       ├── Container.tsx          # Responsive layout container with max-width stops
│   │       ├── Container.css
│   │       ├── FocusRing.tsx          # Keyboard focus utility wrapper
│   │       ├── FocusRing.css
│   │       ├── IconButton.tsx         # Accessible icon-only button with aria-label
│   │       ├── IconButton.css
│   │       ├── Link.tsx               # Internal & external accessible link primitive
│   │       ├── Link.css
│   │       ├── MedicalDisclaimer.tsx  # Safety boundary notice component (banner/card/inline)
│   │       ├── MedicalDisclaimer.css
│   │       ├── Section.tsx            # Semantic section with standardized spacing
│   │       ├── Section.css
│   │       ├── Typography.tsx         # Heading, Text, and DevanagariText primitives
│   │       └── Typography.css
│   ├── data/
│   │   ├── types.ts                   # Type definitions for fictional prototype data
│   │   └── demoData.ts                # Synthetic demo records (Indore/Ujjain pilot context)
│   ├── design/
│   │   └── tokens.ts                  # Type-safe TypeScript export of all design tokens
│   ├── lib/
│   │   └── utils.ts                   # Utility functions (class name merger clsx)
│   ├── pages/
│   │   ├── marketing/
│   │   │   ├── HomePage.tsx           # Product overview, core pillars & simulation teaser
│   │   │   ├── HomePage.css
│   │   │   ├── FeaturesPage.tsx       # /features route placeholder
│   │   │   ├── SecurityPage.tsx       # /security privacy & boundaries placeholder
│   │   │   └── AboutPage.tsx          # /about mission & pilot context placeholder
│   │   └── prototype/
│   │       ├── PrototypeOverviewPage.tsx    # /prototype patient dashboard & vital stream
│   │       ├── ReportAnalysisPage.tsx       # /prototype/report-analysis lab AI placeholder
│   │       ├── FamilyHealthPage.tsx         # /prototype/family circle placeholder
│   │       ├── HealthIntelligencePage.tsx   # /prototype/health-intelligence placeholder
│   │       ├── WellnessPage.tsx             # /prototype/wellness Ayurveda/Yoga placeholder
│   │       └── EmergencyPage.tsx            # /prototype/emergency support placeholder
│   ├── routes/
│   │   └── AppRouter.tsx              # Central declarative route mapping
│   ├── styles/
│   │   ├── tokens.css                 # Master CSS variables for colors, type, spacing
│   │   ├── reset.css                  # Accessible CSS reset (reduced motion, focus visible)
│   │   └── globals.css                # Global typographic cascade & utility classes
│   ├── index.css                      # Global import entry
│   └── main.tsx                       # React DOM entry point
├── index.html                         # HTML5 shell, preconnect & Google Fonts CDN
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Brand & Design Direction
The visual identity is governed by:
**CALM · CLINICAL · HUMAN · INTELLIGENT · TRUSTWORTHY · PREMIUM**

Visual restraint is strictly enforced:
- **No excessive gradients, glassmorphism, floating blobs, or sci-fi HUDs**.
- High contrast, clinical readability, generous whitespace, and restrained elevation.
- Temporary text-based brand treatment combines the Outfit display typeface with an architectural medical-plus mark and warm amber intelligence accent.

---

## 5. Design Token Foundation

### Color System (`src/styles/tokens.css` & `src/design/tokens.ts`)
| Token Name | Hex Value | Purpose |
|---|---|---|
| `--color-bg` | `#FAF9F6` | Primary page canvas (warm clinical off-white) |
| `--color-bg-subtle` | `#F3EFEA` | Secondary section background |
| `--color-surface` | `#FFFFFF` | Card and component surface |
| `--color-primary` | `#0E6251` | Deep clinical pine/emerald (Brand anchor) |
| `--color-primary-light` | `#1B7A66` | Hover state for primary actions |
| `--color-primary-dark` | `#084B3E` | Active / deep contrast brand tone |
| `--color-primary-muted` | `#E8F3F1` | Soft tint for pills and highlights |
| `--color-secondary` | `#B45309` | Warm Ayurvedic amber |
| `--color-secondary-light` | `#D97706` | Secondary accent |
| `--color-secondary-muted` | `#FEF3C7` | Muted amber background for notice badges |
| `--color-text-primary` | `#18201E` | High contrast body and heading text |
| `--color-text-secondary` | `#4A5568` | Secondary descriptions and subtitles |
| `--color-text-tertiary` | `#718096` | Captions, metadata, and labels |
| `--color-inverse` | `#FFFFFF` | Inverted text on dark backgrounds |
| `--color-border-subtle` | `#E6E1DA` | Quiet dividers and structural lines |
| `--color-border-medium` | `#CBD5E0` | Input and card outlines |
| `--color-focus` | `#0E6251` | High-contrast WCAG focus ring |
| `--color-health-normal` | `#1B7A43` | Normal lab and vital range indicator |
| `--color-health-warning` | `#C05621` | Borderline / review recommended indicator |
| `--color-health-critical` | `#9E2A2B` | Critical clinical metric indicator |
| `--color-emergency` | `#C1121F` | Emergency hospital and triage action color |

### Spacing Scale
4px (`--space-1`), 8px (`--space-2`), 12px (`--space-3`), 16px (`--space-4`), 20px (`--space-5`), 24px (`--space-6`), 32px (`--space-8`), 40px (`--space-10`), 48px (`--space-12`), 64px (`--space-16`), 80px (`--space-20`), 96px (`--space-24`).

### Radius Scale
0px (`--radius-none`), 4px (`--radius-sm`), 8px (`--radius-md`), 12px (`--radius-lg`), 16px (`--radius-xl`), 9999px (`--radius-full`).

---

## 6. Typography Scale
Loaded via Google Fonts:
- **`Outfit`**: Headings, display typography, and brand logo.
- **`Inter`**: UI controls, body text, data points, and navigation.
- **`Noto Sans Devanagari`**: Authentic Hindi/Devanagari scripts.

| Token | Size | Line Height | Application |
|---|---|---|---|
| `--text-xs` | 12px (0.75rem) | 1.5 | Meta, badges, clinical ranges |
| `--text-sm` | 14px (0.875rem) | 1.5 | Subtitles, button text, captions |
| `--text-base` | 16px (1.0rem) | 1.6 | Standard readable body text |
| `--text-lg` | 18px (1.125rem) | 1.5 | Lead introductions, card titles |
| `--text-xl` | 20px (1.25rem) | 1.4 | Module section subheadings (H4) |
| `--text-2xl` | 24px (1.5rem) | 1.3 | Major feature titles (H3) |
| `--text-3xl` | 30px (1.875rem) | 1.25 | Section headers (H2) |
| `--text-4xl` | 36px (2.25rem) | 1.2 | Hero title (H1, responsive clamp) |

---

## 7. Routing Plan
Separation between **Marketing Website** and **Interactive Prototype Application**:

### Marketing Routes (wrapped in `PageShell`)
1. `/` — Home landing page with mission overview, pilot context, and prototype launcher.
2. `/features` — Architectural capabilities overview.
3. `/security` — Conceptual data privacy framework and prototype boundaries.
4. `/about` — SwasthyaAI philosophy, mission, and Indore/Ujjain pilot focus.

### Interactive Prototype Routes (wrapped in `PrototypeShell`)
5. `/prototype` — Prototype Overview & simulated patient vitals dashboard.
6. `/prototype/report-analysis` — Diagnostic report understanding simulation placeholder.
7. `/prototype/family` — Family health circle sharing placeholder.
8. `/prototype/health-intelligence` — Longitudinal vital trends placeholder.
9. `/prototype/wellness` — Integrative Ayurvedic and Yogic therapies placeholder.
10. `/prototype/emergency` — Rapid emergency support and medical ID card placeholder.

---

## 8. Accessibility Principles (Targeting WCAG 2.2 AA)
1. **Contrast Ratios**: Primary `#0E6251` on Surface `#FFFFFF` achieves **7.4:1** (exceeding AAA requirement of 7:1).
2. **Accessible Touch Targets**: Buttons and interactive controls enforce a minimum touch target of **48px** (`--min-touch-target: 48px`).
3. **Keyboard Focus**: Visible `:focus-visible` ring (`2px solid var(--color-focus)`) with offset.
4. **Skip-to-Content Link**: Implemented at the very top of `PageShell` targeting `#main-content`.
5. **Reduced Motion**: Full support for `prefers-reduced-motion: reduce` in `reset.css` that disables non-essential animations.
6. **Multi-Sensory Status**: Badges and status pills use both color and text/dots to avoid color-only communication.

---

## 9. Prototype Boundary & Medical Safety Disclaimers
This application is strictly a **concept demonstrator and software prototype**:
- **Medical Boundary**: It does NOT provide clinical diagnosis, triage advice, or real medical prescriptions. Prominent banners display *"Illustrative result"*, *"Prototype data"*, and *"Discuss with a qualified healthcare professional"*.
- **Privacy Boundary**: No real patient records are accepted or persisted. All names, vitals, and laboratory summaries in `src/data/demoData.ts` are purely synthetic constructs created for the Indore & Ujjain demonstration context.
- **Regulatory Boundary**: No claims are made regarding DPDP certification, HIPAA, or medical device regulatory approval.

---

## 10. What is Intentionally NOT Implemented in Phase 0
- Mobile application code (React Native, Android, iOS)
- Backend servers, APIs, or database connections
- Real authentication, SMS OTP, or user credential storage
- Third-party EHR/EMR or FHIR integrations
- Full interactive screen mockups for Phase 1 modules (kept as minimal placeholders to establish routing without premature implementation)

---

## 11. Recommended Phase 1 Starting Point
1. **Interactive Report Analysis Module**: Implement simulated PDF/image report upload, OCR extraction animation, and bilingual (English/Hindi) clinical parameter breakdown.
2. **Interactive Family Health Circles**: Build the interactive family selector, consent toggle matrix, and multi-generational vitals overview.
3. **Longitudinal Health Charts**: Implement lightweight SVG trend visualizations for blood pressure and glucose metrics.
