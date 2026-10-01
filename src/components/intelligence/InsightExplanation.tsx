import React, { useEffect, useRef } from 'react';
import { X, HelpCircle, AlertCircle, Calendar, FileText, Database, Info } from 'lucide-react';
import type { HealthInsight } from '../../data/intelligenceTypes';
import { SourceChipList } from './SourceChipList';
import { ContextualAskButton } from './ContextualAskButton';
import './InsightExplanation.css';

interface InsightExplanationProps {
  insight: HealthInsight | null;
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
}

export const InsightExplanation: React.FC<InsightExplanationProps> = ({
  insight,
  isOpen,
  onClose,
  isHindi = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !insight) return null;

  const { explanation } = insight;

  return (
    <div
      className="sw-explain-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="sw-explain-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explain-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sw-explain-dialog__header">
          <div className="sw-explain-dialog__header-left">
            <div className="sw-explain-badge" aria-hidden="true">
              <HelpCircle size={18} />
            </div>
            <div>
              <span className="sw-explain-dialog__pretitle">
                {isHindi ? 'पारदर्शी व्याख्या' : 'Explainable Intelligence'}
              </span>
              <h2 id="explain-title" className="sw-explain-dialog__title">
                {isHindi ? 'मुझे यह अवलोकन क्यों दिखाई दे रहा है?' : 'Why am I seeing this?'}
              </h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="sw-explain-dialog__close"
            onClick={onClose}
            aria-label={isHindi ? 'व्याख्या बंद करें' : 'Close explanation'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Insight Title Reference */}
        <div className="sw-explain-dialog__ref">
          <span className="sw-explain-dialog__ref-label">
            {isHindi ? 'संबंधित अवलोकन:' : 'Referenced Insight:'}
          </span>
          <p className="sw-explain-dialog__ref-title">
            {isHindi ? insight.titleHi : insight.titleEn}
          </p>
        </div>

        {/* 5 Structured Explainability Factors */}
        <div className="sw-explain-dialog__content">
          {/* 1. OBSERVATION */}
          <div className="sw-explain-factor">
            <div className="sw-explain-factor__header">
              <span className="sw-explain-factor__icon" aria-hidden="true">
                <FileText size={16} />
              </span>
              <h3 className="sw-explain-factor__title">
                {isHindi ? 'अवलोकन (OBSERVATION)' : 'OBSERVATION'}
              </h3>
              <span className="sw-explain-factor__subtitle">
                {isHindi ? 'क्या बदला है?' : 'What changed?'}
              </span>
            </div>
            <p className="sw-explain-factor__body">
              {isHindi ? explanation.observationHi : explanation.observationEn}
            </p>
          </div>

          {/* 2. SOURCES */}
          <div className="sw-explain-factor">
            <div className="sw-explain-factor__header">
              <span className="sw-explain-factor__icon" aria-hidden="true">
                <Database size={16} />
              </span>
              <h3 className="sw-explain-factor__title">
                {isHindi ? 'स्रोत (SOURCES)' : 'SOURCES'}
              </h3>
              <span className="sw-explain-factor__subtitle">
                {isHindi ? 'कौन से डेमो रिकॉर्ड्स इसका समर्थन करते हैं?' : 'Which demo records support this?'}
              </span>
            </div>
            <p className="sw-explain-factor__body">
              {isHindi ? explanation.sourcesDescriptionHi : explanation.sourcesDescriptionEn}
            </p>
            <div className="sw-explain-factor__source-list">
              <SourceChipList sources={insight.sources} isHindi={isHindi} size="sm" />
            </div>
          </div>

          {/* 3. TIME WINDOW */}
          <div className="sw-explain-factor">
            <div className="sw-explain-factor__header">
              <span className="sw-explain-factor__icon" aria-hidden="true">
                <Calendar size={16} />
              </span>
              <h3 className="sw-explain-factor__title">
                {isHindi ? 'समय सीमा (TIME WINDOW)' : 'TIME WINDOW'}
              </h3>
              <span className="sw-explain-factor__subtitle">
                {isHindi ? 'किन तिथियों पर विचार किया गया?' : 'Which dates were considered?'}
              </span>
            </div>
            <p className="sw-explain-factor__body">
              {isHindi ? explanation.timeWindowHi : explanation.timeWindowEn}
            </p>
          </div>

          {/* 4. CONTEXT */}
          <div className="sw-explain-factor">
            <div className="sw-explain-factor__header">
              <span className="sw-explain-factor__icon" aria-hidden="true">
                <Info size={16} />
              </span>
              <h3 className="sw-explain-factor__title">
                {isHindi ? 'संदर्भ (CONTEXT)' : 'CONTEXT'}
              </h3>
              <span className="sw-explain-factor__subtitle">
                {isHindi ? 'कौन सी संबंधित जानकारी जांची गई?' : 'What related information was considered?'}
              </span>
            </div>
            <p className="sw-explain-factor__body">
              {isHindi ? explanation.contextHi : explanation.contextEn}
            </p>
          </div>

          {/* 5. LIMITATIONS */}
          <div className="sw-explain-factor sw-explain-factor--limitations">
            <div className="sw-explain-factor__header">
              <span className="sw-explain-factor__icon" aria-hidden="true">
                <AlertCircle size={16} />
              </span>
              <h3 className="sw-explain-factor__title">
                {isHindi ? 'सीमाएं (LIMITATIONS)' : 'LIMITATIONS'}
              </h3>
              <span className="sw-explain-factor__subtitle">
                {isHindi ? 'कौन सी जानकारी उपलब्ध नहीं थी?' : 'What information was NOT available?'}
              </span>
            </div>
            <p className="sw-explain-factor__body">
              {isHindi ? explanation.limitationsHi : explanation.limitationsEn}
            </p>
          </div>
        </div>

        {/* Footer with Contextual Assistant Button and Close */}
        <div className="sw-explain-dialog__footer">
          <div className="sw-explain-dialog__footer-actions">
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
              labelEn="Ask Assistant about this explanation"
              labelHi="सहायक से इस व्याख्या पर पूछें"
              variant="subtle"
            />
          </div>
          <button
            type="button"
            className="sw-explain-dialog__dismiss-btn"
            onClick={onClose}
          >
            {isHindi ? 'बंद करें' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
