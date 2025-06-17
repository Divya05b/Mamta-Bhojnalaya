import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';
import { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema 
} from '../schemas/userSchema';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);

export default router; 