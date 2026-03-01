import { body } from 'express-validator';

export const validateAddMenuItem = [
  body('item_id').notEmpty().withMessage('Item ID is required'),
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

export const validateUpdateMenuItem = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
];

export const validateUpdateOrderStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, confirmed, delivered, cancelled'),
];

export const validateSendEmail = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];
