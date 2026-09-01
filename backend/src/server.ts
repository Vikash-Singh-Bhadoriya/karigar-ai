import express from 'express';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { isDatabaseReady } from './config/database';
import healthRoutes from './routes/health.routes';
import productRoutes from './routes/product.routes';
import aiRoutes from './routes/ai.routes';
import speechRoutes from './routes/speech.routes';
import catalogRoutes from './routes/catalog.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded product images as static files
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use(healthRoutes);
app.use(productRoutes);
app.use(aiRoutes);
app.use(speechRoutes);
app.use(catalogRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(config.port, async () => {
  console.log(`KarigarAI backend running on http://localhost:${config.port}`);

  // Check database connectivity
  if (config.databaseUrl) {
    const dbOk = await isDatabaseReady();
    console.log(dbOk ? '✅ Database connected' : '⚠️ Database not reachable');
  } else {
    console.log('⚠️ DATABASE_URL not set — catalog/orders endpoints will fail');
  }
});
