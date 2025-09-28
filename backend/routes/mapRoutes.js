import express from 'express';
import { body } from 'express-validator';
import {
  getMapData,
  getMapDataById,
  createMapData,
  updateMapData,
  deleteMapData,
  getMapDataInBounds
} from '../controllers/mapDataController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const mapDataValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('category')
    .isIn(['healthcare', 'education', 'infrastructure', 'agriculture', 'transport', 'administration', 'other'])
    .withMessage('Invalid category specified'),
  body('type')
    .isIn(['point', 'polygon', 'line'])
    .withMessage('Invalid type specified'),
  body('coordinates')
    .optional()
    .isArray()
    .withMessage('Coordinates must be an array'),
  body('geometry.type')
    .isIn(['Point', 'Polygon', 'LineString'])
    .withMessage('Invalid geometry type'),
  body('geometry.coordinates')
    .isArray()
    .withMessage('Geometry coordinates must be an array')
];

// Public routes
router.get('/', getMapData);
router.get('/bounds', getMapDataInBounds);
router.get('/:id', getMapDataById);

// Protected routes
router.use(protect);

router.post('/', mapDataValidation, handleValidationErrors, createMapData);
router.put('/:id', mapDataValidation, handleValidationErrors, updateMapData);
router.delete('/:id', deleteMapData);

export default router;