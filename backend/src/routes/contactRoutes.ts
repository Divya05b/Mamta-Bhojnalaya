import { Router } from 'express';
import {
  submitContact,
  getContactSubmissions,
  deleteContactSubmission,
} from '../controllers/contactController';
import { validateRequest } from '../middleware/validateRequest';
import { contactSchema } from '../schemas/contactSchema';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public route for submitting contact form
router.post('/', validateRequest(contactSchema), submitContact);

// Admin routes
router.get('/', authenticateAdmin, getContactSubmissions);
router.delete('/:id', authenticateAdmin, deleteContactSubmission);

export default router; 