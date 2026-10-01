import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Activity,
  History,
  Target,
  Sparkles,
  Download,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { usePrototype } from '../../state';
import { getHealthSummary } from '../../data/intelligenceData';
import type { TimeRangeFilter } from '../../data/intelligenceTypes';
import { TimeRangeSelector } from '../../components/intelligence/TimeRangeSelector';
import { SourceChipList } from '../../components/intelligence/SourceChipList';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import './PersonalHealthSummaryPage.css';

export const PersonalHealthSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile, currentProfileId, language, addToast } = usePrototype();
  const isHindi = language === 'hi';

  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');
  const summary = getHealthSummary(currentProfileId, timeRange);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSimulated = () => {
    addToast(
      isHindi
        ? 'सिम्युलेटेड स्वास्थ्य सारांश डाउनलोड प्रारंभ हुआ (प्रोटोटाइप डेमो)'
        : 'Simulated Health Summary exported for prototype review',
      'info'
    );
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य सारांश' : 'Personal Summary'}>
      <div className="sw-summary-page">
        {/* Navigation & Actions Top Bar */}
        <div className="sw-summary-nav-bar">
          <button
            type="button"
            className="sw-summary-back-btn"
            onClick={() => navigate('/prototype/intelligence')}
            aria-label={isHindi ? 'बुद्धिमत्ता केंद्र पर वापस जाएं' : 'Back to Intelligence Center'}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{isHindi ? 'बुद्धिमत्ता केंद्र पर वापस' : 'Back to Intelligence Center'}</span>
          </button>

          <div className="sw-summary-actions">
            <TimeRangeSelector
              selectedRange={timeRange}
              onChange={setTimeRange}
              isHindi={isHindi}
            />

            <button
              type="button"
              className="sw-summary-action-btn"
              onClick={handlePrint}
              aria-label={isHindi ? 'सारांश प्रिंट करें' : 'Print summary'}
            >
              <Printer size={15} aria-hidden="true" />
              <span>{isHindi ? 'प्रिंट करें' : 'Print'}</span>
            </button>

            <button
              type="button"
              className="sw-summary-action-btn sw-summary-action-btn--primary"
              onClick={handleExportSimulated}
              aria-label={isHindi ? 'सारांश निर्यात करें' : 'Export summary'}
            >
              <Download size={15} aria-hidden="true" />
              <span>{isHindi ? 'निर्यात (PDF)' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Printable/Editorial Health Story Card */}
        <article className="sw-summary-sheet" aria-labelledby="summary-headline">
          {/* Header */}
          <header className="sw-summary-sheet__header">
            <div className="sw-summary-sheet__brand">
              <span className="sw-summary-badge">
                <Sparkles size={13} aria-hidden="true" />
                <span>{isHindi ? 'सांकेतिक स्वास्थ्य कहानी' : 'Illustrative Health Story'}</span>
              </span>
              <span className="sw-summary-badge sw-summary-badge--notice">
                {isHindi ? 'प्रोटोटाइप संश्लेषण' : 'Deterministic Prototype Synthesis'}
              </span>
            </div>

            <div className="sw-summary-profile-box">
              <div className="sw-summary-avatar">{currentProfile.avatarInitials}</div>
              <div className="sw-summary-profile-info">
                <h1 className="sw-summary-profile-name">{currentProfile.fullName}</h1>
                <p className="sw-summary-profile-sub">
                  Demo Patient ID: DEMO-{currentProfile.id.toUpperCase()}-001 · {currentProfile.age} yrs · {currentProfile.gender} · {currentProfile.city}, {currentProfile.state}
                </p>
              </div>
            </div>

            <div className="sw-summary-headline-wrap">
              <h2 id="summary-headline" className="sw-summary-headline">
                {isHindi ? summary.headlineHi : summary.headlineEn}
              </h2>
              <div className="sw-summary-date-tag">
                <Calendar size={13} aria-hidden="true" />
                <span>{isHindi ? `अवधि: ${timeRange}` : `Period: ${timeRange}`}</span>
              </div>
            </div>
          </header>

          {/* Lead Narrative */}
          <section className="sw-summary-lead-box" aria-labelledby="lead-narrative-title">
            <h3 id="lead-narrative-title" className="sw-summary-section-lead-title">
              {isHindi ? 'हाल का स्वास्थ्य आख्यान' : 'Recent Health Narrative'}
            </h3>
            <p className="sw-summary-lead-text">
              {isHindi ? summary.leadStoryHi : summary.leadStoryEn}
            </p>
          </section>

          {/* Quick Metrics & Records Tally */}
          <section className="sw-summary-stats-grid" aria-label={isHindi ? 'रिकॉर्ड्स संख्या' : 'Records reviewed count'}>
            <div className="sw-summary-stat-cell">
              <span className="sw-summary-stat-num">{summary.metricsCount}</span>
              <span className="sw-summary-stat-label">
                <Activity size={13} aria-hidden="true" />
                <span>{isHindi ? 'बायोमेट्रिक पाठ्यांक' : 'Biometric Logs'}</span>
              </span>
            </div>
            <div className="sw-summary-stat-cell">
              <span className="sw-summary-stat-num">{summary.reportsCount}</span>
              <span className="sw-summary-stat-label">
                <FileText size={13} aria-hidden="true" />
                <span>{isHindi ? 'सांकेतिक रिपोर्ट्स' : 'Illustrative Reports'}</span>
              </span>
            </div>
            <div className="sw-summary-stat-cell">
              <span className="sw-summary-stat-num">{summary.eventsCount}</span>
              <span className="sw-summary-stat-label">
                <History size={13} aria-hidden="true" />
                <span>{isHindi ? 'समयरेखा घटनाएं' : 'Journey Events'}</span>
              </span>
            </div>
            <div className="sw-summary-stat-cell">
              <span className="sw-summary-stat-num">{summary.goalsCount}</span>
              <span className="sw-summary-stat-label">
                <Target size={13} aria-hidden="true" />
                <span>{isHindi ? 'सक्रिय कल्याण लक्ष्य' : 'Wellness Goals'}</span>
              </span>
            </div>
          </section>

          {/* 3-5 Grounded Observations */}
          <section className="sw-summary-observations" aria-labelledby="grounded-obs-title">
            <h3 id="grounded-obs-title" className="sw-summary-section-title">
              {isHindi ? 'मुख्य प्रामाणिक अवलोकन' : 'Grounded Health Observations'}
            </h3>
            <p className="sw-summary-section-sub">
              {isHindi
                ? 'नीचे दिए गए प्रत्येक अवलोकन को आपके उपलब्ध डेमो रिकॉर्ड्स से सत्यापित किया गया है:'
                : 'Each observation below connects directly to supporting synthetic evidence in your profile:'}
            </p>

            {summary.observations.length === 0 ? (
              <div className="sw-summary-empty-obs">
                <p>
                  {isHindi
                    ? 'चयनित अवधि के लिए कोई विशिष्ट अवलोकन दर्ज नहीं है। अधिक रिकॉर्ड्स देखने के लिए कृपया 30 या 90 दिनों की अवधि चुनें।'
                    : 'No specific observations recorded for this period. Please select 30 or 90 days to explore grounded records.'}
                </p>
              </div>
            ) : (
              <div className="sw-summary-obs-list">
                {summary.observations.map((obs, idx) => (
                  <div key={obs.id} className="sw-summary-obs-card">
                    <div className="sw-summary-obs-card__top">
                      <span className="sw-summary-obs-idx">0{idx + 1}</span>
                      <h4 className="sw-summary-obs-title">
                        {isHindi ? obs.titleHi : obs.titleEn}
                      </h4>
                    </div>

                    <p className="sw-summary-obs-text">
                      {isHindi ? obs.textHi : obs.textEn}
                    </p>

                    <div className="sw-summary-obs-footer">
                      <SourceChipList sources={[obs.supportingSource]} isHindi={isHindi} size="sm" />
                      <ContextualAskButton
                        context={{
                          sourceType: 'insight',
                          sourceTitleEn: obs.titleEn,
                          sourceTitleHi: obs.titleHi,
                          snippetEn: obs.textEn,
                          snippetHi: obs.textHi,
                          suggestedQuestions: [
                            {
                              questionEn: `Tell me more about: ${obs.titleEn}`,
                              questionHi: `इसके बारे में और बताएं: ${obs.titleHi}`,
                              assistantQuery: `Explain in detail the observation: "${obs.titleEn}" for ${currentProfile.fullName}.`,
                            },
                          ],
                        }}
                        labelEn="Ask"
                        labelHi="पूछें"
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: "What this summary does not include" (Mandatory Safety Boundary) */}
          <section className="sw-summary-exclusions" aria-labelledby="exclusions-title">
            <div className="sw-summary-exclusions__header">
              <AlertTriangle size={18} className="sw-summary-exclusions__icon" aria-hidden="true" />
              <h3 id="exclusions-title" className="sw-summary-exclusions__title">
                {isHindi ? 'यह सारांश क्या शामिल नहीं करता है' : 'What this summary does NOT include'}
              </h3>
            </div>

            <p className="sw-summary-exclusions__intro">
              {isHindi
                ? 'जिम्मेदार एआई सीमाओं और गैर-नैदानिक प्रोटोटाइप सिद्धांतों के अनुसार, इस सारांश में निम्नलिखित शामिल नहीं हैं:'
                : 'In accordance with responsible AI boundaries and non-diagnostic prototype rules, the following are explicitly not covered:'}
            </p>

            <ul className="sw-summary-exclusions__list">
              {(isHindi ? summary.notIncludedPointsHi : summary.notIncludedPointsEn).map(
                (point, i) => (
                  <li key={i} className="sw-summary-exclusions__item">
                    <span className="sw-summary-exclusions__bullet" aria-hidden="true">✕</span>
                    <span>{point}</span>
                  </li>
                )
              )}
            </ul>

            <div className="sw-summary-exclusions__footer">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>
                {isHindi
                  ? 'यह सारांश केवल प्रोटोटाइप मूल्यांकन और शैक्षणिक समीक्षा के लिए है। वास्तविक चिकित्सीय सलाह के लिए हमेशा पंजीकृत चिकित्सक से परामर्श करें।'
                  : 'This summary is synthesized for prototype demonstration and educational review. Always consult a licensed medical physician for actual clinical care.'}
              </span>
            </div>
          </section>
        </article>
      </div>
    </PrototypeShell>
  );
};
