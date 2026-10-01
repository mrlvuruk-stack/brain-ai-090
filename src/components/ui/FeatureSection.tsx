import React from 'react';
import { clsx } from '../../lib/utils';
import { Badge, type BadgeProps } from './Badge';
import { Heading } from './Typography';
import './FeatureSection.css';

export interface FeatureSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  kicker?: string;
  badgeText?: string;
  badgeVariant?: BadgeProps['variant'];
  title: React.ReactNode;
  description: React.ReactNode;
  supportingPoints?: Array<{
    title: string;
    text: string;
    icon?: React.ReactNode;
  }>;
  visualElement: React.ReactNode;
  layout?: 'content-left' | 'content-right';
  actionElement?: React.ReactNode;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  kicker,
  badgeText,
  badgeVariant = 'secondary',
  title,
  description,
  supportingPoints,
  visualElement,
  layout = 'content-left',
  actionElement,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'sw-feature-section',
        `sw-feature-section--${layout}`,
        className
      )}
      {...props}
    >
      <div className="sw-feature-section__content">
        <div className="sw-feature-section__tags">
          {badgeText && <Badge variant={badgeVariant} size="sm">{badgeText}</Badge>}
          {kicker && <span className="text-label">{kicker}</span>}
        </div>

        <Heading level={2} size="h2" className="sw-feature-section__title">
          {title}
        </Heading>

        <p className="sw-feature-section__desc">
          {description}
        </p>

        {supportingPoints && supportingPoints.length > 0 && (
          <div className="sw-feature-section__points">
            {supportingPoints.map((point) => (
              <div key={point.title} className="sw-feature-section__point">
                {point.icon && (
                  <div className="sw-feature-section__point-icon" aria-hidden="true">
                    {point.icon}
                  </div>
                )}
                <div>
                  <h4 className="sw-feature-section__point-title">{point.title}</h4>
                  <p className="sw-feature-section__point-text">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {actionElement && (
          <div className="sw-feature-section__actions">
            {actionElement}
          </div>
        )}
      </div>

      <div className="sw-feature-section__visual">
        {visualElement}
      </div>
    </div>
  );
};
