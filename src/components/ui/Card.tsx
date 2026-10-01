import React from 'react';
import { clsx } from '../../lib/utils';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
  className,
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'sw-card',
        `sw-card--${variant}`,
        `sw-card--pad-${padding}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
