import express from 'express';
import { getSalesData } from '../controllers/salesController';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Get sales data with time range filter
router.get('/', authenticateAdmin, getSalesData);

export default router; 