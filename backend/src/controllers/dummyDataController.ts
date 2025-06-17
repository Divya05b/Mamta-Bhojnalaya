import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const generateDummyData = async (req: Request, res: Response) => {
  try {
    // Clear existing data (optional, based on desired behavior)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.user.deleteMany();

    // Create dummy users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user1 = await prisma.user.create({
      data: { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'customer', address: '123 Main St', phone: '1234567890' },
    });
    const user2 = await prisma.user.create({
      data: { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, role: 'customer', address: '456 Oak Ave', phone: '0987654321' },
    });
    const adminUser = await prisma.user.create({
      data: { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin', address: 'Admin HQ', phone: '9999999999' },
    });

    // Create dummy menu items
    const menuItem1 = await prisma.menuItem.create({
      data: { name: 'Chicken Tikka Masala', description: 'Classic Indian chicken curry', price: 12.99, category: 'Main Course', image: '/images/chicken_tikka.jpg', isAvailable: true, isSignatureDish: true },
    });
    const menuItem2 = await prisma.menuItem.create({
      data: { name: 'Paneer Butter Masala', description: 'Creamy paneer curry', price: 10.99, category: 'Main Course', image: '/images/paneer_butter.jpg', isAvailable: true, isSignatureDish: false },
    });
    const menuItem3 = await prisma.menuItem.create({
      data: { name: 'Garlic Naan', description: 'Indian flatbread with garlic', price: 2.50, category: 'Bread', image: '/images/garlic_naan.jpg', isAvailable: true, isSignatureDish: true },
    });
    const menuItem4 = await prisma.menuItem.create({
      data: { name: 'Vegetable Biryani', description: 'Fragrant rice with mixed vegetables', price: 11.50, category: 'Rice', image: '/images/veg_biryani.jpg', isAvailable: true, isSignatureDish: false },
    });
    const menuItem5 = await prisma.menuItem.create({
      data: { name: 'Gulab Jamun', description: 'Sweet milk-solid dumplings', price: 4.00, category: 'Dessert', image: '/images/gulab_jamun.jpg', isAvailable: true, isSignatureDish: false },
    });

    // Create dummy orders
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        total: 28.48,
        status: 'completed',
        orderType: 'delivery',
        paymentMethod: 'credit_card',
        address: '123 Main St, Apt 1A',
        phone: '111-222-3333',
        items: {
          create: [
            { menuItemId: menuItem1.id, quantity: 1, price: menuItem1.price },
            { menuItemId: menuItem3.id, quantity: 2, price: menuItem3.price },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        total: 11.50,
        status: 'pending',
        orderType: 'pickup',
        paymentMethod: 'cash_on_delivery',
        address: '456 Oak Ave, Suite 2B',
        phone: '444-555-6666',
        items: {
          create: [
            { menuItemId: menuItem4.id, quantity: 1, price: menuItem4.price },
          ],
        },
      },
    });

    // Create dummy testimonials
    await prisma.testimonial.create({
      data: { userId: user1.id, rating: 5, comment: 'Amazing food and service!', isApproved: true },
    });
    await prisma.testimonial.create({
      data: { userId: user2.id, rating: 4, comment: 'Great experience, will order again.', isApproved: true },
    });
    await prisma.testimonial.create({
      data: { userId: adminUser.id, rating: 4.5, comment: 'As an admin, I can confirm the quality!', isApproved: true },
    });

    res.status(200).json({ message: 'Dummy data generated successfully!' });
  } catch (error) {
    console.error('Error generating dummy data:', error);
    res.status(500).json({ message: 'Failed to generate dummy data' });
  }
}; 