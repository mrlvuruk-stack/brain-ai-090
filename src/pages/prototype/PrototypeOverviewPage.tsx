import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Activity,
  HeartPulse,
  ArrowRight,
  Sparkles,
  Droplets,
  Heart,
  Moon,
  Info,
  History,
  TrendingDown,
  TrendingUp,
  Target,
  Search,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HealthMetric } from '../../components/ui/HealthMetric';
import { usePrototype } from '../../state';
import {
  demoLabReports,
  demoWellnessRecommendations,
} from '../../data/demoData';
import { getDashboardFeaturedInsights } from '../../data/intelligenceData';
import type { HealthInsight } from '../../data/intelligenceTypes';
import { InsightExplanation } from '../../components/intelligence/InsightExplanation';
import { SourceChipList } from '../../components/intelligence/SourceChipList';
import './PrototypeOverviewPage.css';

export const PrototypeOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    familyMembers,
    language,
    setSelectedReportId,
    journeyEvents,
    healthChanges,
    healthGoals,
    setIsSearchOpen,
  } = usePrototype();

  const isHindi = language === 'hi';
  const [explainInsight, setExplainInsight] = React.useState<HealthInsight | null>(null);
  const featuredInsights = getDashboardFeaturedInsights(currentProfile.id);
  const latestReport = demoLabReports[0];
  const todayWellness = demoWellnessRecommendations.filter(
    (w) => w.category === 'today' || w.category === 'yoga'
  )[0];

  // Dynamic time greeting
  const getGreeting = () => {
    if (isHindi) {
      return `शुभ प्रभात, ${currentProfile.fullName}`;
    }
    return `Good morning, ${currentProfile.fullName}`;
  };

  const getSubGreeting = () => {
    if (isHindi) {
      return 'यहाँ आपका व्यक्तिगत स्वास्थ्य इतिहास, हालिया बदलाव और दैनिक दिनचर्या प्रस्तुत हैं।';
    }
    return 'Healthcare intelligence, designed around people. Here is your health story and recent changes.';
  };

  const completedGoalsCount = healthGoals.filter((g) => g.completed).length;

  return (
    <PrototypeShell activeModuleName={isHindi ? 'अवलोकन व वाइटल्स' : 'Overview & Vitals'}>
      <div className="sw-overview-page">
        {/* 1. Greeting & Context Area */}
        <section className="sw-overview-greeting" aria-label="Profile greeting">
          <div className="sw-overview-greeting__text">
            <div className="sw-overview-greeting__tag">
              <Badge variant="primary" size="sm" showDot>
                {isHindi ? 'सक्रिय स्वास्थ्य संदर्भ' : 'Active Patient Context'}
              </Badge>
              <span className="sw-overview-greeting__meta">
                {currentProfile.city}, {currentProfile.state} · {currentProfile.bloodGroup} · {isHindi ? 'डेमो रोगी आईडी: ' : 'Demo Patient ID: '}
                {`DEMO-${currentProfile.id.toUpperCase()}-001`}
              </span>
            </div>
            <Heading level={1} size="h3" className="sw-overview-greeting__title">
              {getGreeting()}
            </Heading>
            <Text variant="secondary" className="sw-overview-greeting__sub">
              {getSubGreeting()}
            </Text>
          </div>

          <div className="sw-overview-quick-actions">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Search size={14} />}
              onClick={() => setIsSearchOpen(true)}
            >
              {isHindi ? 'खोजें (Ctrl+K)' : 'Search Records (Ctrl+K)'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<History size={14} />}
              onClick={() => navigate('/prototype/journey')}
            >
              {isHindi ? 'स्वास्थ्य यात्रा' : 'Health Journey'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText size={14} />}
              onClick={() => navigate('/prototype/reports')}
            >
              {isHindi ? 'रिपोर्ट्स लाइब्रेरी' : 'Reports Library'}
            </Button>
          </div>
        </section>

        {/* 2. Personal Health Story Spotlight Banner */}
        <section className="sw-overview-story-card" aria-label="Health Journey summary">
          <div className="sw-overview-story-content">
            <History size={24} className="sw-overview-story-icon" aria-hidden="true" />
            <div>
              <h2 className="sw-overview-story-title">
                {isHindi ? 'आपकी व्यक्तिगत स्वास्थ्य यात्रा' : 'Your Personal Health Journey'}
              </h2>
              <p className="sw-overview-story-desc">
                {isHindi
                  ? `${journeyEvents.length} मील के पत्थर दर्ज हैं: सांकेतिक लैब रिपोर्ट, वाइटल्स परिवर्तन, दैनिक दिनचर्या और पारिवारिक सुरक्षा संदर्भ एक एकीकृत समयरेखा में संयोजित हैं।`
                  : `${journeyEvents.length} chronological milestones recorded: illustrative lab reports, metric fluctuations, daily routines, and family permissions seamlessly connected into one coherent narrative.`}
              </p>
            </div>
          </div>
          <div className="sw-overview-story-actions">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
              onClick={() => navigate('/prototype/journey')}
            >
              {isHindi ? 'पूरी यात्रा देखें' : 'View Full Journey'}
            </Button>
          </div>
        </section>

        {/* 2b. Restrained Phase 5 Health Intelligence Section */}
        <section aria-labelledby="section-intelligence-heading">
          <div className="sw-section-subhead">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Sparkles size={16} color="#0d9488" aria-hidden="true" />
                <Heading level={2} size="h5" id="section-intelligence-heading">
                  {isHindi ? 'स्वास्थ्य बुद्धिमत्ता (Health Intelligence)' : 'Health Intelligence (Recent Observations)'}
                </Heading>
              </div>
              <span className="sw-section-subhead__note">
                {isHindi
                  ? 'आपके विभिन्न डेमो रिकॉर्ड्स के आधार पर शांत, प्रामाणिक और पारदर्शी अवलोकन'
                  : 'Grounded demo observations connecting your recent records and metrics'}
              </span>
            </div>
            <RouterLink to="/prototype/intelligence" className="sw-section-subhead__link">
              <span>{isHindi ? 'बुद्धिमत्ता केंद्र खोलें' : 'Open Intelligence Center'}</span>
              <ArrowRight size={13} aria-hidden="true" />
            </RouterLink>
          </div>

          <div className="sw-overview-intelligence-grid">
            {featuredInsights.map((ins) => (
              <article key={ins.id} className="sw-overview-intel-card">
                <div className="sw-overview-intel-card__top">
                  <span className="sw-overview-intel-badge">
                    {isHindi ? ins.relevanceLabelHi : ins.relevanceLabelEn}
                  </span>
                  <span className="sw-overview-intel-evidence">
                    {isHindi ? ins.dataCoverage.labelHi : ins.dataCoverage.labelEn}
                  </span>
                </div>

                <h3 className="sw-overview-intel-title">
                  {isHindi ? ins.titleHi : ins.titleEn}
                </h3>

                <p className="sw-overview-intel-summary">
                  {isHindi ? ins.summaryHi : ins.summaryEn}
                </p>

                <div className="sw-overview-intel-footer">
                  <SourceChipList sources={ins.sources.slice(0, 2)} isHindi={isHindi} size="sm" />
                  <button
                    type="button"
                    className="sw-overview-intel-action"
                    onClick={() => setExplainInsight(ins)}
                    aria-label={`${isHindi ? 'व्याख्या देखें' : 'View explanation'}: ${isHindi ? ins.titleHi : ins.titleEn}`}
                  >
                    <span>{isHindi ? 'व्याख्या देखें' : 'View explanation'}</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. "What Changed" Comparison Experience */}
        <section aria-labelledby="section-changes-heading">
          <div className="sw-section-subhead">
            <div>
              <Heading level={2} size="h5" id="section-changes-heading">
                {isHindi ? 'हालिया बदलाव (What Changed?)' : 'What Changed? (30-Day Comparisons)'}
              </Heading>
              <span className="sw-section-subhead__note">
                {isHindi
                  ? 'दो समयावधियों के बीच दर्ज किए गए वस्तुनिष्ठ परिवर्तन'
                  : 'Objective comparison between previous and current observation periods'}
              </span>
            </div>
            <RouterLink to="/prototype/journey" className="sw-section-subhead__link">
              <span>{isHindi ? 'सभी बदलाव देखें' : 'View all comparisons'}</span>
              <ArrowRight size={13} aria-hidden="true" />
            </RouterLink>
          </div>

          <div className="sw-overview-changes-grid">
            {healthChanges.slice(0, 3).map((chg) => {
              const isDecreased = chg.direction === 'decreased' || chg.direction === 'improved';
              return (
                <article key={chg.id} className="sw-change-mini-card">
                  <div className="sw-change-mini-card__top">
                    <span className="sw-change-mini-card__title">
                      {isHindi ? chg.metricNameHi : chg.metricNameEn}
                    </span>
                    <span
                      className={`sw-change-mini-card__diff ${
                        chg.status === 'normal'
                          ? 'sw-change-mini-card__diff--normal'
                          : 'sw-change-mini-card__diff--warning'
                      }`}
                    >
                      {chg.difference}
                    </span>
                  </div>

                  <div className="sw-change-mini-card__values">
                    <span className="sw-change-mini-card__curr">
                      {chg.currentValue} {chg.unit}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      {isDecreased ? (
                        <TrendingDown size={14} color="var(--color-health-normal)" />
                      ) : (
                        <TrendingUp size={14} color="var(--color-secondary)" />
                      )}
                      <span>
                        {isHindi ? 'पूर्व:' : 'was'} {chg.previousValue} {chg.unit}
                      </span>
                    </span>
                  </div>

                  <p className="sw-change-mini-card__desc">
                    {isHindi ? chg.contextHi : chg.contextEn}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. Health Snapshot: 4 Vitals */}
        <section aria-labelledby="section-vitals-heading">
          <div className="sw-section-subhead">
            <Heading level={2} size="h5" id="section-vitals-heading">
              {isHindi ? 'वाइटल्स और स्वास्थ्य स्नैपशॉट' : 'Health Snapshot & Monitored Parameters'}
            </Heading>
            <span className="sw-section-subhead__note">
              {isHindi ? 'सांकेतिक प्रोटोटाइप मान' : 'Illustrative Prototype Metrics'}
            </span>
          </div>

          <div className="sw-metrics-grid">
            <HealthMetric
              label="Blood Glucose"
              labelHi="रक्त शर्करा (फास्टिंग)"
              value="142"
              unit="mg/dL"
              status="warning"
              timestamp={isHindi ? 'आज · 08:20' : 'Today · 08:20 AM'}
              trend="declining"
              contextNote={isHindi ? 'सामान्य से थोड़ा अधिक' : 'Mild elevation'}
              icon={<Droplets size={16} />}
              language={language}
              onClick={() => navigate('/prototype/health-intelligence')}
            />

            <HealthMetric
              label="Blood Pressure"
              labelHi="रक्तचाप (सिस्टोलिक/डायस्टोलिक)"
              value="118/78"
              unit="mmHg"
              status="normal"
              timestamp={isHindi ? 'कल · 19:40' : 'Yesterday · 19:40'}
              trend="stable"
              contextNote={isHindi ? 'इष्टतम सीमा' : 'Optimal range'}
              icon={<Heart size={16} />}
              language={language}
              onClick={() => navigate('/prototype/health-intelligence')}
            />

            <HealthMetric
              label="Resting Heart Rate"
              labelHi="विश्राम हृदय गति"
              value="72"
              unit="bpm"
              status="normal"
              timestamp={isHindi ? 'आज · 08:30' : 'Today · 08:30 AM'}
              trend="stable"
              contextNote={isHindi ? 'स्थिर लय' : 'Resting sinus'}
              icon={<HeartPulse size={16} />}
              language={language}
              onClick={() => navigate('/prototype/health-intelligence')}
            />

            <HealthMetric
              label="Sleep Duration"
              labelHi="रात्रि विश्राम / नींद"
              value="7h 20m"
              unit=""
              status="normal"
              timestamp={isHindi ? 'पिछली रात' : 'Last night'}
              trend="improving"
              contextNote={isHindi ? 'गहरी नींद 1h 45m' : 'Deep sleep 1h 45m'}
              icon={<Moon size={16} />}
              language={language}
              onClick={() => navigate('/prototype/wellness')}
            />
          </div>
        </section>

        {/* 5. Safety Attention Notice (Non-alarming) */}
        <section className="sw-overview-safety-card" aria-label="Clinical attention note">
          <div className="sw-overview-safety-icon" aria-hidden="true">
            <Info size={20} />
          </div>
          <div className="sw-overview-safety-body">
            <div className="sw-overview-safety-title">
              <strong>{isHindi ? 'स्वास्थ्य निगरानी अवलोकन' : 'Observational Attention State'}</strong>
              <Badge variant="warning" size="sm">
                {isHindi ? 'समीक्षा सुझाव' : 'Follow-up Recommended'}
              </Badge>
            </div>
            <p className="sw-overview-safety-text">
              {isHindi
                ? 'आज सुबह का फास्टिंग ग्लूकोज (142 mg/dL) सामान्य सीमा से थोड़ा अधिक दर्ज है। पर्याप्त जलपान रखें और अगली नियमित चिकित्सक भेंट में इस मान पर चर्चा करें।'
                : 'Fasting glucose was noted at 142 mg/dL this morning. Maintain hydration and pace evening carbohydrate intake. Discuss health trends with a qualified healthcare professional.'}
            </p>
          </div>
        </section>

        {/* 6. Two-Column Layout: Latest Report & Recent Journey Timeline */}
        <div className="sw-overview-duo-grid">
          {/* Latest Lab Report Card */}
          <Card variant="default" padding="lg" className="sw-overview-report-card">
            <div className="sw-card-head-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <FileText size={18} color="var(--color-primary)" />
                  <Heading level={2} size="h5">
                    {isHindi ? 'सांकेतिक प्रयोगशाला रिपोर्ट' : 'Illustrative Lab Report'}
                  </Heading>
                </div>
                <span className="sw-card-sub">
                  {latestReport.facilityName} · {latestReport.date}
                </span>
              </div>
              <Badge variant="warning" size="sm">
                {isHindi ? 'समीक्षा योग्य' : 'Review'}
              </Badge>
            </div>

            <div className="sw-overview-report-summary">
              <strong>{latestReport.title}</strong>
              <p>{isHindi ? latestReport.summaryHi : latestReport.summaryEn}</p>
            </div>

            {/* Quick parameters preview */}
            <div className="sw-overview-params-preview">
              {latestReport.keyFindings.slice(0, 3).map((f) => (
                <div key={f.parameter} className="sw-overview-param-chip">
                  <span className="sw-param-name">{f.parameter}:</span>
                  <strong className="sw-param-val">
                    {f.value} {f.unit}
                  </strong>
                  <span className={`sw-param-dot sw-param-dot--${f.status}`} aria-hidden="true" />
                </div>
              ))}
            </div>

            <div className="sw-card-foot-row" style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/prototype/reports')}
              >
                {isHindi ? 'लाइब्रेरी खोलें' : 'All Reports'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
                onClick={() => {
                  setSelectedReportId(latestReport.id);
                  navigate('/prototype/report-analysis');
                }}
              >
                {isHindi ? 'सांकेतिक AI व्याख्या' : 'Illustrative AI Analysis'}
              </Button>
            </div>
          </Card>

          {/* Recent Journey Activity Feed */}
          <Card variant="default" padding="lg" className="sw-overview-activity-card">
            <div className="sw-card-head-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Activity size={18} color="var(--color-primary)" />
                <Heading level={2} size="h5">
                  {isHindi ? 'हालिया यात्रा गतिविधियाँ' : 'Recent Health Timeline'}
                </Heading>
              </div>
              <RouterLink to="/prototype/journey" className="sw-section-subhead__link">
                <span>{isHindi ? 'पूरी टाइमलाइन' : 'Timeline'}</span>
                <ArrowRight size={12} aria-hidden="true" />
              </RouterLink>
            </div>

            <div className="sw-activity-list">
              {journeyEvents.slice(0, 4).map((evt) => (
                <RouterLink
                  key={evt.id}
                  to={evt.relatedRoute || '/prototype/journey'}
                  className="sw-activity-item"
                >
                  <div className="sw-act-icon">
                    <History size={15} color="var(--color-primary)" />
                  </div>
                  <div className="sw-activity-content">
                    <span className="sw-activity-title">
                      {isHindi ? evt.titleHi : evt.titleEn}
                    </span>
                    <span className="sw-activity-desc">
                      {isHindi ? evt.descriptionHi.slice(0, 75) : evt.descriptionEn.slice(0, 75)}...
                    </span>
                    <span className="sw-activity-time">
                      {evt.date} · {evt.timestamp}
                    </span>
                  </div>
                </RouterLink>
              ))}
            </div>
          </Card>
        </div>

        {/* 7. Bottom Duo Grid: Family Circle Summary & Wellness Today */}
        <div className="sw-overview-duo-grid">
          {/* People You Trust (Family Context) */}
          <Card variant="subtle" padding="lg">
            <div className="sw-card-head-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Users size={18} color="var(--color-primary)" />
                  <Heading level={2} size="h5">
                    {isHindi ? 'विश्वसनीय स्वजन (People You Trust)' : 'People You Trust (Family Context)'}
                  </Heading>
                </div>
                <span className="sw-card-sub">
                  {isHindi
                    ? 'पारिवारिक संबंध और डेटा अनुमति का स्पष्ट विभाजन'
                    : 'Family relations distinct from medical data permissions'}
                </span>
              </div>
              <RouterLink to="/prototype/family">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  {isHindi ? 'सभी सदस्य' : 'Manage Access'}
                </Button>
              </RouterLink>
            </div>

            <div className="sw-family-strip">
              {familyMembers.slice(0, 3).map((member) => (
                <div key={member.id} className="sw-family-pill">
                  <div className="sw-family-pill__avatar" aria-hidden="true">
                    {member.avatarInitials}
                  </div>
                  <div className="sw-family-pill__info">
                    <strong className="sw-family-pill__name">{member.name}</strong>
                    <span className="sw-family-pill__rel">{member.relationship}</span>
                  </div>
                  <Badge
                    variant={member.medicalAccessState === 'Not shared' ? 'default' : 'primary'}
                    size="sm"
                  >
                    {member.medicalAccessState}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Wellness & Goals Progress */}
          <Card variant="subtle" padding="lg">
            <div className="sw-card-head-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Target size={18} color="var(--color-primary)" />
                  <Heading level={2} size="h5">
                    {isHindi ? 'कल्याण लक्ष्य एवं दिनचर्या' : 'Wellness & Daily Goals'}
                  </Heading>
                </div>
                <span className="sw-card-sub">
                  {completedGoalsCount} / {healthGoals.length} {isHindi ? 'लक्ष्य संपन्न' : 'goals achieved today'}
                </span>
              </div>
              <RouterLink to="/prototype/goals">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  {isHindi ? 'लक्ष्य सूची' : 'View Goals'}
                </Button>
              </RouterLink>
            </div>

            <div className="sw-wellness-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {healthGoals.slice(0, 2).map((goal) => (
                  <div
                    key={goal.id}
                    style={{
                      background: 'var(--color-surface)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {isHindi ? goal.titleHi : goal.titleEn}
                    </span>
                    <span style={{ color: goal.completed ? 'var(--color-health-normal)' : 'var(--color-primary)' }}>
                      {goal.completed ? (isHindi ? 'संपन्न' : 'Achieved') : `${goal.progressPercent}%`}
                    </span>
                  </div>
                ))}
              </div>

              {todayWellness && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <p className="sw-wellness-desc" style={{ fontSize: '11px' }}>
                    <strong>{isHindi ? 'प्राकृतिक अभ्यास: ' : 'Suggested Practice: '}</strong>
                    {todayWellness.suggestedActivity}
                  </p>
                </div>
              )}
            </div>

            <div className="sw-card-foot-row">
              <RouterLink to="/prototype/wellness">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                  {isHindi ? 'कल्याण योजना' : 'Wellness Plan'}
                </Button>
              </RouterLink>
            </div>
          </Card>
        </div>

        {/* 8. Ask SwasthyaAI Entry (Assistant Integration) */}
        <section className="sw-overview-assistant-card" aria-label="Consult AI Assistant">
          <div className="sw-overview-assistant-left">
            <Sparkles size={24} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h2 className="sw-overview-assistant-title">
                {isHindi ? 'SwasthyaAI से प्रश्न पूछें' : 'Have a Question About Your Health Story?'}
              </h2>
              <p className="sw-overview-assistant-desc">
                {isHindi
                  ? 'अपनी हालिया लैब रिपोर्ट, ग्लूकोज में आए बदलाव अथवा दिनचर्या के बारे में सीधे बातचीत करें। हमारा AI सहायक आपकी भाषा में स्पष्ट उत्तर देगा।'
                  : 'Ask plain-language questions about your latest CMP blood test, what changed in your blood sugar, or how to maintain evening Shatapadi walking.'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={14} />}
            onClick={() => navigate('/prototype/assistant')}
          >
            {isHindi ? 'सहायक से पूछें' : 'Ask SwasthyaAI'}
          </Button>
        </section>

        {/* Phase 5 Explainability Dialog */}
        <InsightExplanation
          insight={explainInsight}
          isOpen={!!explainInsight}
          onClose={() => setExplainInsight(null)}
          isHindi={isHindi}
        />
      </div>
    </PrototypeShell>
  );
};
