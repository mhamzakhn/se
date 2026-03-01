import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import validate from '../middleware/validate.js';
import { addToCart, getCart, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController.js';
import { validateAddToCart, validateUpdateCartItem } from '../validators/cartValidators.js';

const router = express.Router();
router.use(requireAuth);

router.post('/add', validateAddToCart, validate, addToCart);
router.get('/', getCart);
router.put('/item/:itemId', validateUpdateCartItem, validate, updateCartItem);
router.delete('/item/:itemId', deleteCartItem);
router.delete('/', clearCart);

export default router;
