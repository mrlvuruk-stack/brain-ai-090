import React from 'react';
import { clsx } from '../../lib/utils';
import './Container.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  as: Component = 'div',
  className,
  ...props
}) => {
  return (
    <Component className={clsx('sw-container', `sw-container--${size}`, className)} {...props}>
      {children}
    </Component>
  );
};
