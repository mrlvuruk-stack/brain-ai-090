import React from 'react';
import { clsx } from '../../lib/utils';
import './Typography.css';

// Heading
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  size,
  as,
  children,
  className,
  ...props
}) => {
  const Component = as || (`h${level}` as const);
  const visualSize = size || `h${level}`;

  return (
    <Component
      className={clsx('sw-heading', `sw-heading--${visualSize}`, className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Text
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'secondary' | 'caption' | 'lead' | 'meta';
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as: Component = 'p',
  children,
  className,
  ...props
}) => {
  return (
    <Component
      className={clsx('sw-text', `sw-text--${variant}`, className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Devanagari text for Hindi content
export interface DevanagariTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export const DevanagariText: React.FC<DevanagariTextProps> = ({
  as: Component = 'span',
  children,
  className,
  lang = 'hi',
  ...props
}) => {
  return (
    <Component
      lang={lang}
      className={clsx('sw-devanagari', className)}
      {...props}
    >
      {children}
    </Component>
  );
};
