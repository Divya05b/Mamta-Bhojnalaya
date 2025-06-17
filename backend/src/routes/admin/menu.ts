import express from 'express';
import { authenticateToken, isAdmin } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/menu';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .webp files are allowed!'));
  }
});

// Get all menu items for admin
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany();
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get a single menu item by ID
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
    });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching single menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Upload menu item image
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const image = `/uploads/menu/${req.file.filename}`;
    res.json({ image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Update menu item with image
router.put('/:id', authenticateToken, multer().none(), async (req, res) => {
  console.log('Raw request body (PUT after multer.none()):', req.body);
  const { id } = req.params;
  const { name, description, price, category, image, is_available, is_vegetarian, is_spicy, is_signature_dish } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category) {
    console.error('Missing required fields for update:', { name, description, price, category });
    return res.status(400).json({
      error: 'Missing required fields for update',
      details: {
        name: !name,
        description: !description,
        price: !price,
        category: !category
      }
    });
  }

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name: String(name),
        description: String(description),
        price: Number(price),
        category: String(category),
        image: image || null,
        isAvailable: is_available === 'true',
        isVegetarian: is_vegetarian === 'true',
        isSpicy: is_spicy === 'true',
        isSignatureDish: is_signature_dish === 'true',
      },
    });

    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Permanently delete the menu item
    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Menu item deleted permanently' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Route to toggle menu item availability
router.patch('/:id/availability', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body; // Expecting boolean true/false

  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ error: 'Invalid value for isAvailable. Must be true or false.' });
  }

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        isAvailable: isAvailable,
      },
    });
    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

router.post('/', authenticateToken, multer().none(), async (req, res) => {
  console.log('Raw request body (POST after multer.none()):', req.body);
  console.log('Request headers:', req.headers);
  
  const { name, description, price, category, image, is_available, is_vegetarian, is_spicy, is_signature_dish } = req.body;
  
  // Log each field individually
  console.log('Parsed fields:', {
    name: name,
    description: description,
    price: price,
    category: category,
    image: image,
    isAvailable: is_available,
    isVegetarian: is_vegetarian,
    isSpicy: is_spicy,
    isSignatureDish: is_signature_dish
  });

  // Validate required fields
  if (!name || !description || !price || !category) {
    console.error('Missing required fields:', { name, description, price, category });
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: {
        name: !name,
        description: !description,
        price: !price,
        category: !category
      }
    });
  }

  try {
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name: String(name),
        description: String(description),
        price: Number(price),
        category: String(category),
        image: image || null,
        isAvailable: is_available === 'true',
        isVegetarian: is_vegetarian === 'true',
        isSpicy: is_spicy === 'true',
        isSignatureDish: is_signature_dish === 'true',
      },
    });
    console.log('Successfully created menu item:', newMenuItem);
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

export default router; 