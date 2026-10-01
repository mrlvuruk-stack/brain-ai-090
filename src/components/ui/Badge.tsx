import React from 'react';
import { clsx } from '../../lib/utils';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'normal'
    | 'warning'
    | 'critical'
    | 'emergency';
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  showDot = false,
  className,
  ...props
}) => {
  return (
    <span
      className={clsx(
        'sw-badge',
        `sw-badge--${variant}`,
        `sw-badge--${size}`,
        className
      )}
      {...props}
    >
      {showDot && <span className="sw-badge__dot" aria-hidden="true" />}
      <span className="sw-badge__label">{children}</span>
    </span>
  );
};
