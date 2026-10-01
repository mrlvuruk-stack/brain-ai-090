import React from 'react';
import { clsx } from '../../lib/utils';
import './FeatureList.css';

export interface FeatureListItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface FeatureListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FeatureListItem[];
  columns?: 1 | 2 | 3;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  items,
  columns = 2,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'sw-feature-list',
        `sw-feature-list--cols-${columns}`,
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div key={item.id} className="sw-feature-list__item">
          {item.icon && (
            <div className="sw-feature-list__icon" aria-hidden="true">
              {item.icon}
            </div>
          )}
          <div className="sw-feature-list__body">
            <div className="sw-feature-list__title-row">
              <h4 className="sw-feature-list__title">{item.title}</h4>
              {item.badge && (
                <span className="sw-feature-list__badge">{item.badge}</span>
              )}
            </div>
            {item.category && (
              <span className="text-label sw-feature-list__cat">{item.category}</span>
            )}
            <p className="sw-feature-list__desc">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
