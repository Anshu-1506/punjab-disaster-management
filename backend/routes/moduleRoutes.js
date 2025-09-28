import express from 'express';
import {
  uploadModule,
  getModules,
  getModule,
  updateModule,
  deleteModule
} from '../controllers/moduleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadModuleFiles, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getModules);
router.get('/:id', getModule);

// Protected routes
router.use(protect);

router.post('/', uploadModuleFiles.single('file'), handleUploadError, uploadModule);
router.put('/:id', uploadModuleFiles.single('file'), handleUploadError, updateModule);
router.delete('/:id', deleteModule);

export default router;