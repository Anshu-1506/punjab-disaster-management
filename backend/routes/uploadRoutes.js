import express from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile
} from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadReportImages, uploadMapFiles, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

// Routes
router.post('/single', uploadReportImages.single('file'), handleUploadError, uploadFile);
router.post('/multiple', uploadReportImages.array('files', 10), handleUploadError, uploadMultipleFiles);
router.delete('/:filename', deleteFile);

export default router;