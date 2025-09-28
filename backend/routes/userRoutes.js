import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role specified'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUserValidation, handleValidationErrors, updateUser);
router.delete('/:id', deleteUser);

export default router;