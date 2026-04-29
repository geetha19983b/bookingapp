import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ variant = 'default', padding = 'md', children, className, ...props }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[variant], styles[`padding-${padding}`], className)} {...props}>
      {children}
    </div>
  );
};
