import React from 'react';
import type { TimeRangeFilter } from '../../data/intelligenceTypes';
import './TimeRangeSelector.css';

interface TimeRangeSelectorProps {
  selectedRange: TimeRangeFilter;
  onChange: (range: TimeRangeFilter) => void;
  isHindi?: boolean;
  className?: string;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange,
  isHindi = false,
  className = '',
}) => {
  const ranges: Array<{ id: TimeRangeFilter; labelEn: string; labelHi: string; ariaLabelEn: string; ariaLabelHi: string }> = [
    { id: '7d', labelEn: '7 Days', labelHi: '7 दिन', ariaLabelEn: '7 Days Time Range', ariaLabelHi: '7 दिन की समय सीमा' },
    { id: '30d', labelEn: '30 Days', labelHi: '30 दिन', ariaLabelEn: '30 Days Time Range', ariaLabelHi: '30 दिन की समय सीमा' },
    { id: '90d', labelEn: '90 Days', labelHi: '90 दिन', ariaLabelEn: '90 Days Time Range', ariaLabelHi: '90 दिन की समय सीमा' },
    { id: '6m', labelEn: '6 Months', labelHi: '6 महीने', ariaLabelEn: '6 Months Time Range', ariaLabelHi: '6 महीने की समय सीमा' },
  ];

  return (
    <div
      className={`sw-time-range-selector ${className}`}
      role="radiogroup"
      aria-label={isHindi ? 'समय सीमा चुनें' : 'Select Time Range'}
    >
      {ranges.map((r) => {
        const isSelected = selectedRange === r.id;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`sw-time-range-btn ${isSelected ? 'sw-time-range-btn--active' : ''}`}
            onClick={() => onChange(r.id)}
            aria-label={isHindi ? r.ariaLabelHi : r.ariaLabelEn}
          >
            {isHindi ? r.labelHi : r.labelEn}
          </button>
        );
      })}
    </div>
  );
};
