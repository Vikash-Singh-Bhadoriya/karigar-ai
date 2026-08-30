import { Router } from 'express';
import upload from '../middleware/upload.middleware';
import { analyzeProduct } from '../controllers/product.controller';

const router = Router();

router.post('/api/products/analyze', upload.single('image'), analyzeProduct);

export default router;
