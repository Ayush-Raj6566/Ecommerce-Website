import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cart';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// All cart routes are protected
router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.put('/update', updateCartItem);
router.delete('/clear', clearCart);

export default router;