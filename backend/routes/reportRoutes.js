import express from 'express';
import { body } from 'express-validator';
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  getReportStats
} from '../controllers/reportsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { uploadReportImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Validation rules
const reportValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['infrastructure', 'health', 'education', 'agriculture', 'other'])
    .withMessage('Invalid category specified'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority specified'),
  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters')
];

// All routes protected
router.use(protect);

// Routes
router.get('/', getReports);
router.get('/stats', authorize('admin', 'moderator'), getReportStats);
router.get('/:id', getReport);
router.post(
  '/', 
  uploadReportImages.array('images', 5),
  reportValidation, 
  handleValidationErrors, 
  createReport
);
router.put('/:id', reportValidation, handleValidationErrors, updateReport);
router.delete('/:id', deleteReport);

export default router;