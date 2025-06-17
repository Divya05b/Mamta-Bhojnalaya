import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Public routes
router.get('/', async (req, res) => {
  try {
    console.log('Fetching menu items with query params:', req.query);
    const { search, category, isVegetarian, isSpicy } = req.query;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All') {
      whereClause.category = category as string;
    }

    if (isVegetarian === 'true') {
      whereClause.isVegetarian = true;
    }

    if (isSpicy === 'true') {
      whereClause.isSpicy = true;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: {
        category: 'asc',
      },
    });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    res.status(500).json({
      error: 'Failed to fetch menu items',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all signature dishes
router.get('/signature-dishes', async (req, res) => {
  try {
    const signatureDishes = await prisma.menuItem.findMany({
      where: {
        isSignatureDish: true,
        isAvailable: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(signatureDishes);
  } catch (error) {
    console.error('Error fetching signature dishes:', error);
    res.status(500).json({ error: 'Failed to fetch signature dishes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

export default router; 