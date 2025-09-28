import { validationResult } from 'express-validator';
import { apiResponse } from '../utils/apiResponse.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    
    return res.status(400).json(
      apiResponse(false, 'Validation failed', { errors: errorMessages }, 400)
    );
  }
  
  next();
};