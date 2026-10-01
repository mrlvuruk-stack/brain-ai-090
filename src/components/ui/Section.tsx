import React from 'react';
import { clsx } from '../../lib/utils';
import './Section.css';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'subtle' | 'surface' | 'primary-muted';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  spacing = 'lg',
  as: Component = 'section',
  className,
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'sw-section',
        `sw-section--${variant}`,
        `sw-section--spacing-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
