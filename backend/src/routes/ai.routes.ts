import { Router } from 'express';
import { generateListing } from '../controllers/ai.controller';

const router = Router();

router.post('/api/ai/generate-listing', generateListing);

export default router;
