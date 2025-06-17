import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contactRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import adminMenuRoutes from './routes/admin/menu';
import path from 'path';

const app = express();

console.log('Initializing Express application...');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

console.log('Middleware configured');

app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=====================');
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Setting up routes...');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);

console.log('Routes configured');

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Catch-all route for debugging 404s
app.use((req: express.Request, res: express.Response) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    error: 'Not Found',
    message: `No route found for ${req.method} ${req.url}`,
    availableRoutes: [
      '/api/auth',
      '/api/orders',
      '/api/contact',
      '/api/testimonials'
    ]
  });
});

console.log('Express application initialized');

export default app; 