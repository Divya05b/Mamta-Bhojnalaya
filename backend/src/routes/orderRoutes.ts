import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import {
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getRecentOrders,
  getDashboardStats,
  getSalesData,
  getCategorySales,
  cancelOrder,
  deleteOrder,
  getOrderById,
} from '../controllers/orderController';
import { validateRequest } from '../middleware/validateRequest';
import { updateOrderStatusSchema } from '../schemas/orderSchema';

const router = Router();

// Protected routes
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);
router.patch('/:id/cancel', authenticateToken, validateRequest(updateOrderStatusSchema), updateOrderStatus);

// Admin routes
router.get('/all', authenticateToken, isAdmin, getAllOrders);
router.patch('/:id/status', authenticateToken, isAdmin, validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteOrder);
router.patch('/:id/cancel', authenticateToken, isAdmin, validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.get('/recent', authenticateToken, isAdmin, getRecentOrders);
router.get('/stats', authenticateToken, isAdmin, getDashboardStats);
router.get('/sales-data', authenticateToken, isAdmin, getSalesData);
router.get('/category-sales', authenticateToken, isAdmin, getCategorySales);

export default router; 