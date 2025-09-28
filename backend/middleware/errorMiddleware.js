import { apiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = apiResponse(false, message, null, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = apiResponse(false, message, null, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = apiResponse(false, 'Validation Error', { errors: message }, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = apiResponse(false, message, null, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = apiResponse(false, message, null, 401);
  }

  res.status(error.statusCode || 500).json(
    apiResponse(false, error.message || 'Server Error', null, error.statusCode || 500)
  );
};