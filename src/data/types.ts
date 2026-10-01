/**
 * SWASTHYAAI PROTOTYPE DATA ARCHITECTURE — PHASE 2
 * Fictional demo types for simulated health experiences.
 * Strict disclaimer: These types represent illustrative UI models, NOT real clinical schemas.
 */

export interface DemoUser {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  state: string;
  bloodGroup: string;
  allergies: string[];
  preferredLanguage: 'en' | 'hi';
  avatarInitials: string;
}

export interface DemoFamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Mother' | 'Father' | 'Son' | 'Daughter';
  age: number;
  avatarInitials: string;
  // Explicit separation: Family relationship vs Medical Access State
  medicalAccessState: 'Not shared' | 'Shared (Full)' | 'Shared (Limited)' | 'Emergency Only';
  accessRole?: string;
  sharedScopes: Array<'Reports' | 'Lab Results' | 'Health Metrics' | 'Medications'>;
  accessDurationDays: 7 | 30 | 90 | 365;
  chronicConditions: string[];
  lastUpdated: string;
}

export interface DemoLabParameter {
  parameter: string;
  value: string;
  unit: string;
  standardRange: string;
  status: 'normal' | 'warning' | 'critical';
  explanationEn: string;
  explanationHi: string;
}

export interface DemoLabReport {
  id: string;
  title: string;
  testType: string;
  date: string;
  facilityName: string;
  clinicalStatus: 'normal' | 'attention' | 'critical';
  summaryEn: string;
  summaryHi: string;
  summary: string;
  keyFindings: DemoLabParameter[];
  aiInsightsEn: string[];
  aiInsightsHi: string[];
  aiInsights: string[];
}

export interface DemoHealthMetric {
  id: string;
  label: string;
  labelHi: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  recordedAt: string;
  trend: 'stable' | 'improving' | 'declining';
  contextNote: string;
}

export interface DemoNotification {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  category: 'medication' | 'report' | 'family' | 'preventive' | 'wellness';
  targetPath?: string;
  timestamp: string;
  read: boolean;
}

export interface DemoWellnessRecommendation {
  id: string;
  title: string;
  titleHi: string;
  category: 'today' | 'yoga' | 'ayurveda' | 'nutrition' | 'sleep' | 'lifestyle';
  purpose: string;
  suggestedActivity: string;
  description: string;
  duration: string;
  safetyNote: string;
  suitability: string;
  ayurvedicContext?: string;
}

export interface DemoEmergencyProfile {
  id: string;
  patientName: string;
  age: number;
  bloodGroup: string;
  primaryHospital: string;
  hospitalLocation: string;
  ambulanceContact: string;
  emergencyDoctorName: string;
  emergencyNotes: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  activeMedications: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  date: string;
  status: 'normal' | 'warning' | 'critical';
  note?: string;
}

export interface MetricTimelineData {
  metricId: string;
  title: string;
  unit: string;
  normalRange: string;
  points7d: ChartDataPoint[];
  points30d: ChartDataPoint[];
  points90d: ChartDataPoint[];
}
