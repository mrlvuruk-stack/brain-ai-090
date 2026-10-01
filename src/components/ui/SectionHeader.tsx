import React from 'react';
import { clsx } from '../../lib/utils';
import { Badge, type BadgeProps } from './Badge';
import { Heading } from './Typography';
import './SectionHeader.css';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badgeText?: string;
  badgeVariant?: BadgeProps['variant'];
  kicker?: string;
  title: React.ReactNode;
  titleLevel?: 1 | 2 | 3;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = 'secondary',
  kicker,
  title,
  titleLevel = 2,
  subtitle,
  align = 'center',
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'sw-section-header',
        `sw-section-header--${align}`,
        className
      )}
      {...props}
    >
      <div className="sw-section-header__tags">
        {badgeText && (
          <Badge variant={badgeVariant} size="sm">
            {badgeText}
          </Badge>
        )}
        {kicker && <span className="text-label">{kicker}</span>}
      </div>

      <Heading
        level={titleLevel}
        size={titleLevel === 1 ? 'h1' : titleLevel === 2 ? 'h2' : 'h3'}
        className="sw-section-header__title"
      >
        {title}
      </Heading>

      {subtitle && (
        <p className="sw-section-header__subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
};
