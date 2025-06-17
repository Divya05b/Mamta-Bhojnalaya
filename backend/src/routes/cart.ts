import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get cart items
router.get('/', authenticateToken, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json(cart?.items || []);
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
router.post('/items', authenticateToken, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { menuItemId, quantity } = req.body;

  try {
    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { menuItem: true }
      });
      res.json(updatedItem);
    } else {
      // Add new item to cart
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId,
          quantity
        },
        include: { menuItem: true }
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/items/:id', authenticateToken, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: parseInt(id),
        cartId: cart.id
      },
      data: { quantity },
      include: { menuItem: true }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/items/:id', authenticateToken, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.delete({
      where: {
        id: parseInt(id),
        cartId: cart.id
      }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router; 