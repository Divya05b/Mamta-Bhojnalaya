import { Router } from 'express';
import {
  submitTestimonial,
  getTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  deleteTestimonialAdmin,
  getUserTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
} from '../controllers/testimonialController';
import { validateRequest } from '../middleware/validateRequest';
import { testimonialSchema } from '../schemas/testimonialSchema';
import { authenticateToken, authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public route to get approved testimonials
router.get('/', getTestimonials);

// Protected routes for authenticated users
router.post('/', authenticateToken, validateRequest(testimonialSchema), submitTestimonial);
router.get('/user', authenticateToken, getUserTestimonial);
router.put('/', authenticateToken, validateRequest(testimonialSchema), updateTestimonial);
router.delete('/', authenticateToken, deleteTestimonial);
router.get('/stats', authenticateAdmin, getTestimonialStats);

// Admin routes
router.get('/pending', authenticateAdmin, getPendingTestimonials);
router.patch('/:id/approve', authenticateAdmin, approveTestimonial);
router.delete('/:id', authenticateAdmin, deleteTestimonialAdmin);

export default router; 