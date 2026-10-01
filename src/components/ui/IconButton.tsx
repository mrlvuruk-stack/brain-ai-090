import React from 'react';
import { clsx } from '../../lib/utils';
import './IconButton.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Enforce accessible label for screen readers
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      icon,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        aria-disabled={disabled}
        className={clsx(
          'sw-icon-btn',
          `sw-icon-btn--${variant}`,
          `sw-icon-btn--${size}`,
          className
        )}
        {...props}
      >
        <span className="sw-icon-btn__icon" aria-hidden="true">
          {icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
