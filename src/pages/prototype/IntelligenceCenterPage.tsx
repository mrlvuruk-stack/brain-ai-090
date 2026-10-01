import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  GitBranch,
  Layers,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { usePrototype } from '../../state';
import {
  getHealthInsights,
  getHealthPatterns,
  getIntelligenceActivity,
} from '../../data/intelligenceData';
import type { TimeRangeFilter, InsightCategory } from '../../data/intelligenceTypes';
import { InsightCard } from '../../components/intelligence/InsightCard';
import { TimeRangeSelector } from '../../components/intelligence/TimeRangeSelector';
import { IntelligenceActivityDrawer } from '../../components/intelligence/IntelligenceActivityDrawer';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import './IntelligenceCenterPage.css';

export const IntelligenceCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile, currentProfileId, language } = usePrototype();
  const isHindi = language === 'hi';

  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | 'all'>('all');

  // Grounded deterministic data derived for currentProfile
  const insights = getHealthInsights(currentProfileId, timeRange, selectedCategory);
  const patterns = getHealthPatterns(currentProfileId);
  const activities = getIntelligenceActivity(currentProfileId);

  const categories: Array<{ id: InsightCategory | 'all'; labelEn: string; labelHi: string }> = [
    { id: 'all', labelEn: 'All Insights', labelHi: 'सभी अवलोकन' },
    { id: 'change', labelEn: 'Changes', labelHi: 'बदलाव' },
    { id: 'report', labelEn: 'Reports', labelHi: 'रिपोर्ट्स' },
    { id: 'wellness', labelEn: 'Wellness', labelHi: 'कल्याण' },
    { id: 'family', labelEn: 'Family Access', labelHi: 'परिवार पहुँच' },
  ];

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य बुद्धिमत्ता' : 'Health Intelligence'}>
      <div className="sw-intel-center">
        {/* Top Header & Context Banner */}
        <header className="sw-intel-header">
          <div className="sw-intel-header__main">
            <div className="sw-intel-header__badge-row">
              <span className="sw-intel-badge sw-intel-badge--primary">
                <Sparkles size={14} aria-hidden="true" />
                <span>{isHindi ? 'निर्णय-सहायता एवं संदर्भ' : 'Contextual Decision-Support'}</span>
              </span>
              <span className="sw-intel-badge sw-intel-badge--notice">
                {isHindi ? 'सांकेतिक गैर-नैदानिक डेटा' : 'Synthetic Non-Diagnostic Model'}
              </span>
            </div>

            <h1 className="sw-intel-header__title">
              {isHindi ? 'स्वास्थ्य बुद्धिमत्ता केंद्र' : 'Health Intelligence Center'}
            </h1>
            <p className="sw-intel-header__subtitle">
              {isHindi
                ? 'आपके विभिन्न डेमो रिकॉर्ड्स, रिपोर्ट्स और दिनचर्या के बीच संबंधों की पारदर्शी एवं व्याख्यात्मक समीक्षा।'
                : 'What is worth noticing across your demo records, lab reports, and wellness routines with explainable context.'}
            </p>
          </div>

          {/* Time Range Selector & Summary Link */}
          <div className="sw-intel-header__controls">
            <div className="sw-intel-filter-group">
              <span className="sw-intel-filter-label">
                {isHindi ? 'अवधि:' : 'Period:'}
              </span>
              <TimeRangeSelector
                selectedRange={timeRange}
                onChange={setTimeRange}
                isHindi={isHindi}
              />
            </div>

            <button
              type="button"
              className="sw-intel-summary-btn"
              onClick={() => navigate('/prototype/summary')}
              aria-label={isHindi ? 'व्यक्तिगत स्वास्थ्य सारांश देखें' : 'View Personal Health Summary'}
            >
              <span>{isHindi ? 'स्वास्थ्य सारांश देखें' : 'View Health Summary'}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Section A: Health Overview Banner (Calm, Grounded Status) */}
        <section className="sw-intel-overview-card" aria-labelledby="overview-banner-title">
          <div className="sw-intel-overview-card__content">
            <div className="sw-intel-overview-card__meta">
              <span className="sw-intel-avatar">{currentProfile.avatarInitials}</span>
              <div>
                <span className="sw-intel-overview-pretitle">
                  {isHindi ? 'सक्रिय प्रोफ़ाइल संदर्भ' : 'Active Profile Context'}
                </span>
                <h2 id="overview-banner-title" className="sw-intel-overview-title">
                  {currentProfile.fullName}
                  <span className="sw-intel-overview-age">
                    ({currentProfile.age} yrs · {currentProfile.gender} · {currentProfile.city})
                  </span>
                </h2>
              </div>
            </div>

            <p className="sw-intel-overview-text">
              {isHindi
                ? `चयनित ${timeRange} अवधि में, प्रोटोटाइप ने ${insights.length} मुख्य अवलोकन पहचाने हैं जो आपके बायोमेट्रिक माप, सांकेतिक रिपोर्ट और जीवनशैली रिकॉर्ड्स पर आधारित हैं।`
                : `Over the selected ${timeRange} period, the prototype identified ${insights.length} grounded observations linking your biometric measurements, illustrative lab reports, and lifestyle routines.`}
            </p>

            <div className="sw-intel-overview-badges">
              <span className="sw-intel-stat-badge">
                <Database size={13} aria-hidden="true" />
                <span>
                  {isHindi ? 'डेटा कवरेज:' : 'Data Coverage:'}{' '}
                  <strong>{insights.length} {isHindi ? 'सत्यापित अवलोकन' : 'Grounded Insights'}</strong>
                </span>
              </span>
              <span className="sw-intel-stat-badge">
                <ShieldCheck size={13} aria-hidden="true" />
                <span>{isHindi ? 'शून्य नैदानिक दावे' : 'Strictly Non-Diagnostic'}</span>
              </span>
            </div>
          </div>
        </section>

        {/* Category Filters Bar */}
        <div className="sw-intel-category-bar" role="tablist" aria-label={isHindi ? 'श्रेणी फ़िल्टर' : 'Category filter'}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`sw-intel-category-tab ${selectedCategory === cat.id ? 'sw-intel-category-tab--active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {isHindi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Main Grid: Insights on Left, Activity & Quick Nav on Right */}
        <div className="sw-intel-layout">
          <main className="sw-intel-main">
            {/* If no data exists for the selected filter / time range */}
            {insights.length === 0 ? (
              <div className="sw-intel-empty-state" role="status">
                <div className="sw-intel-empty-icon" aria-hidden="true">
                  <Layers size={32} />
                </div>
                <h3 className="sw-intel-empty-title">
                  {isHindi ? 'पर्याप्त जानकारी उपलब्ध नहीं है' : 'Not enough information yet'}
                </h3>
                <p className="sw-intel-empty-text">
                  {isHindi
                    ? 'प्रोटोटाइप को इस प्रकार का अवलोकन दिखाने से पहले अधिक तुलनात्मक डेमो रिकॉर्ड्स की आवश्यकता है।'
                    : 'The prototype needs more comparable demo records before it can show this type of observation.'}
                </p>
                <div className="sw-intel-empty-actions">
                  <button
                    type="button"
                    className="sw-intel-empty-btn"
                    onClick={() => setTimeRange('30d')}
                  >
                    {isHindi ? '30-दिवसीय डेटा देखें' : 'View 30-Day Data'}
                  </button>
                  <button
                    type="button"
                    className="sw-intel-empty-btn sw-intel-empty-btn--secondary"
                    onClick={() => navigate('/prototype/reports')}
                  >
                    {isHindi ? 'रिपोर्ट्स देखें' : 'Explore Reports'}
                  </button>
                  <button
                    type="button"
                    className="sw-intel-empty-btn sw-intel-empty-btn--secondary"
                    onClick={() => navigate('/prototype/journey')}
                  >
                    {isHindi ? 'स्वास्थ्य यात्रा खोलें' : 'Open Health Journey'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="sw-intel-insights-list">
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    isHindi={isHindi}
                  />
                ))}
              </div>
            )}

            {/* Section C: Emerging Patterns Preview (Linking to /prototype/patterns) */}
            <section className="sw-intel-patterns-banner" aria-labelledby="patterns-preview-title">
              <div className="sw-intel-patterns-banner__header">
                <div className="sw-intel-patterns-banner__title-box">
                  <GitBranch size={18} className="sw-intel-patterns-icon" aria-hidden="true" />
                  <div>
                    <h3 id="patterns-preview-title" className="sw-intel-patterns-title">
                      {isHindi ? 'उभरते हुए स्वास्थ्य पैटर्न' : 'Emerging Health Patterns'}
                    </h3>
                    <p className="sw-intel-patterns-subtitle">
                      {isHindi
                        ? 'विभिन्न मेट्रिक्स और आदतों के बीच साथ-साथ दर्ज संबंधों का अध्ययन करें।'
                        : 'Explore relationships observed alongside each other across your demo timeline.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="sw-intel-patterns-btn"
                  onClick={() => navigate('/prototype/patterns')}
                  aria-label={isHindi ? 'स्वास्थ्य पैटर्न एक्सप्लोरर खोलें' : 'Open Health Pattern Explorer'}
                >
                  <span>{isHindi ? 'पैटर्न एक्सप्लोरर खोलें' : 'Open Pattern Explorer'}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="sw-intel-patterns-grid">
                {patterns.slice(0, 2).map((pattern) => (
                  <div
                    key={pattern.id}
                    className="sw-intel-pattern-snippet"
                    onClick={() => navigate('/prototype/patterns')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/prototype/patterns')}
                  >
                    <span className="sw-intel-pattern-snippet__tag">
                      {isHindi ? pattern.relationshipTypeHi : pattern.relationshipTypeEn}
                    </span>
                    <h4 className="sw-intel-pattern-snippet__title">
                      {isHindi ? pattern.titleHi : pattern.titleEn}
                    </h4>
                    <p className="sw-intel-pattern-snippet__desc">
                      {isHindi ? pattern.descriptionHi : pattern.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section F: Questions Worth Exploring */}
            <section className="sw-intel-questions-card" aria-labelledby="questions-worth-title">
              <div className="sw-intel-questions-header">
                <HelpCircle size={18} className="sw-intel-questions-icon" aria-hidden="true" />
                <div>
                  <h3 id="questions-worth-title" className="sw-intel-questions-title">
                    {isHindi ? 'विचारणीय प्रश्न' : 'Questions Worth Exploring'}
                  </h3>
                  <p className="sw-intel-questions-sub">
                    {isHindi
                      ? 'इन प्रश्नों के बारे में आप सहायक से पूछ सकते हैं या चिकित्सक से परामर्श कर सकते हैं।'
                      : 'Informational questions to guide your understanding or clinical consultation.'}
                  </p>
                </div>
              </div>

              <div className="sw-intel-questions-list">
                {insights.flatMap((i) => i.suggestedQuestions).slice(0, 4).map((q, idx) => (
                  <div key={idx} className="sw-intel-question-item">
                    <span className="sw-intel-question-text">
                      {isHindi ? q.questionHi : q.questionEn}
                    </span>
                    <ContextualAskButton
                      context={{
                        sourceType: 'insight',
                        sourceTitleEn: 'Health Intelligence Inquiry',
                        sourceTitleHi: 'स्वास्थ्य बुद्धिमत्ता प्रश्न',
                        snippetEn: q.questionEn,
                        snippetHi: q.questionHi,
                        suggestedQuestions: [q],
                      }}
                      labelEn="Ask"
                      labelHi="पूछें"
                      variant="subtle"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Right Sidebar: Simulated Intelligence Activity & Limits */}
          <aside className="sw-intel-sidebar">
            <IntelligenceActivityDrawer
              activities={activities}
              isHindi={isHindi}
            />

            {/* Section G: Data Limitations Banner */}
            <div className="sw-intel-limits-box" role="region" aria-labelledby="limits-title">
              <div className="sw-intel-limits-header">
                <AlertTriangle size={16} className="sw-intel-limits-icon" aria-hidden="true" />
                <h4 id="limits-title" className="sw-intel-limits-title">
                  {isHindi ? 'डेटा सीमाएं एवं दायरा' : 'Data Limitations'}
                </h4>
              </div>

              <p className="sw-intel-limits-text">
                {isHindi
                  ? 'यह प्रोटोटाइप केवल सांकेतिक डेमो डेटा का उपयोग करता है। इसमें निरंतर अस्पताल टेलीमेट्री, रीयल-टाइम सेंसर या पूर्ण नैदानिक इतिहास शामिल नहीं है। यह किसी भी चिकित्सीय रोगनिदान या उपचार का विकल्प नहीं है।'
                  : 'This prototype uses synthetic demonstration data only. It does not possess continuous clinical monitoring, real-time hospital feeds, or full EHR history. It never provides medical diagnosis or prescription.'}
              </p>

              <div className="sw-intel-limits-links">
                <button
                  type="button"
                  className="sw-intel-limits-link"
                  onClick={() => navigate('/prototype/security')}
                >
                  {isHindi ? 'सुरक्षा एवं सहमति देखें' : 'Review consent & privacy'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PrototypeShell>
  );
};
