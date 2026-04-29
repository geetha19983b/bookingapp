import { PrismaClient } from '@prisma/client';
import config from './config';
import logger from './utils/logger';

// Initialize Prisma Client with environment-appropriate logging
const prisma = new PrismaClient({
  log: config.isDevelopment
    ? [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ]
    : [
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
});

// Log queries with execution time (development only)
if (config.isDevelopment) {
  prisma.$on('query', (e) => {
    logger.debug('Database query executed', {
      query: e.query,
      duration: `${e.duration}ms`,
      // Note: params can contain sensitive data, only log in development
      params: e.params,
    });
  });
}

// Log queries with execution time (development only)
if (config.isDevelopment) {
  prisma.$on('query', (e) => {
    logger.debug('Database query executed', {
      query: e.query,
      duration: `${e.duration}ms`,
      // Note: params can contain sensitive data, only log in development
      params: e.params,
    });
  });
}

export default prisma;

// Legacy exports for backward compatibility
export const transaction = async <T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> => {
  return prisma.$transaction(async (tx) => {
    return callback(tx as PrismaClient);
  });
};
