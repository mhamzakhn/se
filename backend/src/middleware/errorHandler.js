import AppError from '../utils/AppError.js';

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new AppError(messages.join(', '), 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    err = new AppError(`Duplicate value for: ${field}`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Token expired', 401);
  }

  const response = {
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    if (!err.isOperational) {
      response.message = err.message;
    }
  }

  if (!err.isOperational) {
    console.error('Unexpected error:', err);
  }

  return res.status(err.statusCode).json(response);
};
