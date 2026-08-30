import { Router } from 'express';
import upload from '../middleware/upload.middleware';
import { analyzeProduct, productFollowUp } from '../controllers/product.controller';

const router = Router();

router.post('/api/products/analyze', upload.single('image'), analyzeProduct);
router.post('/api/products/follow-up', productFollowUp);

export default router;
