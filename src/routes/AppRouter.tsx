import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteLoadingFallback } from '../components/ui/RouteLoadingFallback';

// Helper for typed dynamic named imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyNamed<T extends Record<string, React.ComponentType<any>>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K
) {
  return React.lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] };
  });
}

// 1. Marketing Pages (Code-split for instant initial load)
const HomePage = lazyNamed(() => import('../pages/marketing/HomePage'), 'HomePage');
const FeaturesPage = lazyNamed(() => import('../pages/marketing/FeaturesPage'), 'FeaturesPage');
const SecurityPage = lazyNamed(() => import('../pages/marketing/SecurityPage'), 'SecurityPage');
const AboutPage = lazyNamed(() => import('../pages/marketing/AboutPage'), 'AboutPage');

// 2. Interactive Prototype Routes (Code-split by workflow domain)
const PrototypeOverviewPage = lazyNamed(() => import('../pages/prototype/PrototypeOverviewPage'), 'PrototypeOverviewPage');
const HealthJourneyPage = lazyNamed(() => import('../pages/prototype/HealthJourneyPage'), 'HealthJourneyPage');
const HealthProfilePage = lazyNamed(() => import('../pages/prototype/HealthProfilePage'), 'HealthProfilePage');
const ReportsLibraryPage = lazyNamed(() => import('../pages/prototype/ReportsLibraryPage'), 'ReportsLibraryPage');
const HealthGoalsPage = lazyNamed(() => import('../pages/prototype/HealthGoalsPage'), 'HealthGoalsPage');
const AssistantPage = lazyNamed(() => import('../pages/prototype/AssistantPage'), 'AssistantPage');
const ReportAnalysisPage = lazyNamed(() => import('../pages/prototype/ReportAnalysisPage'), 'ReportAnalysisPage');
const FamilyHealthPage = lazyNamed(() => import('../pages/prototype/FamilyHealthPage'), 'FamilyHealthPage');
const IntelligenceCenterPage = lazyNamed(() => import('../pages/prototype/IntelligenceCenterPage'), 'IntelligenceCenterPage');
const HealthPatternsPage = lazyNamed(() => import('../pages/prototype/HealthPatternsPage'), 'HealthPatternsPage');
const PersonalHealthSummaryPage = lazyNamed(() => import('../pages/prototype/PersonalHealthSummaryPage'), 'PersonalHealthSummaryPage');
const HealthIntelligencePage = lazyNamed(() => import('../pages/prototype/HealthIntelligencePage'), 'HealthIntelligencePage');
const WellnessPage = lazyNamed(() => import('../pages/prototype/WellnessPage'), 'WellnessPage');
const EmergencyPage = lazyNamed(() => import('../pages/prototype/EmergencyPage'), 'EmergencyPage');
const PrototypeSecurityPage = lazyNamed(() => import('../pages/prototype/PrototypeSecurityPage'), 'PrototypeSecurityPage');

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* 1. Marketing Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* 2. Interactive Prototype Routes */}
        <Route path="/prototype" element={<PrototypeOverviewPage />} />
        <Route path="/prototype/journey" element={<HealthJourneyPage />} />
        <Route path="/prototype/profile" element={<HealthProfilePage />} />
        <Route path="/prototype/reports" element={<ReportsLibraryPage />} />
        <Route path="/prototype/goals" element={<HealthGoalsPage />} />
        <Route path="/prototype/assistant" element={<AssistantPage />} />
        <Route path="/prototype/report-analysis" element={<ReportAnalysisPage />} />
        <Route path="/prototype/family" element={<FamilyHealthPage />} />
        <Route path="/prototype/intelligence" element={<IntelligenceCenterPage />} />
        <Route path="/prototype/patterns" element={<HealthPatternsPage />} />
        <Route path="/prototype/summary" element={<PersonalHealthSummaryPage />} />
        <Route path="/prototype/health-intelligence" element={<HealthIntelligencePage />} />
        <Route path="/prototype/wellness" element={<WellnessPage />} />
        <Route path="/prototype/emergency" element={<EmergencyPage />} />
        <Route path="/prototype/security" element={<PrototypeSecurityPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
