import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRoutes from './routes/health.routes';
import productRoutes from './routes/product.routes';
import aiRoutes from './routes/ai.routes';
import speechRoutes from './routes/speech.routes';
import catalogRoutes from './routes/catalog.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(productRoutes);
app.use(aiRoutes);
app.use(speechRoutes);

// Marketplace catalog (catalog.routes.ts already defines full /api/catalog… paths)
app.use(catalogRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(config.port, () => {
  console.log(`KarigarAI backend running on http://localhost:${config.port}`);
});
