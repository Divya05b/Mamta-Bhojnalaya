import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get sales analytics
router.get('/sales', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    let startDate = new Date();

    // Calculate start date based on period
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Process orders to get daily sales
    const dailySales = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          total: 0,
          count: 0
        };
      }
      acc[date].total += order.total;
      acc[date].count += 1;
      return acc;
    }, {});

    res.json({
      dailySales: Object.entries(dailySales).map(([date, data]: [string, any]) => ({
        date,
        total: data.total,
        count: data.count
      }))
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
});

// Get menu item analytics
router.get('/menu-items', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        _count: {
          select: {
            orderItems: true,
            cartItems: true
          }
        }
      }
    });

    const analytics = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      totalOrders: item._count.orderItems,
      totalCarts: item._count.cartItems,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable
    }));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching menu item analytics:', error);
    res.status(500).json({ error: 'Failed to fetch menu item analytics' });
  }
});

// Get user analytics
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    const analytics = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalOrders: user._count.orders,
      role: user.role
    }));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

export default router; 