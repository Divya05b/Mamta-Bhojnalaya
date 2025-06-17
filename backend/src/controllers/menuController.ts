import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' }
    });

    // Ensure image is a string, even if null in DB
    const formattedItems = items.map(item => ({
      ...item,
      image: item.image || ''
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: Number(id) }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Ensure image is a string, even if null in DB
    const formattedMenuItem = {
      ...menuItem,
      image: menuItem.image || ''
    };

    res.json(formattedMenuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Error fetching menu item' });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || '',
        isAvailable: isAvailable === 'true',
      }
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, isAvailable } = req.body;

    const menuItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || '',
        isAvailable: isAvailable === 'true',
      }
    });

    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};

export const uploadMenuItemImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = `/uploads/menu/${req.file.filename}`;
    res.json({ image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
}; 