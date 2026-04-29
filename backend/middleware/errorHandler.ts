import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

// Prisma error types
interface PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: {
    target?: unknown;
  };
}

interface PgUniqueViolation {
  code: string;
  detail?: string;
}

const isPgUniqueViolation = (value: unknown): value is PgUniqueViolation => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const maybeError = value as Record<string, unknown>;
  return maybeError.code === '23505';
};

const isPrismaError = (value: unknown): value is PrismaClientKnownRequestError => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const maybeError = value as Record<string, unknown>;
  return typeof maybeError.code === 'string' && maybeError.code.startsWith('P');
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error details
  logger.error('Request error', {
    method: req.method,
    url: req.url,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    });
    return;
  }

  // Prisma errors
  if (isPrismaError(error)) {
    if (error.code === 'P2002') {
      res.status(409).json({
        message: 'Duplicate value violates a unique constraint',
        detail: error.meta?.target,
      });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({
        message: 'Record not found',
      });
      return;
    }
  }

  // Legacy PostgreSQL unique violation handler
  if (isPgUniqueViolation(error)) {
    res.status(409).json({
      message: 'Duplicate value violates a unique constraint',
      detail: error.detail,
    });
    return;
  }

  // Generic error response
  res.status(500).json({
    message: 'Internal server error',
  });
};
