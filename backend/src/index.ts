import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Import routes
import userRoutes from './routes/userRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contactRoutes';
import cartRoutes from './routes/cartRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import salesRoutes from './routes/salesRoutes';
import authRoutes from './routes/auth';
import reviewRoutes from './routes/reviews';
import adminMenuRoutes from './routes/admin/menu';
import adminOrderRoutes from './routes/admin/orders';
import adminAnalyticsRoutes from './routes/admin/analytics';
import adminDashboardRoutes from './routes/admin/dashboard';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and Prisma client...');
  await prisma.$disconnect();
  process.exit(0);
}); 