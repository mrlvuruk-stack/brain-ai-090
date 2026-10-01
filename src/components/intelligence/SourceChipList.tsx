import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, History, HeartPulse, Target, Users } from 'lucide-react';
import type { InsightSource } from '../../data/intelligenceTypes';
import './SourceChipList.css';

interface SourceChipListProps {
  sources: InsightSource[];
  isHindi?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const SourceChipList: React.FC<SourceChipListProps> = ({
  sources,
  isHindi = false,
  className = '',
  size = 'md',
}) => {
  const navigate = useNavigate();

  if (!sources || sources.length === 0) return null;

  const getSourceIcon = (type: InsightSource['type']) => {
    switch (type) {
      case 'report':
        return <FileText size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      case 'metric':
        return <Activity size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      case 'journey':
        return <History size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      case 'wellness':
        return <HeartPulse size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      case 'goal':
        return <Target size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      case 'family':
        return <Users size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
      default:
        return <FileText size={size === 'sm' ? 12 : 14} aria-hidden="true" />;
    }
  };

  const getSourceTypeLabel = (type: InsightSource['type']) => {
    if (isHindi) {
      switch (type) {
        case 'report':
          return 'रिपोर्ट';
        case 'metric':
          return 'माप';
        case 'journey':
          return 'समयरेखा';
        case 'wellness':
          return 'कल्याण';
        case 'goal':
          return 'लक्ष्य';
        case 'family':
          return 'परिवार';
        default:
          return 'स्रोत';
      }
    }
    switch (type) {
      case 'report':
        return 'Report';
      case 'metric':
        return 'Metric';
      case 'journey':
        return 'Timeline';
      case 'wellness':
        return 'Wellness';
      case 'goal':
        return 'Goal';
      case 'family':
        return 'Family';
      default:
        return 'Source';
    }
  };

  return (
    <div className={`sw-source-chips ${size === 'sm' ? 'sw-source-chips--sm' : ''} ${className}`}>
      <span className="sw-source-chips__lead">
        {isHindi ? 'स्रोत:' : 'Sources:'}
      </span>
      <div className="sw-source-chips__list">
        {sources.map((source) => (
          <button
            key={source.id}
            type="button"
            className="sw-source-chip"
            onClick={() => navigate(source.route)}
            title={`${source.titleEn} (${source.date})`}
            aria-label={`${isHindi ? 'स्रोत खोलें:' : 'Open source:'} ${
              isHindi ? source.titleHi : source.titleEn
            }`}
          >
            <span className="sw-source-chip__icon">{getSourceIcon(source.type)}</span>
            <span className="sw-source-chip__type">{getSourceTypeLabel(source.type)}</span>
            <span className="sw-source-chip__divider">·</span>
            <span className="sw-source-chip__date">{source.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
