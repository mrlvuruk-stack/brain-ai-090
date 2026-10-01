/**
 * SWASTHYAAI PHASE 5 — HEALTH INTELLIGENCE & DECISION-SUPPORT TYPES
 * Deterministic synthetic data contracts for explainable, contextual intelligence.
 * Strictly non-diagnostic, educational prototype models.
 */

export type InsightCategory =
  | 'change'
  | 'pattern'
  | 'report'
  | 'wellness'
  | 'timeline'
  | 'family'
  | 'education';

export type InsightRelevance = 'recent' | 'relevant' | 'contextual' | 'review';

export type ObservationNature = 'observation' | 'interpretation' | 'education';

export type TimeRangeFilter = '7d' | '30d' | '90d' | '6m';

export interface InsightSource {
  id: string;
  type: 'report' | 'metric' | 'journey' | 'wellness' | 'family' | 'goal';
  titleEn: string;
  titleHi: string;
  date: string;
  route: string;
  snippetEn: string;
  snippetHi: string;
}

export interface InsightExplanationData {
  observationEn: string;
  observationHi: string;
  sourcesCount: number;
  sourcesDescriptionEn: string;
  sourcesDescriptionHi: string;
  timeWindowEn: string;
  timeWindowHi: string;
  contextEn: string;
  contextHi: string;
  limitationsEn: string;
  limitationsHi: string;
}

export interface ContextualSuggestedQuestion {
  questionEn: string;
  questionHi: string;
  assistantQuery: string;
}

export interface HealthInsight {
  id: string;
  profileId: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  category: InsightCategory;
  date: string;
  timeRange: TimeRangeFilter[];
  relevance: InsightRelevance;
  relevanceLabelEn: string;
  relevanceLabelHi: string;
  relevanceNoteEn?: string;
  relevanceNoteHi?: string;
  dataCoverage: {
    count: number;
    unitEn: string;
    unitHi: string;
    labelEn: string;
    labelHi: string;
  };
  observationNature: ObservationNature;
  observationTextEn: string;
  observationTextHi: string;
  interpretationTextEn?: string;
  interpretationTextHi?: string;
  educationTextEn?: string;
  educationTextHi?: string;
  sources: InsightSource[];
  explanation: InsightExplanationData;
  relatedRoutes: Array<{
    labelEn: string;
    labelHi: string;
    route: string;
    iconType: 'report' | 'metric' | 'journey' | 'wellness' | 'goals';
  }>;
  suggestedQuestions: ContextualSuggestedQuestion[];
}

export interface HealthPatternDataPoint {
  label: string;
  primaryVal: number;
  secondaryVal: number;
  date: string;
  annotationEn?: string;
  annotationHi?: string;
}

export interface HealthPattern {
  id: string;
  profileId: string;
  titleEn: string;
  titleHi: string;
  category: 'sleep_movement' | 'movement_goals' | 'report_metric' | 'wellness_routine' | 'family_access';
  categoryLabelEn: string;
  categoryLabelHi: string;
  descriptionEn: string;
  descriptionHi: string;
  relationshipTypeEn: string; // "Observed alongside", "Appeared during the same period"
  relationshipTypeHi: string;
  timeWindowEn: string;
  timeWindowHi: string;
  primaryMetricLabelEn: string;
  primaryMetricLabelHi: string;
  primaryUnit: string;
  secondaryMetricLabelEn: string;
  secondaryMetricLabelHi: string;
  secondaryUnit: string;
  dataPoints: HealthPatternDataPoint[];
  observationSummaryEn: string;
  observationSummaryHi: string;
  nonCausalDisclaimerEn: string;
  nonCausalDisclaimerHi: string;
  sources: InsightSource[];
  suggestedQuestions: ContextualSuggestedQuestion[];
}

export interface HealthSummaryObservation {
  id: string;
  titleEn: string;
  titleHi: string;
  textEn: string;
  textHi: string;
  category: InsightCategory;
  supportingSource: InsightSource;
}

export interface HealthSummaryData {
  profileId: string;
  timeRange: TimeRangeFilter;
  headlineEn: string;
  headlineHi: string;
  leadStoryEn: string;
  leadStoryHi: string;
  observations: HealthSummaryObservation[];
  metricsCount: number;
  reportsCount: number;
  eventsCount: number;
  goalsCount: number;
  notIncludedPointsEn: string[];
  notIncludedPointsHi: string[];
}

export interface IntelligenceActivityItem {
  id: string;
  timeAgoEn: string;
  timeAgoHi: string;
  actionEn: string;
  actionHi: string;
  detailEn: string;
  detailHi: string;
  relatedRoute: string;
}

export interface InjectedAssistantContext {
  sourceType: 'report' | 'metric' | 'journey' | 'wellness' | 'goal' | 'pattern' | 'insight';
  sourceTitleEn: string;
  sourceTitleHi: string;
  sourceDate?: string;
  snippetEn: string;
  snippetHi: string;
  suggestedQuestions: ContextualSuggestedQuestion[];
}
