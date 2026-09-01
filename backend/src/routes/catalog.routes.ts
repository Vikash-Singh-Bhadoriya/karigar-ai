import { Router } from 'express';
import upload from '../middleware/upload.middleware';
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

/* Product catalog */
router.get('/api/catalog', listProducts);
router.get('/api/catalog/categories', getCategories);
router.get('/api/catalog/:id', getProduct);
router.post('/api/catalog', upload.single('image'), publishProduct);
router.put('/api/catalog/:id', updateProduct);
router.delete('/api/catalog/:id', deleteProduct);

/* Orders */
router.post('/api/orders', placeOrder);
router.get('/api/orders', listOrders);

export default router;
