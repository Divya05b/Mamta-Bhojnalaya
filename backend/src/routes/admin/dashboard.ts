import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard statistics
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause: any = {};

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        const endOfDay = new Date(endDate as string);
        endOfDay.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = endOfDay;
      }
    }

    const [
      totalOrders,
      totalRevenueAggregate,
      totalUsers,
      totalMenuItems,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: whereClause
      }),
      prisma.user.count(),
      prisma.menuItem.count(),
      prisma.order.findMany({
        take: 5,
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
    ]);

    // Fetch all orders within the date range for detailed analysis
    const allOrdersInPeriod = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Calculate order status summary
    const orderStatusSummaryMap = allOrdersInPeriod.reduce((acc: Map<string, { count: number, totalRevenue: number }>, order) => {
      const status = order.status;
      if (!acc.has(status)) {
        acc.set(status, { count: 0, totalRevenue: 0 });
      }
      const current = acc.get(status)!;
      current.count += 1;
      current.totalRevenue += order.total;
      return acc;
    }, new Map<string, { count: number, totalRevenue: number }>());

    const orderStatusSummary = Array.from(orderStatusSummaryMap.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      totalRevenue: data.totalRevenue
    }));

    // Calculate top foods of the month (or selected period)
    const topMenuItemsMap = new Map<number, { name: string, totalQuantity: number, totalRevenue: number }>();

    for (const order of allOrdersInPeriod) {
      for (const item of order.items) {
        if (item.menuItem) {
          const menuItemId = item.menuItemId;
          const itemName = item.menuItem.name;
          const itemQuantity = item.quantity;
          const itemPrice = item.price; // This price is from OrderItem, not MenuItem directly, which is correct for historical pricing.

          if (!topMenuItemsMap.has(menuItemId)) {
            topMenuItemsMap.set(menuItemId, { 
              name: itemName,
              totalQuantity: 0,
              totalRevenue: 0
            });
          }
          const current = topMenuItemsMap.get(menuItemId)!;
          current.totalQuantity += itemQuantity;
          current.totalRevenue += itemQuantity * itemPrice;
        }
      }
    }

    const topMenuItems = Array.from(topMenuItemsMap.entries())
      .map(([, data]) => data)
      .sort((a, b) => b.totalQuantity - a.totalQuantity) // Sort by quantity sold
      .slice(0, 5); // Top 5 items

    res.json({
      totalOrders,
      totalRevenue: totalRevenueAggregate._sum.total || 0,
      totalUsers,
      totalMenuItems,
      recentOrders,
      orderStatusSummary,
      topMenuItems,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, isAdmin, async (req, res) => {
  try {
    const recentActivity = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json(recentActivity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

export default router; 