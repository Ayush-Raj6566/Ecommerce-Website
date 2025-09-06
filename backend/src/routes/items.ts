import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/items';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getItems);
router.get('/:id', getItemById);

// Protected routes
router.post('/', authMiddleware, createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

export default router;