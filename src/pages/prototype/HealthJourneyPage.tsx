import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Activity,
  HeartPulse,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Heading, Text } from '../../components/ui/Typography';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import { usePrototype } from '../../state';
import { healthInformationMapNodes } from '../../data/journeyDemoData';
import type { JourneyEventCategory } from '../../data/journeyTypes';
import './HealthJourneyPage.css';

export const HealthJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    journeyEvents,
    healthChanges,
    language,
  } = usePrototype();

  const isHindi = language === 'hi';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterCategories = [
    { id: 'all', labelEn: 'All Milestones', labelHi: 'सभी मील के पत्थर' },
    { id: 'metric', labelEn: 'Vitals & Logs', labelHi: 'वाइटल्स व लॉग्स' },
    { id: 'report', labelEn: 'Illustrative Lab Reports', labelHi: 'सांकेतिक लैब रिपोर्ट्स' },
    { id: 'wellness', labelEn: 'Wellness & Routine', labelHi: 'दिनचर्या व योग' },
    { id: 'goal', labelEn: 'Goals Achieved', labelHi: 'लक्ष्य उपलब्धियां' },
    { id: 'family', labelEn: 'Family & Consent', labelHi: 'पारिवारिक सहमति' },
  ];

  const filteredEvents = selectedCategory === 'all'
    ? journeyEvents
    : journeyEvents.filter((evt) => {
        if (selectedCategory === 'wellness') {
          return evt.category === 'wellness';
        }
        return evt.category === selectedCategory;
      });

  const getEventCategoryIcon = (category: JourneyEventCategory) => {
    switch (category) {
      case 'report':
        return <FileText size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--report" />;
      case 'metric':
        return <Activity size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--metric" />;
      case 'wellness':
        return <HeartPulse size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--wellness" />;
      case 'goal':
        return <Compass size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--goal" />;
      case 'family':
        return <Users size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--family" />;
      case 'insight':
        return <Sparkles size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--insight" />;
      case 'assessment':
      default:
        return <Clock size={16} className="sw-timeline-cat-icon sw-timeline-cat-icon--default" />;
    }
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य यात्रा' : 'Health Journey'}>
      <div className="sw-journey-page">
        {/* 1. Header Section */}
        <header className="sw-journey-header">
          <div className="sw-journey-header__main">
            <div className="sw-journey-header__title-row">
              <div className="sw-journey-badge-icon" aria-hidden="true">
                <Clock size={20} />
              </div>
              <h1 className="sw-journey-title">
                {isHindi ? 'व्यक्तिगत स्वास्थ्य यात्रा' : 'Personal Health Journey'}
              </h1>
              <span className="sw-journey-boundary-tag">
                {isHindi ? 'प्रोटोटाइप • सांकेतिक समयरेखा' : 'PROTOTYPE • DEMO TIMELINE'}
              </span>
            </div>
            <p className="sw-journey-subtitle">
              {isHindi
                ? `${currentProfile.fullName} के स्वास्थ्य इतिहास, सांकेतिक लैब रिपोर्ट, दिनचर्या और महत्वपूर्ण बदलावों की कालानुक्रमिक व्यक्तिगत कहानी।`
                : `A coherent personal health story for ${currentProfile.fullName} connecting illustrative lab reports, daily habits, and meaningful changes over time.`}
            </p>
          </div>

          <div className="sw-journey-header__actions">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => navigate('/prototype/assistant')}
            >
              {isHindi ? 'सहायक से पूछें' : 'Ask SwasthyaAI'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Compass size={14} />}
              onClick={() => navigate('/prototype/goals')}
            >
              {isHindi ? 'स्वास्थ्य लक्ष्य देखें' : 'View Health Goals'}
            </Button>
          </div>
        </header>

        {/* 2. "WHAT CHANGED?" EXPERIENCE (Section 2) */}
        <section className="sw-what-changed-section" aria-labelledby="what-changed-heading">
          <div className="sw-section-subhead">
            <div>
              <Heading level={2} size="h5" id="what-changed-heading">
                {isHindi ? 'हालिया बदलाव: पूर्व बनाम वर्तमान' : 'What Changed: Previous Period vs Current'}
              </Heading>
              <Text variant="secondary" className="sw-section-subhead__desc">
                {isHindi
                  ? 'पिछले 30 से 60 दिनों में दर्ज किए गए सांकेतिक स्वास्थ्य मापदंडों में परिवर्तन का निष्पक्ष अवलोकन।'
                  : 'Objective comparison between past and present synthetic demo records over 30 to 60 days.'}
              </Text>
            </div>
            <Badge variant="primary" size="sm">
              {isHindi ? '30-दिवसीय तुलना' : '30-Day Comparison'}
            </Badge>
          </div>

          <div className="sw-changes-grid">
            {healthChanges.map((change) => (
              <div key={change.id} className="sw-change-card">
                <div className="sw-change-card__head">
                  <span className="sw-change-card__period">
                    {isHindi ? change.periodHi : change.periodEn}
                  </span>
                  <span
                    className={`sw-change-card__pill sw-change-card__pill--${change.direction}`}
                  >
                    {change.direction === 'decreased' || change.direction === 'improved' ? (
                      <TrendingDown size={13} aria-hidden="true" />
                    ) : (
                      <TrendingUp size={13} aria-hidden="true" />
                    )}
                    <span>{change.difference}</span>
                  </span>
                </div>

                <strong className="sw-change-card__name">
                  {isHindi ? change.metricNameHi : change.metricNameEn}
                </strong>

                {/* Previous vs Current Value Ribbon */}
                <div className="sw-change-values-row">
                  <div className="sw-change-val-box sw-change-val-box--prev">
                    <span className="sw-change-val-label">
                      {isHindi ? 'पूर्व मान' : 'Previous'}
                    </span>
                    <strong className="sw-change-val-text">
                      {change.previousValue} <small>{change.unit}</small>
                    </strong>
                  </div>

                  <div className="sw-change-arrow" aria-hidden="true">
                    <ArrowRight size={14} />
                  </div>

                  <div className="sw-change-val-box sw-change-val-box--curr">
                    <span className="sw-change-val-label">
                      {isHindi ? 'वर्तमान मान' : 'Current demo'}
                    </span>
                    <strong className="sw-change-val-text">
                      {change.currentValue} <small>{change.unit}</small>
                    </strong>
                  </div>
                </div>

                <p className="sw-change-card__context">
                  {isHindi ? change.contextHi : change.contextEn}
                </p>

                <div className="sw-change-card__foot">
                  <button
                    type="button"
                    className="sw-change-link"
                    onClick={() => navigate(change.relatedRoute)}
                  >
                    <span>{isHindi ? 'रुझान ग्राफ खोलें' : 'View Continuous Trend'}</span>
                    <ChevronRight size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sw-change-safety-notice">
            <Shield size={13} aria-hidden="true" />
            <span>
              {isHindi
                ? 'सांकेतिक प्रोटोटाइप अवलोकन: ये मान वास्तविक नैदानिक साक्ष्य नहीं हैं। किसी भी स्वास्थ्य परिवर्तन पर अपने पंजीकृत चिकित्सक से परामर्श करें।'
                : 'Educational prototype boundary: Descriptive comparisons only. Does not diagnose disease or prescribe lifestyle interventions.'}
            </span>
          </div>
        </section>

        {/* 3. CHRONOLOGICAL TIMELINE (Section 1) */}
        <section className="sw-timeline-section" aria-labelledby="timeline-heading">
          <div className="sw-section-subhead">
            <div>
              <Heading level={2} size="h5" id="timeline-heading">
                {isHindi ? 'स्वास्थ्य घटनाक्रम व मील के पत्थर' : 'Chronological Story & Milestones'}
              </Heading>
              <Text variant="secondary" className="sw-section-subhead__desc">
                {isHindi
                  ? 'आपकी स्वास्थ्य यात्रा में दर्ज प्रत्येक घटना, सांकेतिक रिपोर्ट और कल्याण उपलब्धि।'
                  : 'Every illustrative lab report, vital checkpoint, and wellness routine logged in your story.'}
              </Text>
            </div>
            <span className="sw-events-count-badge">
              {filteredEvents.length} {isHindi ? 'घटनाएँ' : 'events'}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="sw-timeline-filters" role="tablist" aria-label="Event category filters">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`sw-filter-pill ${
                  selectedCategory === cat.id ? 'sw-filter-pill--active' : ''
                }`}
                onClick={() => setSelectedCategory(cat.id)}
                role="tab"
                aria-selected={selectedCategory === cat.id}
              >
                {isHindi ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Timeline Stream */}
          <div className="sw-timeline-stream">
            {filteredEvents.map((evt, idx) => (
              <div key={evt.id} className="sw-timeline-node">
                {/* Left Date Column */}
                <div className="sw-timeline-date-col">
                  <span className="sw-timeline-date">{evt.date}</span>
                  <span className="sw-timeline-time">{evt.timestamp}</span>
                </div>

                {/* Central Axis & Dot */}
                <div className="sw-timeline-axis">
                  <div className="sw-timeline-dot" aria-hidden="true">
                    {getEventCategoryIcon(evt.category)}
                  </div>
                  {idx < filteredEvents.length - 1 && <div className="sw-timeline-line" />}
                </div>

                {/* Right Event Card */}
                <div className="sw-timeline-content-card">
                  <div className="sw-timeline-card-header">
                    <div className="sw-timeline-card-badges">
                      <span className="sw-timeline-category-tag">
                        {isHindi ? evt.badgeLabelHi || evt.category : evt.badgeLabelEn || evt.category}
                      </span>
                      <span className={`sw-timeline-status sw-timeline-status--${evt.status}`}>
                        {isHindi
                          ? evt.status === 'completed'
                            ? 'सम्पन्न'
                            : 'पंजीकृत'
                          : evt.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <strong className="sw-timeline-title">
                    {isHindi ? evt.titleHi : evt.titleEn}
                  </strong>

                  <p className="sw-timeline-desc">
                    {isHindi ? evt.descriptionHi : evt.descriptionEn}
                  </p>

                  {/* Optional Metrics Mini Chips */}
                  {evt.metricsPreview && evt.metricsPreview.length > 0 && (
                    <div className="sw-timeline-metrics-row">
                      {evt.metricsPreview.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className={`sw-timeline-metric-chip sw-timeline-metric-chip--${m.status}`}
                        >
                          <span className="sw-timeline-metric-name">
                            {isHindi ? m.labelHi : m.labelEn}:
                          </span>
                          <strong className="sw-timeline-metric-val">
                            {m.value} {m.unit}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                    <div className="sw-timeline-foot">
                      {evt.relatedRoute && (
                        <Button
                          variant="ghost"
                          size="sm"
                          rightIcon={<ArrowRight size={13} />}
                          onClick={() => navigate(evt.relatedRoute!)}
                        >
                          {isHindi
                            ? `${evt.relatedNameHi || 'विवरण देखें'}`
                            : `Open ${evt.relatedNameEn || 'Details'}`}
                        </Button>
                      )}
                      <ContextualAskButton
                        context={{
                          sourceType: 'journey',
                          sourceTitleEn: evt.titleEn,
                          sourceTitleHi: evt.titleHi,
                          sourceDate: evt.date,
                          snippetEn: evt.descriptionEn,
                          snippetHi: evt.descriptionHi,
                          suggestedQuestions: [
                            {
                              questionEn: `What happened in the journey event: "${evt.titleEn}"?`,
                              questionHi: `स्वास्थ्य यात्रा की घटना "${evt.titleHi}" में क्या दर्ज हुआ?`,
                              assistantQuery: `Explain the health journey event "${evt.titleEn}" recorded on ${evt.date}.`,
                            },
                          ],
                        }}
                        labelEn="Ask about event"
                        labelHi="घटना पर पूछें"
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HEALTH INFORMATION MAP (Section 8) */}
        <section className="sw-info-map-section" aria-labelledby="info-map-heading">
          <div className="sw-section-subhead">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Layers size={18} color="var(--color-primary)" />
                <Heading level={2} size="h5" id="info-map-heading">
                  {isHindi ? 'स्वास्थ्य सूचना संबंध मानचित्र' : 'Health Information Map'}
                </Heading>
              </div>
              <Text variant="secondary" className="sw-section-subhead__desc">
                {isHindi
                  ? 'जानिए कैसे आपकी रिपोर्ट, वाइटल्स, व्यक्तिगत स्वास्थ्य यात्रा और पारिवारिक अनुमतियाँ आपस में जुड़ी हैं।'
                  : 'A human-readable map showing how reports, vitals, wellness goals, and family access connect.'}
              </Text>
            </div>
            <Badge variant="default" size="sm">
              {isHindi ? 'सूचना संरचना' : 'Information Flow'}
            </Badge>
          </div>

          <div className="sw-info-map-grid">
            {healthInformationMapNodes.map((node) => (
              <div
                key={node.id}
                className="sw-map-card"
                onClick={() => navigate(node.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(node.route);
                  }
                }}
              >
                <div className="sw-map-card__top">
                  <span className={`sw-map-node-tag sw-map-node-tag--${node.category}`}>
                    {node.category.toUpperCase()}
                  </span>
                  <ArrowRight size={14} className="sw-map-arrow" aria-hidden="true" />
                </div>
                <strong className="sw-map-card__title">
                  {isHindi ? node.titleHi : node.titleEn}
                </strong>
                <p className="sw-map-card__desc">
                  {isHindi ? node.descriptionHi : node.descriptionEn}
                </p>
                <div className="sw-map-card__connections">
                  <small>{isHindi ? 'संबद्ध मॉड्यूल:' : 'Connects to:'}</small>
                  <span>{node.connections.map((c) => c.replace('map_', '')).join(' · ')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PrototypeShell>
  );
};
