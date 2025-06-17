import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { testimonialSchema } from '../schemas/testimonialSchema';

const prisma = new PrismaClient();

export const submitTestimonial = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { rating, comment } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        userId,
        rating,
        comment,
        isApproved: false, // Requires admin approval
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ message: 'Error submitting testimonial' });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
};

export const getPendingTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching pending testimonials:', error);
    res.status(500).json({ message: 'Error fetching pending testimonials' });
  }
};

export const approveTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(testimonial);
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ message: 'Error approving testimonial' });
  }
};

export const deleteTestimonialAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Error deleting testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await prisma.testimonial.delete({
      where: { userId },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting user testimonial:', error);
    res.status(500).json({ message: 'Error deleting user testimonial' });
  }
};

export const getTestimonialStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.testimonial.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const ratingDistribution = await prisma.testimonial.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
    });

    res.json({
      averageRating: stats._avg.rating || 0,
      totalTestimonials: stats._count._all,
      ratingDistribution,
    });
  } catch (error) {
    console.error('Error fetching testimonial stats:', error);
    res.status(500).json({ message: 'Error fetching testimonial stats' });
  }
};

export const getUserTestimonial = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const testimonial = await prisma.testimonial.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching user testimonial:', error);
    res.status(500).json({ message: 'Error fetching user testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { rating, comment } = req.body;

    const updatedTestimonial = await prisma.testimonial.update({
      where: { userId },
      data: {
        rating,
        comment,
        isApproved: false, // Re-approve after update
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Error updating testimonial' });
  }
}; 