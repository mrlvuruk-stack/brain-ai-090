import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldAlert,
  Droplets,
  Heart,
  HeartPulse,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import { usePrototype } from '../../state';
import { demoTimelineData } from '../../data/demoData';
import type { ChartDataPoint } from '../../data/types';
import './HealthIntelligencePage.css';

export const HealthIntelligencePage: React.FC = () => {
  const {
    timeframe,
    setTimeframe,
    activeMetricId,
    setActiveMetricId,
    language,
  } = usePrototype();

  const isHindi = language === 'hi';
  const metricData = demoTimelineData[activeMetricId];

  // Pick current data series based on timeframe
  const points: ChartDataPoint[] =
    timeframe === '7d'
      ? metricData.points7d
      : timeframe === '30d'
      ? metricData.points30d
      : metricData.points90d;

  const [activePointIndex, setActivePointIndex] = useState<number>(points.length - 1);
  const activePoint = points[activePointIndex] || points[points.length - 1];

  // Calculate statistics
  const values = points.map((p) => p.value);
  const avgValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  // SVG Chart Dimensions & Scaling
  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const minScale = Math.min(...values) * 0.85;
  const maxScale = Math.max(...values) * 1.15;

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX;
    return paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const range = maxScale - minScale || 1;
    const ratio = (val - minScale) / range;
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  // SVG Path Data
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${chartHeight - paddingY} L ${getX(
    0
  )} ${chartHeight - paddingY} Z`;

  // Secondary path (e.g. Diastolic BP)
  const hasSecondary = points.some((p) => p.secondaryValue !== undefined);
  const secondaryPathD = hasSecondary
    ? points
        .map(
          (p, i) =>
            `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.secondaryValue || p.value)}`
        )
        .join(' ')
    : '';

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य रुझान' : 'Health Intelligence'}>
      <div className="sw-intel-page">
        {/* Header */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="primary" size="sm" showDot>
              {isHindi ? 'दीर्घकालिक वाइटल्स रुझान' : 'Longitudinal Biometric Trends'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi
                ? 'शालीन, क्लिनिकल रूप से व्यवस्थित चार्ट'
                : 'Calm, Clinically Organized Timeline'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'स्वास्थ्य रुझान और बायोमेट्रिक टाइमलाइन' : 'Health Intelligence & Trends'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'समय के साथ वाइटल्स के बदलावों को समझें। 7 दिन, 30 दिन या 90 दिन का समय चुनें और जीवनशैली घटनाओं का प्रभाव देखें।'
              : 'Observe physiological continuity without alarming clutter. Filter by 7, 30, or 90 days to discover how daily habits influence clinical trends.'}
          </Text>
        </div>

        {/* Metric Selector Tabs */}
        <div className="sw-intel-metric-selector">
          <button
            type="button"
            className={`sw-metric-select-btn ${
              activeMetricId === 'glucose' ? 'sw-metric-select-btn--active' : ''
            }`}
            onClick={() => {
              setActiveMetricId('glucose');
              setActivePointIndex(0);
            }}
          >
            <Droplets size={16} />
            <span>{isHindi ? 'फास्टिंग ग्लूकोज' : 'Fasting Glucose'}</span>
          </button>

          <button
            type="button"
            className={`sw-metric-select-btn ${
              activeMetricId === 'bp' ? 'sw-metric-select-btn--active' : ''
            }`}
            onClick={() => {
              setActiveMetricId('bp');
              setActivePointIndex(0);
            }}
          >
            <Heart size={16} />
            <span>{isHindi ? 'रक्तचाप' : 'Blood Pressure'}</span>
          </button>

          <button
            type="button"
            className={`sw-metric-select-btn ${
              activeMetricId === 'heartRate' ? 'sw-metric-select-btn--active' : ''
            }`}
            onClick={() => {
              setActiveMetricId('heartRate');
              setActivePointIndex(0);
            }}
          >
            <HeartPulse size={16} />
            <span>{isHindi ? 'हृदय गति' : 'Heart Rate'}</span>
          </button>
        </div>

        {/* Primary Visualization Card */}
        <Card variant="default" padding="lg" className="sw-intel-chart-card">
          {/* Top Controls: Title & Timeframe Filters */}
          <div className="sw-chart-top-bar">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Activity size={18} color="var(--color-primary)" />
                <Heading level={2} size="h4">
                  {metricData.title}
                </Heading>
              </div>
              <span className="sw-chart-meta">
                {isHindi ? 'मानक संदर्भ सीमा: ' : 'Target Physiological Baseline: '}
                <strong>{metricData.normalRange}</strong>
              </span>
            </div>

            {/* Timeframe Filter Buttons (Actually change displayed data) */}
            <div className="sw-timeframe-toggle" role="group" aria-label="Timeframe filter">
              {(['7d', '30d', '90d'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={`sw-tf-btn ${timeframe === tf ? 'sw-tf-btn--active' : ''}`}
                  onClick={() => {
                    setTimeframe(tf);
                    setActivePointIndex(0);
                  }}
                >
                  {tf === '7d'
                    ? (isHindi ? '7 दिन' : '7 Days')
                    : tf === '30d'
                    ? (isHindi ? '30 दिन' : '30 Days')
                    : (isHindi ? '90 दिन' : '90 Days')}
                </button>
              ))}
            </div>
          </div>

          {/* Active Highlighted Point Banner */}
          <div className="sw-point-highlight-banner">
            <div>
              <span className="sw-point-highlight-date">{activePoint.date}</span>
              <div className="sw-point-highlight-val-row">
                <span className="sw-point-highlight-val">
                  {activePoint.value}
                  {activePoint.secondaryValue ? ` / ${activePoint.secondaryValue}` : ''}
                </span>
                <span className="sw-point-highlight-unit">{metricData.unit}</span>
                <Badge
                  variant={activePoint.status === 'normal' ? 'normal' : 'warning'}
                  size="sm"
                >
                  {activePoint.status === 'normal'
                    ? (isHindi ? 'सामान्य' : 'Normal')
                    : (isHindi ? 'ध्यान दें' : 'Attention')}
                </Badge>
              </div>
            </div>

            {activePoint.note && (
              <div className="sw-point-highlight-note">
                <Sparkles size={14} color="var(--color-primary)" />
                <span>{activePoint.note}</span>
              </div>
            )}

            <div className="sw-point-highlight-actions">
              <ContextualAskButton
                context={{
                  sourceType: 'metric',
                  sourceTitleEn: `${metricData.title} (${activePoint.date})`,
                  sourceTitleHi: `${metricData.title} (${activePoint.date})`,
                  sourceDate: activePoint.date,
                  snippetEn: `Recorded measurement: ${activePoint.value} ${metricData.unit} on ${activePoint.date}. ${activePoint.note || ''}`,
                  snippetHi: `दर्ज माप: ${activePoint.date} को ${activePoint.value} ${metricData.unit}। ${activePoint.note || ''}`,
                  suggestedQuestions: [
                    {
                      questionEn: `What does this ${metricData.title} measurement show?`,
                      questionHi: `यह ${metricData.title} माप क्या दर्शाता है?`,
                      assistantQuery: `Explain the ${metricData.title} reading of ${activePoint.value} ${metricData.unit} on ${activePoint.date}.`,
                    },
                  ],
                }}
                labelEn="Ask about this measurement"
                labelHi="इस माप पर पूछें"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>

          {/* SVG Longitudinal Line & Area Visualization */}
          <div className="sw-svg-chart-container">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="sw-svg-chart"
              preserveAspectRatio="none"
              aria-label="Longitudinal biometric trend chart"
            >
              <defs>
                <linearGradient id="swAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="var(--color-border-subtle)"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="var(--color-border-subtle)"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="var(--color-border-subtle)"
              />

              {/* Shaded Area */}
              <path d={areaD} fill="url(#swAreaGradient)" />

              {/* Primary Line */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Secondary Line (if BP Diastolic) */}
              {hasSecondary && (
                <path
                  d={secondaryPathD}
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
              )}

              {/* Data Points / Interactive Dots */}
              {points.map((p, idx) => {
                const cx = getX(idx);
                const cy = getY(p.value);
                const isSelected = idx === activePointIndex;

                return (
                  <g
                    key={idx}
                    className="sw-chart-dot-group"
                    onClick={() => setActivePointIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.label}: ${p.value} ${metricData.unit}`}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      className={`sw-chart-dot ${
                        p.status === 'warning' ? 'sw-chart-dot--warning' : 'sw-chart-dot--normal'
                      } ${isSelected ? 'sw-chart-dot--selected' : ''}`}
                    />
                    {/* Date label underneath */}
                    <text
                      x={cx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="sw-chart-x-label"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Statistical Highlights Summary */}
          <div className="sw-intel-stats-row">
            <div className="sw-intel-stat-card">
              <span className="sw-stat-label">
                {isHindi ? 'औसत मान' : 'Average Reading'}
              </span>
              <strong className="sw-stat-value">
                {avgValue} <span className="sw-stat-unit">{metricData.unit}</span>
              </strong>
              <span className="sw-stat-sub">
                {isHindi ? `${points.length} प्रविष्टियों पर आधारित` : `Across ${points.length} checkpoints`}
              </span>
            </div>

            <div className="sw-intel-stat-card">
              <span className="sw-stat-label">
                {isHindi ? 'अधिकतम शिखर' : 'Peak Reading'}
              </span>
              <strong className="sw-stat-value">
                {maxValue} <span className="sw-stat-unit">{metricData.unit}</span>
              </strong>
              <span className="sw-stat-sub">{isHindi ? 'अधिकतम मान' : 'Highest recorded'}</span>
            </div>

            <div className="sw-intel-stat-card">
              <span className="sw-stat-label">
                {isHindi ? 'न्यूनतम मान' : 'Lowest Reading'}
              </span>
              <strong className="sw-stat-value">
                {minValue} <span className="sw-stat-unit">{metricData.unit}</span>
              </strong>
              <span className="sw-stat-sub">{isHindi ? 'बेसलाइन मान' : 'Lowest recorded'}</span>
            </div>

            <div className="sw-intel-stat-card">
              <span className="sw-stat-label">
                {isHindi ? 'समग्र दिशा' : 'Observed Direction'}
              </span>
              <div className="sw-stat-trend-wrap">
                {timeframe === '90d' ? (
                  <>
                    <TrendingDown size={18} color="var(--color-success)" />
                    <strong className="sw-stat-value" style={{ color: 'var(--color-success)' }}>
                      {isHindi ? 'सुधार (-18 mg/dL)' : 'Improving (-18)'}
                    </strong>
                  </>
                ) : (
                  <>
                    <Minus size={18} color="var(--color-warning)" />
                    <strong className="sw-stat-value" style={{ color: 'var(--color-warning)' }}>
                      {isHindi ? 'स्थिर / निगरानी' : 'Pacing / Stable'}
                    </strong>
                  </>
                )}
              </div>
              <span className="sw-stat-sub">
                {isHindi ? 'आहार व सैर से संबद्ध' : 'Correlates with lifestyle pacing'}
              </span>
            </div>
          </div>
        </Card>

        {/* Notable Events Timeline */}
        <Card variant="subtle" padding="lg">
          <div className="sw-card-head-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Calendar size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5">
                {isHindi ? 'उल्लेखनीय स्वास्थ्य घटनाएँ व जीवनशैली संदर्भ' : 'Notable Health Events & Lifestyle Correlation'}
              </Heading>
            </div>
            <span className="sw-card-sub">
              {isHindi ? 'सांकेतिक टाइमलाइन' : 'Correlated Pilot Timeline'}
            </span>
          </div>

          <div className="sw-events-timeline">
            {points
              .filter((p) => p.note)
              .map((p, idx) => (
                <div key={idx} className="sw-event-item">
                  <div className="sw-event-date-col">
                    <strong>{p.date}</strong>
                    <span className="sw-event-reading">
                      {p.value} {metricData.unit}
                    </span>
                  </div>
                  <div className="sw-event-line-col">
                    <span className="sw-event-dot" />
                  </div>
                  <div className="sw-event-detail-col">
                    <p className="sw-event-note">{p.note}</p>
                    <span className="sw-event-context">
                      {isHindi
                        ? 'दैनिक सैर, आहार या विश्राम दिनचर्या से संबद्ध अवलोकन।'
                        : 'Biometric shift recorded following documented routine or meal pacing.'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Non-Diagnostic Clinical Boundary */}
        <div className="sw-report-disclaimer-box">
          <ShieldAlert size={18} className="sw-disclaimer-icon" aria-hidden="true" />
          <div className="sw-disclaimer-content">
            <strong>
              {isHindi ? 'सांकेतिक रुझान सुरक्षा सूचना' : 'Illustrative Trend Boundary'}
            </strong>
            <p>
              {isHindi
                ? 'यह रुझान चार्ट शैक्षिक सॉफ्टवेयर सिमुलेशन है। इसे नैदानिक निदान के रूप में न लें। किसी भी स्वास्थ्य निर्णय से पूर्व चिकित्सक से परामर्श करें।'
                : 'Longitudinal graphs are educational prototype models. They do not constitute formal diagnostic monitoring. Discuss chronic patterns with your registered healthcare practitioner.'}
            </p>
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
};
