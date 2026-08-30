import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'KarigarAI backend is running' });
});

export default router;
