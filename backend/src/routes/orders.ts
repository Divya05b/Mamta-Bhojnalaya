import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all orders for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { address, phone, paymentMethod, orderType, items } = req.body;
    const userId = req.user.id;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        userId,
        address,
        phone,
        paymentMethod,
        orderType,
        status: 'pending',
        total,
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get a specific order by ID for the authenticated user
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req.user as any).id;

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have access to it.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order details.' });
  }
});

export default router; 