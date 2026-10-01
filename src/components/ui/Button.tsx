import React from 'react';
import { clsx } from '../../lib/utils';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
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
        disabled={disabled}
        aria-disabled={disabled}
        className={clsx(
          'sw-btn',
          `sw-btn--${variant}`,
          `sw-btn--${size}`,
          fullWidth && 'sw-btn--full',
          className
        )}
        {...props}
      >
        {leftIcon && <span className="sw-btn__icon sw-btn__icon--left" aria-hidden="true">{leftIcon}</span>}
        <span className="sw-btn__text">{children}</span>
        {rightIcon && <span className="sw-btn__icon sw-btn__icon--right" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
