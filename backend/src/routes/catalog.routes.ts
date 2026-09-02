import { Router } from 'express';
import multer from 'multer';
import {
  listProducts,
  getProduct,
  publishProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  placeOrder,
  listOrders,
} from '../controllers/catalog.controller';

const router = Router();

// Marketplace images are uploaded to Supabase Storage, so hold the buffer in
// memory instead of spooling to local disk — same pattern as the speech route.
const catalogUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/* Product catalog */
router.get('/api/catalog', listProducts);
router.get('/api/catalog/categories', getCategories);
router.get('/api/catalog/:id', getProduct);
router.post('/api/catalog', catalogUpload.single('image'), publishProduct);
router.put('/api/catalog/:id', updateProduct);
router.delete('/api/catalog/:id', deleteProduct);

/* Orders */
router.post('/api/orders', placeOrder);
router.get('/api/orders', listOrders);

export default router;
