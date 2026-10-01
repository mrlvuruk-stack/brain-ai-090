import React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { clsx } from '../../lib/utils';
import './Link.css';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  to?: string;
  href?: string;
  variant?: 'primary' | 'subtle' | 'inline' | 'nav';
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      to,
      href,
      variant = 'primary',
      external = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isExternal = external || (href && href.startsWith('http'));
    const linkClasses = clsx('sw-link', `sw-link--${variant}`, className);

    if (isExternal && href) {
      return (
        <a
          ref={ref}
          href={href}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    if (to) {
      return (
        <RouterLink ref={ref} to={to} className={linkClasses} {...props}>
          {children}
        </RouterLink>
      );
    }

    return (
      <a ref={ref} href={href || '#'} className={linkClasses} {...props}>
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';
