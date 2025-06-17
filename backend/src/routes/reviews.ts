import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Submit a review
router.post('/', async (req, res) => {
  const { orderId, rating, comment } = req.body;

  try {
    const review = await prisma.testimonial.create({
      data: {
        userId: req.body.userId, // Make sure to pass userId in the request
        rating,
        comment,
        isApproved: false // Reviews need approval by default
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get all reviews (admin only)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const reviews = await prisma.testimonial.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const review = await prisma.testimonial.findUnique({
      where: {
        userId: parseInt(userId)
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json(review || null);
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// Approve a review (admin only)
router.patch('/:id/approve', authenticateToken, async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    const review = await prisma.testimonial.update({
      where: {
        id: parseInt(id)
      },
      data: {
        isApproved: true
      }
    });

    res.json(review);
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ error: 'Failed to approve review' });
  }
});

export default router; 