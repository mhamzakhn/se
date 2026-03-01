import { body } from 'express-validator';

export const validateAddToCart = [
  body('item_id').notEmpty().withMessage('Item ID is required'),
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
];

export const validateUpdateCartItem = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];
