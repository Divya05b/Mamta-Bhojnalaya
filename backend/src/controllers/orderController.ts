import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for updating order status
const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
});

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
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
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: 'cancelled' },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's stats
    const todayStats = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: today,
        },
        status: {
          not: 'cancelled',
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    // Get overall stats
    const overallStats = await prisma.order.aggregate({
      where: {
        status: {
          not: 'cancelled',
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    // Get category sales
    const categorySales = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          status: {
            not: 'cancelled',
          },
        },
      },
      _sum: {
        price: true,
        quantity: true,
      },
    });

    // Get menu item details for categories
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: categorySales.map(sale => sale.menuItemId),
        },
      },
      select: {
        id: true,
        category: true,
      },
    });

    const menuItemMap = new Map(menuItems.map(item => [item.id, item.category]));

    const stats = {
      today: {
        orders: todayStats._count.id,
        sales: todayStats._sum.total || 0,
      },
      overall: {
        orders: overallStats._count.id,
        sales: overallStats._sum.total || 0,
      },
      categorySales: categorySales.map((sale) => ({
        category: menuItemMap.get(sale.menuItemId) || 'Unknown',
        sales: sale._sum?.price || 0,
        quantity: sale._sum?.quantity || 0,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format orders for frontend
    const formattedOrders = recentOrders.map(order => ({
      id: order.id.toString(),
      orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
      customerName: order.user.name,
      total: order.total,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total revenue
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    // Get average order value
    const avgOrderValue = await prisma.order.aggregate({
      _avg: {
        total: true,
      },
    });

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'pending',
      },
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: avgOrderValue._avg.total || 0,
      pendingOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export const getSalesData = async (req: Request, res: Response) => {
  try {
    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { total: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

export const getCategorySales = async (req: Request, res: Response) => {
  try {
    const categorySales = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: { price: true },
      orderBy: { _sum: { price: 'desc' } },
    });

    res.json(categorySales);
  } catch (error) {
    console.error('Error fetching category sales:', error);
    res.status(500).json({ message: 'Error fetching category sales' });
  }
}; 