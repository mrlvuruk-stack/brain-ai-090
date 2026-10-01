import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`sw-breadcrumbs ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.to && !isLast ? (
              <RouterLink
                to={item.to}
                style={{
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)')}
              >
                {item.label}
              </RouterLink>
            ) : (
              <span
                style={{
                  color: isLast ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                  fontWeight: isLast ? 600 : 400,
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={12} aria-hidden="true" style={{ opacity: 0.6 }} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
