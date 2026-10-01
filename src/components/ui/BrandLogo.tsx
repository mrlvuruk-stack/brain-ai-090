import React from 'react';
import { clsx } from '../../lib/utils';
import './BrandLogo.css';

/**
 * BRAND IDENTITY NOTE:
 * TODO: Final SwasthyaAI brand mark pending.
 * The current geometric medical cross-and-amber node is a restrained abstraction
 * designed as a temporary placeholder that can be seamlessly swapped for the
 * final brand mark asset without disrupting layouts or typography.
 */

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  inverted = false,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'sw-brand-logo',
        `sw-brand-logo--${size}`,
        inverted && 'sw-brand-logo--inverted',
        className
      )}
      {...props}
    >
      {/* Abstraction mark — cleanly replaceable */}
      <svg
        className="sw-brand-logo__mark"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          width="32"
          height="32"
          rx="7"
          fill={inverted ? 'var(--color-surface)' : 'var(--color-primary)'}
        />
        <path
          d="M16 8.5V23.5M8.5 16H23.5"
          stroke={inverted ? 'var(--color-primary)' : 'var(--color-surface)'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="21.5"
          cy="10.5"
          r="2.25"
          fill="var(--color-secondary)"
        />
      </svg>

      <div className="sw-brand-logo__text-group">
        <span className="sw-brand-logo__title">
          Swasthya<span className="sw-brand-logo__ai">AI</span>
        </span>
        {showSubtitle && (
          <span className="sw-brand-logo__subtitle">
            <span className="sw-devanagari">स्वास्थ्य एआई</span> · Healthcare Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
