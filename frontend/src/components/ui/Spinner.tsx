import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.scss';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
}

export const Spinner = ({ size = 'md', variant = 'primary', className, ...props }: SpinnerProps) => {
  return (
    <div className={clsx(styles.spinner, styles[size], styles[variant], className)} {...props}>
      <svg viewBox="0 0 50 50" className={styles.svg}>
        <circle className={styles.circle} cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
    </div>
  );
};
