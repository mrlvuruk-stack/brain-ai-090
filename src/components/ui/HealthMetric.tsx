import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Badge } from './Badge';
import './HealthMetric.css';

export interface HealthMetricProps {
  label: string;
  labelHi?: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  trend?: 'stable' | 'improving' | 'declining';
  contextNote?: string;
  icon?: React.ReactNode;
  language?: 'en' | 'hi';
  onClick?: () => void;
  className?: string;
}

export const HealthMetric: React.FC<HealthMetricProps> = ({
  label,
  labelHi,
  value,
  unit,
  status,
  timestamp,
  trend,
  contextNote,
  icon,
  language = 'en',
  onClick,
  className = '',
}) => {
  const displayLabel = language === 'hi' && labelHi ? labelHi : label;

  const getStatusBadge = () => {
    switch (status) {
      case 'normal':
        return (
          <Badge variant="normal" size="sm">
            {language === 'hi' ? 'सामान्य' : 'Normal'}
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="warning" size="sm">
            {language === 'hi' ? 'ध्यान दें' : 'Attention'}
          </Badge>
        );
      case 'critical':
        return (
          <Badge variant="emergency" size="sm">
            {language === 'hi' ? 'जाँच आवश्यक' : 'Review'}
          </Badge>
        );
    }
  };

  const renderTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'improving':
        return (
          <span className="sw-metric-trend sw-metric-trend--improving" title="Trend: Improving">
            <TrendingDown size={14} aria-hidden="true" />
            <span>{language === 'hi' ? 'सुधार' : 'Improving'}</span>
          </span>
        );
      case 'declining':
        return (
          <span className="sw-metric-trend sw-metric-trend--declining" title="Trend: Attention">
            <TrendingUp size={14} aria-hidden="true" />
            <span>{language === 'hi' ? 'बढ़ाव' : 'Elevated'}</span>
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="sw-metric-trend sw-metric-trend--stable" title="Trend: Stable">
            <Minus size={14} aria-hidden="true" />
            <span>{language === 'hi' ? 'स्थिर' : 'Stable'}</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`sw-health-metric-card sw-health-metric-card--${status} ${
        onClick ? 'sw-health-metric-card--interactive' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="sw-health-metric-header">
        <div className="sw-health-metric-label-group">
          {icon ? (
            <span className="sw-health-metric-icon" aria-hidden="true">
              {icon}
            </span>
          ) : (
            <Activity size={16} className="sw-health-metric-icon" aria-hidden="true" />
          )}
          <span className="sw-health-metric-title">{displayLabel}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="sw-health-metric-body">
        <div className="sw-health-metric-value-wrap">
          <span className="sw-health-metric-value">{value}</span>
          <span className="sw-health-metric-unit">{unit}</span>
        </div>
        {renderTrendIcon()}
      </div>

      <div className="sw-health-metric-footer">
        <span className="sw-health-metric-time">{timestamp}</span>
        {contextNote && <span className="sw-health-metric-note">{contextNote}</span>}
      </div>
    </div>
  );
};
