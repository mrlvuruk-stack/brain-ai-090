import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { clsx } from '../../lib/utils';
import './MedicalDisclaimer.css';

export interface MedicalDisclaimerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'banner' | 'card' | 'inline';
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = 'banner',
  className,
  ...props
}) => {
  if (variant === 'inline') {
    return (
      <div className={clsx('sw-disclaimer-inline', className)} role="note" {...props}>
        <AlertCircle size={14} className="sw-disclaimer-inline__icon" aria-hidden="true" />
        <span>
          <strong>Prototype Data & Educational Information:</strong> Illustrative result only. Discuss with a qualified healthcare professional.
        </span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('sw-disclaimer-card', className)} role="region" aria-label="Medical safety boundary" {...props}>
        <div className="sw-disclaimer-card__header">
          <ShieldAlert size={20} className="sw-disclaimer-card__icon" aria-hidden="true" />
          <h4 className="sw-disclaimer-card__title">Clinical Prototype & Safety Notice</h4>
        </div>
        <p className="sw-disclaimer-card__text">
          SwasthyaAI is an interactive software demonstration. All patient data, lab analyses, and health assessments shown are fictional prototype simulations for educational and product demonstration purposes only.
        </p>
        <p className="sw-disclaimer-card__subtext">
          This system does not provide medical diagnosis, clinical treatment plans, or emergency triage. Always consult a qualified healthcare professional or registered medical practitioner for health concerns.
        </p>
      </div>
    );
  }

  return (
    <aside className={clsx('sw-disclaimer-banner', className)} role="note" aria-label="Prototype demonstration notice" {...props}>
      <div className="sw-disclaimer-banner__content">
        <span className="sw-disclaimer-banner__pill">Prototype Notice</span>
        <span className="sw-disclaimer-banner__text">
          Illustrative Simulation for Pilot Context (Indore & Ujjain). Educational information only — discuss all medical matters with a qualified physician.
        </span>
      </div>
    </aside>
  );
};
