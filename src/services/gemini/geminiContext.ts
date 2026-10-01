/**
 * SwasthyaAI - Grounded Gemini Context Builder
 * 
 * Aggregates synthetic records for the active profile only.
 * Strictly avoids profile cross-contamination.
 */

import { demoProfiles } from '../../data/demoData';
import type { InjectedAssistantContext } from '../../data/intelligenceTypes';
import type { GroundedPatientContext } from './geminiTypes';

export function buildGeminiHealthContext(
  profileId: string,
  injectedContext?: InjectedAssistantContext | null
): GroundedPatientContext {
  const profile = demoProfiles[profileId] || demoProfiles.aarav;

  let demoPatientId = 'DEMO-AARAV-001';
  let activeConditions: string[] = [];
  let recentMetricsSummary = '';
  let latestReportSummary = '';
  let wellnessRoutineSummary = '';
  let familyCaregiverSummary = '';

  if (profile.id === 'aarav') {
    demoPatientId = 'DEMO-AARAV-001';
    activeConditions = ['Demo glucose observation (mild fasting elevation, non-clinical)'];
    recentMetricsSummary =
      'Fasting Blood Glucose: 138 mg/dL (18 Sep 2026, down from 144 mg/dL baseline on 18 Aug); ' +
      'Resting Blood Pressure: 118/78 mmHg (Standard physiological boundary); ' +
      'Daily Walking: 8,420 steps/day average over last 7 days; ' +
      'Resting Heart Rate: 72 bpm.';
    latestReportSummary =
      'Comprehensive Metabolic Panel (CMP) dated 12 Sep 2026: Fasting Glucose 112 mg/dL (ref 70-99), ' +
      'HbA1c 5.8% (ref < 5.7%), Serum Creatinine 0.9 mg/dL (ref 0.7-1.3), BUN 14 mg/dL (ref 7-20). ' +
      'Processed at Indore Central Laboratory (Simulated).';
    wellnessRoutineSummary =
      '7-day streak of evening post-meal Shatapadi walking (100 steps pacing) completed consistently; ' +
      'Morning Nadi Shodhana pranayama (10 mins) active.';
    familyCaregiverSummary =
      'Meera Sharma (Spouse) holds active caregiver access scoped to Biometric Trends and Reports (expires in 88 days).';
  } else if (profile.id === 'meera') {
    demoPatientId = 'DEMO-MEERA-001';
    activeConditions = ['Demo iron & vitality tracking observation'];
    recentMetricsSummary =
      'Fasting Blood Glucose: 92 mg/dL (Normal healthy baseline); ' +
      'Resting Blood Pressure: 112/74 mmHg (Optimal); ' +
      'Daily Movement: 9,150 steps/day; ' +
      'Resting Heart Rate: 68 bpm.';
    latestReportSummary =
      'Complete Blood Count (CBC) dated 14 Sep 2026: Hemoglobin 11.2 g/dL (ref 12.0-15.5 g/dL, borderline low demonstration record), ' +
      'Platelet Count 265,000 /mcL, Total WBC 6,400 /mcL.';
    wellnessRoutineSummary =
      'Morning Surya Namaskar (5 cycles) and hydration reminder tracking (2.2 L/day logged).';
    familyCaregiverSummary =
      'Authorized caregiver for Aarav Sharma; granted emergency-only access to Savitri Devi.';
  } else if (profile.id === 'savitri') {
    demoPatientId = 'DEMO-SAVITRI-001';
    activeConditions = ['Demo blood pressure & mobility monitoring'];
    recentMetricsSummary =
      'Resting Blood Pressure: 136/84 mmHg (17 Sep 2026, stable across 7-day morning checks); ' +
      'Fasting Blood Glucose: 122 mg/dL; ' +
      'Daily Steps: 4,300 steps/day (gentle pacing); ' +
      'Resting Heart Rate: 76 bpm.';
    latestReportSummary =
      'Lipid Profile & Renal Screen dated 20 Aug 2026: Total Cholesterol 192 mg/dL, HDL 48 mg/dL, ' +
      'Serum Creatinine 1.0 mg/dL, eGFR 74 mL/min.';
    wellnessRoutineSummary =
      'Gentle joint mobility sequence (Sandhi Chalana) 15 mins daily; evening chamomile/herbal infusion.';
    familyCaregiverSummary =
      'Aarav Sharma and Meera Sharma hold active caregiver review permissions.';
  }

  return {
    profileId: profile.id,
    fullName: profile.fullName,
    age: profile.age,
    gender: profile.gender,
    city: profile.city,
    bloodGroup: profile.bloodGroup,
    demoPatientId,
    activeConditions,
    recentMetricsSummary,
    latestReportSummary,
    wellnessRoutineSummary,
    familyCaregiverSummary,
    injectedContextSnippet: injectedContext?.snippetEn,
    injectedContextTitle: injectedContext?.sourceTitleEn,
    injectedContextRoute: injectedContext?.sourceType,
  };
}
