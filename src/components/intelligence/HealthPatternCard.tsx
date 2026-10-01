import React from 'react';
import { GitBranch, Calendar, AlertCircle } from 'lucide-react';
import type { HealthPattern } from '../../data/intelligenceTypes';
import { SourceChipList } from './SourceChipList';
import { ContextualAskButton } from './ContextualAskButton';
import './HealthPatternCard.css';

interface HealthPatternCardProps {
  pattern: HealthPattern;
  isHindi?: boolean;
  className?: string;
}

export const HealthPatternCard: React.FC<HealthPatternCardProps> = ({
  pattern,
  isHindi = false,
  className = '',
}) => {
  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 140;
  const paddingX = 35;
  const paddingY = 25;

  const points = pattern.dataPoints;
  const primaryValues = points.map((p) => p.primaryVal);
  const secondaryValues = points.map((p) => p.secondaryVal);

  const minPrimary = Math.min(...primaryValues) * 0.9;
  const maxPrimary = Math.max(...primaryValues) * 1.1;

  const minSecondary = Math.min(...secondaryValues) * 0.8;
  const maxSecondary = Math.max(...secondaryValues) * 1.2 || 1;

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX;
    return paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getYPrimary = (val: number) => {
    const range = maxPrimary - minPrimary || 1;
    const ratio = (val - minPrimary) / range;
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const getYSecondary = (val: number) => {
    const range = maxSecondary - minSecondary || 1;
    const ratio = (val - minSecondary) / range;
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const primaryPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYPrimary(p.primaryVal)}`)
    .join(' ');

  const secondaryPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYSecondary(p.secondaryVal)}`)
    .join(' ');

  return (
    <article className={`sw-pattern-card ${className}`} aria-labelledby={`pattern-title-${pattern.id}`}>
      {/* Header */}
      <div className="sw-pattern-card__header">
        <div className="sw-pattern-card__meta">
          <span className="sw-pattern-badge sw-pattern-badge--category">
            <GitBranch size={13} aria-hidden="true" />
            <span>{isHindi ? pattern.categoryLabelHi : pattern.categoryLabelEn}</span>
          </span>

          <span className="sw-pattern-badge sw-pattern-badge--rel">
            <span>{isHindi ? pattern.relationshipTypeHi : pattern.relationshipTypeEn}</span>
          </span>
        </div>

        <div className="sw-pattern-card__window">
          <Calendar size={13} aria-hidden="true" />
          <span>{isHindi ? pattern.timeWindowHi : pattern.timeWindowEn}</span>
        </div>
      </div>

      {/* Title & Description */}
      <h3 id={`pattern-title-${pattern.id}`} className="sw-pattern-card__title">
        {isHindi ? pattern.titleHi : pattern.titleEn}
      </h3>
      <p className="sw-pattern-card__desc">
        {isHindi ? pattern.descriptionHi : pattern.descriptionEn}
      </p>

      {/* Interactive Chart Visual */}
      <div className="sw-pattern-chart-box">
        <div className="sw-pattern-chart-legend">
          <div className="sw-pattern-legend-item sw-pattern-legend-item--primary">
            <span className="sw-pattern-legend-color" aria-hidden="true" />
            <span className="sw-pattern-legend-label">
              {isHindi ? pattern.primaryMetricLabelHi : pattern.primaryMetricLabelEn} ({pattern.primaryUnit})
            </span>
          </div>
          <div className="sw-pattern-legend-item sw-pattern-legend-item--secondary">
            <span className="sw-pattern-legend-color" aria-hidden="true" />
            <span className="sw-pattern-legend-label">
              {isHindi ? pattern.secondaryMetricLabelHi : pattern.secondaryMetricLabelEn} ({pattern.secondaryUnit})
            </span>
          </div>
        </div>

        <div className="sw-pattern-svg-wrapper">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="sw-pattern-svg"
            role="img"
            aria-label={`${pattern.titleEn} comparison chart`}
          >
            {/* Horizontal Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e2e8f0" />

            {/* Primary Trend Line (Teal) */}
            <path d={primaryPath} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Secondary Trend Line (Indigo dashed) */}
            <path d={secondaryPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data point dots */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getYPrimary(p.primaryVal)} r="4" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
                <circle cx={getX(i)} cy={getYSecondary(p.secondaryVal)} r="3.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                <text x={getX(i)} y={chartHeight - 8} fontSize="9" fill="#94a3b8" textAnchor="middle">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Observation Summary */}
      <div className="sw-pattern-card__summary">
        <span className="sw-pattern-card__summary-label">
          {isHindi ? 'अवलोकन निष्कर्ष:' : 'Observation Summary:'}
        </span>
        <p className="sw-pattern-card__summary-text">
          {isHindi ? pattern.observationSummaryHi : pattern.observationSummaryEn}
        </p>
      </div>

      {/* Non-causal disclaimer */}
      <div className="sw-pattern-card__disclaimer" role="note">
        <AlertCircle size={13} aria-hidden="true" />
        <span>{isHindi ? pattern.nonCausalDisclaimerHi : pattern.nonCausalDisclaimerEn}</span>
      </div>

      {/* Footer Sources & Action */}
      <div className="sw-pattern-card__footer">
        <SourceChipList sources={pattern.sources} isHindi={isHindi} size="sm" />
        <ContextualAskButton
          context={{
            sourceType: 'pattern',
            sourceTitleEn: pattern.titleEn,
            sourceTitleHi: pattern.titleHi,
            snippetEn: pattern.descriptionEn,
            snippetHi: pattern.descriptionHi,
            suggestedQuestions: pattern.suggestedQuestions,
          }}
          labelEn="Ask about this pattern"
          labelHi="इस पैटर्न के बारे में पूछें"
          variant="outline"
          size="sm"
        />
      </div>
    </article>
  );
};
