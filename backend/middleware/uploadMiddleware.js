import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads');
const modulesDir = path.join(uploadsDir, 'modules');
const reportsDir = path.join(uploadsDir, 'reports');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(modulesDir)) fs.mkdirSync(modulesDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// Configure storage for modules (PDFs, Videos)
const moduleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, modulesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'module-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for reports (images)
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reportsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for modules (allow PDFs and videos)
const moduleFileFilter = (req, file, cb) => {
  const allowedMimes = {
    'application/pdf': 'pdf',
    'video/mp4': 'video',
    'video/mpeg': 'video',
    'video/quicktime': 'video',
    'video/webm': 'video',
    'video/x-msvideo': 'video',
    'video/avi': 'video',
    'video/mkv': 'video'
  };

  if (allowedMimes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only PDF and video files are allowed. Received: ${file.mimetype}`), false);
  }
};

// File filter for reports (images only)
const reportFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for reports'), false);
  }
};

// Multer configurations
export const uploadModuleFiles = multer({
  storage: moduleStorage,
  fileFilter: moduleFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for modules
    files: 1
  }
});

export const uploadReportImages = multer({
  storage: reportStorage,
  fileFilter: reportFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5
  }
});

export const uploadMapFiles = multer({
  storage: reportStorage,
  fileFilter: reportFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  }
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: error.message
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files',
        error: error.message
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
        error: error.message
      });
    }
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
  
  next();
};