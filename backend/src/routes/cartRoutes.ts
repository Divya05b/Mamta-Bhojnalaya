import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { addToCartSchema, updateCartItemSchema } from '../schemas/cartSchema';

const router = express.Router();

// Protected routes
router.get('/', authenticateToken, getCart);
router.post(
  '/add',
  authenticateToken,
  validateRequest(addToCartSchema),
  addToCart
);
router.put(
  '/items/:itemId',
  authenticateToken,
  validateRequest(updateCartItemSchema),
  updateCartItem
);
router.delete('/items/:itemId', authenticateToken, removeFromCart);
router.delete('/clear', authenticateToken, clearCart);

export default router; 