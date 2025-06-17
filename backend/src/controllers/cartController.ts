import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      console.error("getCart: userId is missing from request.");
      return res.status(400).json({ message: "User ID missing from request." });
    }
    console.log("Fetching cart for userId:", userId);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0);

    res.json({
      items: cart.items,
      total,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { menuItemId, quantity } = req.body;

    if (!userId) {
      console.error("addToCart: userId is missing from request.");
      return res.status(400).json({ message: "User ID missing from request." });
    }

    console.log(`addToCart: userId: ${userId}, menuItemId: ${menuItemId}, quantity: ${quantity}`);

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.menuItemId === menuItemId
    );

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId,
          quantity,
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const total = updatedCart?.items.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0) || 0;

    res.json({
      message: 'Item added to cart',
      items: updatedCart?.items || [],
      total,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: Number(itemId) },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: Number(itemId) },
        data: { quantity },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const total = updatedCart?.items.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0) || 0;

    res.json({
      message: 'Cart updated',
      items: updatedCart?.items || [],
      total,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await prisma.cartItem.delete({
      where: { id: Number(itemId) },
    });

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const total = updatedCart?.items.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0) || 0;

    res.json({
      message: 'Item removed from cart',
      items: updatedCart?.items || [],
      total,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(200).json({ message: 'Cart already empty or not found' });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
}; 