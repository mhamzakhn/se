import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { addToCart, getCart, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController.js';

const router = express.Router();
router.use(requireAuth);

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', deleteCartItem);
router.delete('/', clearCart);

export default router;
