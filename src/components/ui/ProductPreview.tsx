import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FileText,
  Users,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { clsx } from '../../lib/utils';
import { Badge } from './Badge';
import { demoUser, demoLabReports, demoHealthMetrics, demoFamilyMembers } from '../../data/demoData';
import './ProductPreview.css';

export interface ProductPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'compact';
  interactive?: boolean;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  variant = 'full',
  interactive = true,
  className,
  ...props
}) => {
  const primaryReport = demoLabReports[0];
  const bpMetric = demoHealthMetrics[0];
  const glucoseMetric = demoHealthMetrics[1];
  const motherMember = demoFamilyMembers[1];

  return (
    <div
      className={clsx(
        'sw-product-preview',
        `sw-product-preview--${variant}`,
        className
      )}
      role="region"
      aria-label="Composed SwasthyaAI Interface Preview"
      {...props}
    >
      {/* Top Interface Bar */}
      <div className="sw-product-preview__topbar">
        <div className="sw-product-preview__user-pill">
          <div className="sw-product-preview__avatar" aria-hidden="true">
            AS
          </div>
          <div className="sw-product-preview__user-meta">
            <span className="sw-product-preview__name">{demoUser.fullName}</span>
            <span className="sw-product-preview__loc">
              {demoUser.city}, {demoUser.state} · Age {demoUser.age}
            </span>
          </div>
        </div>

        <div className="sw-product-preview__status-group">
          <Badge variant="secondary" size="sm">
            Prototype · Demo Data
          </Badge>
          <div className="sw-product-preview__secure-pill">
            <ShieldCheck size={14} color="var(--color-primary)" />
            <span>Simulated Consent Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 columns on desktop */}
      <div className="sw-product-preview__grid">
        {/* Left Column: Recent Illustrative Lab Report Understanding */}
        <div className="sw-product-preview__panel sw-product-preview__panel--report">
          <div className="sw-product-preview__panel-header">
            <div className="sw-product-preview__panel-title-group">
              <FileText size={18} className="sw-product-preview__panel-icon" />
              <div>
                <span className="text-label">LATEST ILLUSTRATIVE LAB REVIEW</span>
                <h4 className="sw-product-preview__panel-title">{primaryReport.title}</h4>
              </div>
            </div>
            <Badge variant="warning" size="sm" showDot>
              Attention Needed
            </Badge>
          </div>

          <div className="sw-product-preview__facility">
            <Calendar size={13} />
            <span>{primaryReport.date} · {primaryReport.facilityName}</span>
          </div>

          {/* Key Findings Table */}
          <div className="sw-product-preview__table">
            <div className="sw-product-preview__table-row sw-product-preview__table-row--head">
              <span>Biomarker</span>
              <span>Observed</span>
              <span className="text-right">Reference</span>
            </div>
            {primaryReport.keyFindings.slice(0, 3).map((item) => (
              <div key={item.parameter} className="sw-product-preview__table-row">
                <span className="sw-product-preview__table-param">{item.parameter}</span>
                <span
                  className={clsx(
                    'sw-product-preview__table-val',
                    item.status === 'warning' && 'sw-product-preview__table-val--warning',
                    item.status === 'normal' && 'sw-product-preview__table-val--normal'
                  )}
                >
                  {item.value}
                </span>
                <span className="sw-product-preview__table-range text-right">{item.standardRange}</span>
              </div>
            ))}
          </div>

          {/* Clinical Plain-Language Translation */}
          <div className="sw-product-preview__ai-card">
            <span className="sw-product-preview__ai-kicker">EDUCATIONAL CLINICAL TRANSLATION</span>
            <p className="sw-product-preview__ai-copy">
              Fasting glucose is mildly elevated compared to reference thresholds. Recommended action: maintain routine morning walking and consult a physician for tailored nutrition guidance.
            </p>
          </div>

          {interactive && (
            <div className="sw-product-preview__panel-footer">
              <RouterLink to="/prototype/report-analysis" className="sw-product-preview__link">
                <span>View Full Lab Breakdown</span>
                <ArrowUpRight size={14} />
              </RouterLink>
            </div>
          )}
        </div>

        {/* Right Column: Vitals Stream & Family Circle */}
        <div className="sw-product-preview__right-col">
          {/* Vitals Summary Card */}
          <div className="sw-product-preview__panel sw-product-preview__panel--vitals">
            <div className="sw-product-preview__panel-header">
              <div className="sw-product-preview__panel-title-group">
                <Activity size={18} className="sw-product-preview__panel-icon" />
                <div>
                  <span className="text-label">DAILY PHYSIOLOGICAL TRACKER</span>
                  <h4 className="sw-product-preview__panel-title">Current Health Metrics</h4>
                </div>
              </div>
              <Badge variant="normal" size="sm">
                Stable
              </Badge>
            </div>

            <div className="sw-product-preview__metrics-row">
              {/* BP */}
              <div className="sw-product-preview__metric-item">
                <span className="sw-product-preview__metric-name">{bpMetric.label}</span>
                <div className="sw-product-preview__metric-value-wrap">
                  <span className="text-metric">{bpMetric.value}</span>
                  <span className="text-metric-unit">{bpMetric.unit}</span>
                </div>
                <div className="sw-product-preview__metric-sub">
                  <CheckCircle2 size={12} color="var(--color-health-normal)" />
                  <span>Normal resting range</span>
                </div>
              </div>

              {/* Glucose */}
              <div className="sw-product-preview__metric-item">
                <span className="sw-product-preview__metric-name">{glucoseMetric.label}</span>
                <div className="sw-product-preview__metric-value-wrap">
                  <span className="text-metric" style={{ color: 'var(--color-health-warning)' }}>
                    {glucoseMetric.value}
                  </span>
                  <span className="text-metric-unit">{glucoseMetric.unit}</span>
                </div>
                <div className="sw-product-preview__metric-sub">
                  <span className="sw-product-preview__improving-pill">↓ 6 mg/dL vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Family Circle Care Card */}
          <div className="sw-product-preview__panel sw-product-preview__panel--family">
            <div className="sw-product-preview__panel-header">
              <div className="sw-product-preview__panel-title-group">
                <Users size={18} className="sw-product-preview__panel-icon" />
                <div>
                  <span className="text-label">CONNECTED FAMILY CIRCLE</span>
                  <h4 className="sw-product-preview__panel-title">Indore &amp; Ujjain Family</h4>
                </div>
              </div>
              <span className="sw-product-preview__member-count">
                {demoFamilyMembers.length} Members
              </span>
            </div>

            <div className="sw-product-preview__family-row">
              <div className="sw-product-preview__family-avatar" aria-hidden="true">
                {motherMember.avatarInitials}
              </div>
              <div className="sw-product-preview__family-info">
                <div className="sw-product-preview__family-name-line">
                  <strong>{motherMember.name}</strong>
                  <span className="sw-product-preview__rel">{motherMember.relationship} (Age {motherMember.age})</span>
                </div>
                <span className="sw-product-preview__family-status">
                  BP logged today: 128/82 mmHg · Vitals shared with consent
                </span>
              </div>
            </div>

            {interactive && (
              <div className="sw-product-preview__panel-footer">
                <RouterLink to="/prototype/family" className="sw-product-preview__link">
                  <span>Open Family Care Circle</span>
                  <ArrowUpRight size={14} />
                </RouterLink>
              </div>
            )}
          </div>

          {/* Emergency Readiness Ribbon */}
          <div className="sw-product-preview__emergency-ribbon">
            <div className="sw-product-preview__emergency-left">
              <AlertTriangle size={16} color="var(--color-emergency)" />
              <span>Emergency 108 Card Active</span>
            </div>
            {interactive && (
              <RouterLink to="/prototype/emergency" className="sw-product-preview__emergency-link">
                View Medical ID →
              </RouterLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
