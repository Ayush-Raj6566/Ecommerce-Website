import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma';

// Import routes
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import cartRoutes from './routes/cart';

// Load environment variables
dotenv.config();

// Export Prisma client
export { prisma };

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});