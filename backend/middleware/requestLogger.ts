import morgan from 'morgan';
import { morganStream } from '../utils/logger';
import config from '../config';

// Create different morgan formats for different environments
export const requestLogger = config.isProduction
  ? morgan('combined', { stream: morganStream })
  : morgan('dev', { stream: morganStream });
