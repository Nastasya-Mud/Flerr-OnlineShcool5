import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Routes
import authRoutes from './modules/auth/routes.js';
import coursesRoutes from './modules/courses/routes.js';
import lessonsRoutes from './modules/lessons/routes.js';
import promoRoutes from './modules/promo/routes.js';
import searchRoutes from './modules/search/routes.js';
import uploadsRoutes from './modules/uploads/routes.js';
import adminRoutes from './modules/admin/routes.js';
import teachersRoutes from './modules/teachers/routes.js';
import galleryRoutes from './modules/gallery/routes.js';
import siteSettingsRoutes from './modules/site-settings/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.APP_BASE_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/site-settings', siteSettingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

