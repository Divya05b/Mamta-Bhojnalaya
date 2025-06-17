import express from 'express';
import authRoutes from './auth';
import menuRoutes from './menu';
import orderRoutes from './orders';
import reviewRoutes from './reviews';
import cartRoutes from './cart';

// Admin routes
import adminMenuRoutes from './admin/menu';
import adminOrderRoutes from './admin/orders';
import adminAnalyticsRoutes from './admin/analytics';
import adminDashboardRoutes from './admin/dashboard';
import adminReviewRoutes from './admin/reviews';

const router = express.Router();

// Public routes (no auth required)
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);

// Customer routes (requires authentication)
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

// Admin routes (requires admin authentication)
router.use('/admin/menu', adminMenuRoutes);
router.use('/admin/orders', adminOrderRoutes);
router.use('/admin/analytics', adminAnalyticsRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/reviews', adminReviewRoutes);

export default router; 