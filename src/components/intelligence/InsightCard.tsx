import React, { useState } from 'react';
import {
  TrendingUp,
  GitBranch,
  FileText,
  HeartPulse,
  History,
  Users,
  BookOpen,
  HelpCircle,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import type { HealthInsight } from '../../data/intelligenceTypes';
import { SourceChipList } from './SourceChipList';
import { ContextualAskButton } from './ContextualAskButton';
import { InsightExplanation } from './InsightExplanation';
import './InsightCard.css';

interface InsightCardProps {
  insight: HealthInsight;
  isHindi?: boolean;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  isHindi = false,
  className = '',
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const getCategoryIcon = (category: HealthInsight['category']) => {
    switch (category) {
      case 'change':
        return <TrendingUp size={15} aria-hidden="true" />;
      case 'pattern':
        return <GitBranch size={15} aria-hidden="true" />;
      case 'report':
        return <FileText size={15} aria-hidden="true" />;
      case 'wellness':
        return <HeartPulse size={15} aria-hidden="true" />;
      case 'timeline':
        return <History size={15} aria-hidden="true" />;
      case 'family':
        return <Users size={15} aria-hidden="true" />;
      case 'education':
      default:
        return <BookOpen size={15} aria-hidden="true" />;
    }
  };

  const getCategoryLabel = (category: HealthInsight['category']) => {
    if (isHindi) {
      switch (category) {
        case 'change':
          return 'बदलाव';
        case 'pattern':
          return 'पैटर्न';
        case 'report':
          return 'रिपोर्ट';
        case 'wellness':
          return 'कल्याण';
        case 'timeline':
          return 'समयरेखा';
        case 'family':
          return 'परिवार';
        case 'education':
        default:
          return 'शिक्षा';
      }
    }
    switch (category) {
      case 'change':
        return 'Change';
      case 'pattern':
        return 'Pattern';
      case 'report':
        return 'Report';
      case 'wellness':
        return 'Wellness';
      case 'timeline':
        return 'Timeline';
      case 'family':
        return 'Family';
      case 'education':
      default:
        return 'Education';
    }
  };

  return (
    <>
      <article className={`sw-insight-card ${className}`} aria-labelledby={`insight-title-${insight.id}`}>
        {/* Top Header: Category Tag & Relevance Tag & Date */}
        <div className="sw-insight-card__header">
          <div className="sw-insight-card__badges">
            <span className="sw-insight-badge sw-insight-badge--category">
              <span className="sw-insight-badge__icon">{getCategoryIcon(insight.category)}</span>
              <span>{getCategoryLabel(insight.category)}</span>
            </span>

            <span
              className={`sw-insight-badge sw-insight-badge--relevance sw-insight-badge--${insight.relevance}`}
              title={
                insight.relevance === 'review'
                  ? isHindi
                    ? insight.relevanceNoteHi
                    : insight.relevanceNoteEn
                  : undefined
              }
            >
              {isHindi ? insight.relevanceLabelHi : insight.relevanceLabelEn}
            </span>
          </div>

          <div className="sw-insight-card__meta">
            <span className="sw-insight-card__date">
              <Calendar size={13} aria-hidden="true" />
              <span>{insight.date}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 id={`insight-title-${insight.id}`} className="sw-insight-card__title">
          {isHindi ? insight.titleHi : insight.titleEn}
        </h3>

        {/* Observation / Interpretation / Education Badges & Content */}
        <div className="sw-insight-card__content">
          <div className="sw-insight-section sw-insight-section--obs">
            <div className="sw-insight-section__tag">
              <span className="sw-nature-tag sw-nature-tag--observation">
                {isHindi ? 'अवलोकन (OBSERVATION)' : 'OBSERVATION'}
              </span>
            </div>
            <p className="sw-insight-section__text">
              {isHindi ? insight.observationTextHi : insight.observationTextEn}
            </p>
          </div>

          {insight.interpretationTextEn && (
            <div className="sw-insight-section sw-insight-section--int">
              <div className="sw-insight-section__tag">
                <span className="sw-nature-tag sw-nature-tag--interpretation">
                  {isHindi ? 'व्याख्या (INTERPRETATION)' : 'INTERPRETATION'}
                </span>
              </div>
              <p className="sw-insight-section__text">
                {isHindi ? insight.interpretationTextHi : insight.interpretationTextEn}
              </p>
            </div>
          )}

          {insight.educationTextEn && (
            <div className="sw-insight-section sw-insight-section--edu">
              <div className="sw-insight-section__tag">
                <span className="sw-nature-tag sw-nature-tag--education">
                  {isHindi ? 'सामान्य शिक्षा (GENERAL EDUCATION)' : 'GENERAL EDUCATION'}
                </span>
              </div>
              <p className="sw-insight-section__text">
                {isHindi ? insight.educationTextHi : insight.educationTextEn}
              </p>
            </div>
          )}
        </div>

        {/* Data Coverage Indicator */}
        <div className="sw-insight-card__coverage">
          <span className="sw-coverage-badge">
            <Layers size={13} aria-hidden="true" />
            <span>{isHindi ? insight.dataCoverage.labelHi : insight.dataCoverage.labelEn}</span>
          </span>
        </div>

        {/* Traceable Sources */}
        <div className="sw-insight-card__sources">
          <SourceChipList sources={insight.sources} isHindi={isHindi} size="sm" />
        </div>

        {/* Bottom Actions: "Why am I seeing this?" & "Ask SwasthyaAI about this" */}
        <div className="sw-insight-card__actions">
          <button
            type="button"
            className="sw-insight-explain-btn"
            onClick={() => setShowExplanation(true)}
            aria-label={`${isHindi ? 'व्याख्या देखें:' : 'View explanation:'} ${
              isHindi ? insight.titleHi : insight.titleEn
            }`}
          >
            <HelpCircle size={14} aria-hidden="true" />
            <span>{isHindi ? 'मुझे यह क्यों दिखाई दे रहा है?' : 'Why am I seeing this?'}</span>
          </button>

          <ContextualAskButton
            context={{
              sourceType: 'insight',
              sourceTitleEn: insight.titleEn,
              sourceTitleHi: insight.titleHi,
              sourceDate: insight.date,
              snippetEn: insight.summaryEn,
              snippetHi: insight.summaryHi,
              suggestedQuestions: insight.suggestedQuestions,
            }}
            labelEn="Ask SwasthyaAI"
            labelHi="AI से पूछें"
            variant="ghost"
            size="sm"
          />
        </div>

        {/* Clarification Note for "Needs review" */}
        {insight.relevance === 'review' && (
          <div className="sw-insight-card__review-note" role="note">
            <Info size={13} aria-hidden="true" />
            <span>{isHindi ? insight.relevanceNoteHi : insight.relevanceNoteEn}</span>
          </div>
        )}
      </article>

      {/* Modal / Dialog Explanation Panel */}
      <InsightExplanation
        insight={insight}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        isHindi={isHindi}
      />
    </>
  );
};
