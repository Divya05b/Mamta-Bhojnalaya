import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all orders with details
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
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
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  const orderId = parseInt(req.params.id);

  if (!['pending', 'processing', 'ready', 'delivered', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Delete order
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    // First delete all order items
    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(req.params.id) }
    });

    // Then delete the order
    await prisma.order.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router; 