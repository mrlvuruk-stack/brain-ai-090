/**
 * SWASTHYAAI PHASE 4 — PERSONAL HEALTH JOURNEY & INTELLIGENCE TYPES
 * Fictional client-side data contracts for personal health story visualization.
 * Non-diagnostic, synthetic prototype only.
 */

import type { DemoLabParameter } from './types';

export type JourneyEventCategory =
  | 'assessment'
  | 'report'
  | 'metric'
  | 'wellness'
  | 'family'
  | 'goal'
  | 'insight';

export interface HealthJourneyEvent {
  id: string;
  profileId: string;
  date: string;
  timestamp: string;
  category: JourneyEventCategory;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  status: 'completed' | 'recorded' | 'in_progress' | 'scheduled';
  relatedType?: 'report' | 'metric' | 'wellness' | 'family' | 'assistant' | 'goal';
  relatedRoute?: string;
  relatedId?: string;
  relatedNameEn?: string;
  relatedNameHi?: string;
  metricsPreview?: Array<{
    labelEn: string;
    labelHi: string;
    value: string;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
  }>;
  badgeLabelEn?: string;
  badgeLabelHi?: string;
}

export interface HealthChange {
  id: string;
  profileId: string;
  metricKey: string;
  metricNameEn: string;
  metricNameHi: string;
  previousValue: string;
  currentValue: string;
  unit: string;
  difference: string;
  direction: 'decreased' | 'increased' | 'steady' | 'improved' | 'moved';
  status: 'normal' | 'warning' | 'critical';
  periodEn: string;
  periodHi: string;
  contextEn: string;
  contextHi: string;
  relatedRoute: string;
}

export type GoalCategory = 'sleep' | 'movement' | 'hydration' | 'breathing' | 'dinacharya';

export interface HealthGoal {
  id: string;
  profileId: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  category: GoalCategory;
  targetValue: string;
  currentValue: string;
  unit: string;
  progressPercent: number;
  frequencyEn: string;
  frequencyHi: string;
  completed: boolean;
  relatedRoute: string;
}

export interface ExtendedReportSummary {
  id: string;
  profileId: string;
  titleEn: string;
  titleHi: string;
  testTypeEn: string;
  testTypeHi: string;
  date: string;
  facilityName: string;
  clinicalStatus: 'normal' | 'attention' | 'critical';
  summaryEn: string;
  summaryHi: string;
  keyFindings: DemoLabParameter[];
  journeyEventId?: string;
  relatedMetricKey?: 'glucose' | 'bp' | 'heartRate';
}

export type SearchCategory =
  | 'report'
  | 'metric'
  | 'journey'
  | 'wellness'
  | 'goal'
  | 'family'
  | 'assistant';

export interface SearchResult {
  id: string;
  titleEn: string;
  titleHi: string;
  category: SearchCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  snippetEn: string;
  snippetHi: string;
  date?: string;
  route: string;
}

export interface HealthInformationMapNode {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'core' | 'records' | 'trends' | 'integrative' | 'network';
  descriptionEn: string;
  descriptionHi: string;
  route: string;
  connections: string[];
}
