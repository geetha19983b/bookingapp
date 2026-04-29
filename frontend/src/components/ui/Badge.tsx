import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.scss';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = ({ variant = 'primary', size = 'md', dot = false, children, className, ...props }: BadgeProps) => {
  return (
    <span className={clsx(styles.badge, styles[variant], styles[size], dot && styles.dot, className)} {...props}>
      {children}
    </span>
  );
};
