import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const getSalesData = async (req: Request, res: Response) => {
  try {
    const { timeRange = 'daily' } = req.query;
    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    // Set date range based on timeRange
    switch (timeRange) {
      case 'weekly':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default: // daily
        startDate = startOfDay(now);
        endDate = endOfDay(now);
    }

    // Get total revenue and order count
    const totalStats = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Get sales data by date
    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Get sales by category
    const categorySales = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
      },
      _sum: {
        quantity: true,
        price: true,
      },
    });

    // Get menu items for category mapping
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: categorySales.map(item => item.menuItemId),
        },
      },
      select: {
        id: true,
        category: true,
      },
    });

    // Map category sales with menu items
    const categorySalesWithNames = categorySales.map(sale => {
      const menuItem = menuItems.find(item => item.id === sale.menuItemId);
      return {
        category: menuItem?.category || 'Unknown',
        sales: sale._sum.price || 0,
      };
    });

    // Group by category
    const groupedCategorySales = categorySalesWithNames.reduce((acc, curr) => {
      const existing = acc.find(item => item.category === curr.category);
      if (existing) {
        existing.sales += curr.sales;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as { category: string; sales: number }[]);

    res.json({
      salesData: salesData.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        totalSales: item._sum.total || 0,
        orderCount: item._count,
      })),
      categorySales: groupedCategorySales,
      totalRevenue: totalStats._sum.total || 0,
      totalOrders: totalStats._count,
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
}; 