import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { ZodError } from 'zod';
import vendorRoutes from './routes/vendors';

const app = express();
const PORT = 5174;
const DATA_FILE = path.resolve(__dirname, '../items.json');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/vendors', vendorRoutes);

app.post('/api/items', (req: Request, res: Response) => {
  const item = req.body;
  let items: unknown[] = [];

  if (fs.existsSync(DATA_FILE)) {
    items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as unknown[];
  }

  items.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
  res.status(201).json({ success: true });
});

app.get('/api/items', (_req: Request, res: Response) => {
  let items: unknown[] = [];

  if (fs.existsSync(DATA_FILE)) {
    items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as unknown[];
  }

  res.json(items);
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
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

  if (isPgUniqueViolation(error)) {
    res.status(409).json({
      message: 'Duplicate value violates a unique constraint',
      detail: error.detail,
    });
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

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
