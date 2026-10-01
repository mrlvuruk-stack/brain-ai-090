import React, { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Activity,
  History,
  Info,
  UploadCloud,
  FileCheck,
  Search,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import { usePrototype } from '../../state';
import { demoExtendedReports } from '../../data/journeyDemoData';
import './ReportsLibraryPage.css';

type FilterType = 'all' | 'recent' | 'analyzed' | 'attention';

export const ReportsLibraryPage: React.FC = () => {
  const { language, currentProfileId, currentProfile, addToast, setIsSearchOpen } = usePrototype();
  const isHindi = language === 'hi';

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter reports by current profile (fallback to aarav for general demo continuity)
  const profileReports = useMemo(() => {
    const reports = demoExtendedReports.filter(
      (r) => r.profileId === currentProfileId || (currentProfileId !== 'savitri' && r.profileId === 'aarav')
    );

    return reports.filter((rep) => {
      // Category filter
      if (activeFilter === 'attention' && rep.clinicalStatus !== 'attention' && rep.clinicalStatus !== 'critical') {
        return false;
      }
      if (activeFilter === 'recent') {
        // Only 2026 reports
        if (!rep.date.includes('2026')) return false;
      }

      return true;
    });
  }, [currentProfileId, activeFilter]);

  const handleSimulatedUpload = () => {
    addToast(
      isHindi
        ? 'प्रोटोटाइप में नई PDF रिपोर्ट सफलतापूर्वक विश्लेषित की गई।'
        : 'Demo lab report analyzed and indexed into local journey timeline.',
      'info'
    );
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'रिपोर्ट्स लाइब्रेरी' : 'Reports Library'}>
      <div className="sw-reports-lib">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: isHindi ? 'अवलोकन' : 'Overview', to: '/prototype' },
            { label: isHindi ? 'स्वास्थ्य यात्रा' : 'Health Journey', to: '/prototype/journey' },
            { label: isHindi ? 'रिपोर्ट्स लाइब्रेरी' : 'Reports Library' },
          ]}
        />

        {/* Page Header */}
        <header className="sw-reports-lib__header">
          <h1 className="sw-reports-lib__title">
            {isHindi ? 'सांकेतिक लैब रिपोर्ट्स लाइब्रेरी' : 'Illustrative Lab Reports Library'}
          </h1>
          <p className="sw-reports-lib__subtitle">
            {isHindi
              ? `${currentProfile.fullName} के लिए केंद्रीकृत सांकेतिक लैब रिपोर्ट अभिलेख। प्रत्येक परीक्षण सीधे स्वास्थ्य यात्रा, वाइटल्स रुझान और व्याख्या से जुड़ा हुआ है।`
              : `Centralized illustrative lab records for ${currentProfile.fullName}. Each report connects directly to your longitudinal health timeline, metric trends, and assistant explanations.`}
          </p>
        </header>

        {/* Prototype Safeguard Banner */}
        <div className="sw-reports-lib__disclaimer" role="note">
          <Info size={16} aria-hidden="true" />
          <div>
            <strong>{isHindi ? 'सांकेतिक प्रयोगशाला डेटा:' : 'Synthetic laboratory data for prototype demonstration.'}</strong>{' '}
            {isHindi
              ? 'प्रोटोटाइप प्रदर्शन हेतु सिंथेटिक प्रयोगशाला डेटा। यह वास्तविक रोगी के मेडिकल रिकॉर्ड नहीं हैं। वास्तविक चिकित्सकीय सलाह हेतु पंजीकृत चिकित्सक से संपर्क करें।'
              : 'Synthetic laboratory data for prototype demonstration. Does not represent real patient laboratory records. Consult a qualified physician for actual medical concerns.'}
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="sw-reports-lib__controls">
          <div className="sw-reports-lib__tabs" role="tablist" aria-label="Report Filter Tabs">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              className={`sw-reports-lib__tab ${activeFilter === 'all' ? 'sw-reports-lib__tab--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span>{isHindi ? 'सभी रिपोर्ट्स' : 'All Reports'}</span>
              <span className="sw-reports-lib__tab-count">{profileReports.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'recent'}
              className={`sw-reports-lib__tab ${activeFilter === 'recent' ? 'sw-reports-lib__tab--active' : ''}`}
              onClick={() => setActiveFilter('recent')}
            >
              <span>{isHindi ? 'हालिया (2026)' : 'Recent (2026)'}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'analyzed'}
              className={`sw-reports-lib__tab ${activeFilter === 'analyzed' ? 'sw-reports-lib__tab--active' : ''}`}
              onClick={() => setActiveFilter('analyzed')}
            >
              <span>{isHindi ? 'AI विश्लेषित' : 'AI Analyzed'}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'attention'}
              className={`sw-reports-lib__tab ${activeFilter === 'attention' ? 'sw-reports-lib__tab--active' : ''}`}
              onClick={() => setActiveFilter('attention')}
            >
              <span>{isHindi ? 'ध्यान देने योग्य' : 'Needs Review'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Search size={14} />}
              onClick={() => setIsSearchOpen(true)}
            >
              {isHindi ? 'त्वरित खोज (Ctrl+K)' : 'Quick Search (Ctrl+K)'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UploadCloud size={14} />}
              onClick={handleSimulatedUpload}
            >
              {isHindi ? '+ रिपोर्ट जोड़ें (सिम्युलेटेड)' : '+ Ingest Report (Demo)'}
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        {profileReports.length === 0 ? (
          <div className="sw-journey-empty" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <FileCheck size={40} style={{ color: 'var(--color-primary)', margin: '0 auto var(--space-4)' }} />
            <h3 style={{ margin: '0 0 var(--space-2)' }}>{isHindi ? 'कोई रिपोर्ट नहीं मिली' : 'No Reports Matching Filter'}</h3>
            <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)' }}>
              {isHindi ? 'फ़िल्टर बदलकर पुनः प्रयास करें।' : 'Try changing your filter settings.'}
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveFilter('all')}>
              {isHindi ? 'सभी रिपोर्ट्स देखें' : 'Reset Filter'}
            </Button>
          </div>
        ) : (
          <div className="sw-reports-lib__grid">
            {profileReports.map((report) => {
              const statusClass =
                report.clinicalStatus === 'attention'
                  ? 'sw-reports-card__status-badge--attention'
                  : report.clinicalStatus === 'critical'
                  ? 'sw-reports-card__status-badge--critical'
                  : 'sw-reports-card__status-badge--normal';

              const statusText =
                report.clinicalStatus === 'attention'
                  ? (isHindi ? 'समीक्षा अपेक्षित' : 'Review Suggested')
                  : report.clinicalStatus === 'critical'
                  ? (isHindi ? 'तत्काल समीक्षा' : 'Priority Review')
                  : (isHindi ? 'सामान्य सीमा में' : 'Within Expected Limits');

              return (
                <article key={report.id} className="sw-reports-card">
                  {/* Card Top */}
                  <div className="sw-reports-card__header">
                    <div className="sw-reports-card__title-group">
                      <span className="sw-reports-card__type">
                        {isHindi ? report.testTypeHi : report.testTypeEn}
                      </span>
                      <h2 className="sw-reports-card__title">
                        {isHindi ? report.titleHi : report.titleEn}
                      </h2>
                      <div className="sw-reports-card__meta">
                        <span className="sw-reports-card__meta-item">
                          <Calendar size={13} aria-hidden="true" />
                          {report.date}
                        </span>
                        <span className="sw-reports-card__meta-item">
                          <Building size={13} aria-hidden="true" />
                          {report.facilityName}
                        </span>
                      </div>
                    </div>

                    <div className={`sw-reports-card__status-badge ${statusClass}`}>
                      {report.clinicalStatus === 'normal' ? (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      ) : (
                        <AlertTriangle size={14} aria-hidden="true" />
                      )}
                      <span>{statusText}</span>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <p className="sw-reports-card__summary">
                    {isHindi ? report.summaryHi : report.summaryEn}
                  </p>

                  {/* Key Parameter Preview Table */}
                  <div className="sw-reports-card__parameters">
                    <div className="sw-reports-card__param-header">
                      <span>{isHindi ? 'बायोमार्कर' : 'Biomarker'}</span>
                      <span>{isHindi ? 'परीक्षण मान' : 'Observed Value'}</span>
                      <span className="sw-reports-card__param-ref">{isHindi ? 'मानक सीमा' : 'Standard Ref.'}</span>
                    </div>
                    {report.keyFindings.map((param, idx) => (
                      <div key={idx} className="sw-reports-card__param-row">
                        <span className="sw-reports-card__param-name">{param.parameter}</span>
                        <span
                          className="sw-reports-card__param-val"
                          style={{
                            color:
                              param.status === 'warning'
                                ? 'var(--color-warning)'
                                : param.status === 'critical'
                                ? 'var(--color-critical)'
                                : 'var(--color-health-normal)',
                          }}
                        >
                          {param.value} {param.unit}
                        </span>
                        <span className="sw-reports-card__param-ref">{param.standardRange}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Links & Cross-Feature Integration */}
                  <footer className="sw-reports-card__actions">
                    <div className="sw-reports-card__cross-links">
                      <RouterLink
                        to="/prototype/report-analysis"
                        className="sw-reports-card__link"
                        title={isHindi ? 'सांकेतिक AI व्याख्या खोलें' : 'Open in Demo Report Analysis'}
                      >
                        <Sparkles size={14} aria-hidden="true" />
                        <span>{isHindi ? 'सांकेतिक AI विश्लेषण' : 'Illustrative AI Analysis'}</span>
                      </RouterLink>

                      <RouterLink
                        to="/prototype/journey"
                        className="sw-reports-card__link"
                        title={isHindi ? 'स्वास्थ्य यात्रा में यह रिपोर्ट देखें' : 'View in Health Journey'}
                      >
                        <History size={14} aria-hidden="true" />
                        <span>{isHindi ? 'स्वास्थ्य यात्रा में देखें' : 'View in Journey'}</span>
                      </RouterLink>

                      <RouterLink
                        to="/prototype/health-intelligence"
                        className="sw-reports-card__link"
                        title={isHindi ? 'संबंधित वाइटल्स रुझान देखें' : 'View Related Vitals Trends'}
                      >
                        <Activity size={14} aria-hidden="true" />
                        <span>{isHindi ? 'संबंधित रुझान' : 'Related Trends'}</span>
                      </RouterLink>
                    </div>

                    <ContextualAskButton
                      context={{
                        sourceType: 'report',
                        sourceTitleEn: report.titleEn,
                        sourceTitleHi: report.titleHi,
                        sourceDate: report.date,
                        snippetEn: report.summaryEn,
                        snippetHi: report.summaryHi,
                        suggestedQuestions: [
                          {
                            questionEn: `What does this ${report.titleEn} measure?`,
                            questionHi: `यह ${report.titleHi} क्या मापती है?`,
                            assistantQuery: `Explain the parameters in ${report.titleEn} for ${currentProfile.fullName}.`,
                          },
                        ],
                      }}
                      labelEn="Ask SwasthyaAI"
                      labelHi="सहायक से पूछें"
                      variant="ghost"
                      size="sm"
                    />
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PrototypeShell>
  );
};
