import React from 'react';
import { clsx } from '../../lib/utils';
import './FocusRing.css';

export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const FocusRing: React.FC<FocusRingProps> = ({
  children,
  as: Component = 'div',
  className,
  ...props
}) => {
  return (
    <Component className={clsx('sw-focus-ring', className)} {...props}>
      {children}
    </Component>
  );
};
