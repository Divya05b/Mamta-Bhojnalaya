import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all testimonials
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Approve testimonial
router.patch('/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(req.params.id) },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.json(testimonial);
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ error: 'Failed to approve testimonial' });
  }
});

// Delete testimonial
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router; 