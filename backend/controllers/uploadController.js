import { apiResponse } from '../utils/apiResponse.js';
import path from 'path';
import fs from 'fs';

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        apiResponse(false, 'Please upload a file', null, 400)
      );
    }

    res.json(
      apiResponse(true, 'File uploaded successfully', {
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(
        apiResponse(false, 'Please upload files', null, 400)
      );
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json(
      apiResponse(true, 'Files uploaded successfully', { files })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const { type = 'reports' } = req.query;

    const filePath = path.join(process.cwd(), 'uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(
        apiResponse(false, 'File not found', null, 404)
      );
    }

    fs.unlinkSync(filePath);

    res.json(
      apiResponse(true, 'File deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};