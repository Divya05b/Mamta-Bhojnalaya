import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth';
import { generateDummyData } from '../../controllers/dummyDataController';

const router = Router();

// Admin route to generate dummy data
router.post('/generate_dummy_data', authenticateAdmin, generateDummyData);

export default router; 