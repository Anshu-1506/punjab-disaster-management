import { apiResponse } from '../utils/apiResponse.js';
import Module from '../models/Module.js';
import fs from 'fs';
import path from 'path';

// @desc    Upload educational module
// @route   POST /api/modules
// @access  Private
export const uploadModule = async (req, res, next) => {
  try {
    const { title, description, category, type, youtubeUrl } = req.body;
    
    console.log('Upload request received:', { title, category, type, hasFile: !!req.file });
    
    // Validate required fields
    if (!title || !category || !type) {
      return res.status(400).json(
        apiResponse(false, 'Title, category, and type are required', null, 400)
      );
    }

    // Validate YouTube URL if type is youtube
    if (type === 'youtube') {
      if (!youtubeUrl) {
        return res.status(400).json(
          apiResponse(false, 'YouTube URL is required for YouTube modules', null, 400)
        );
      }
      // Basic YouTube URL validation
      if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        return res.status(400).json(
          apiResponse(false, 'Please provide a valid YouTube URL', null, 400)
        );
      }
    }

    // Validate file if type is pdf or video
    if ((type === 'pdf' || type === 'video') && !req.file) {
      return res.status(400).json(
        apiResponse(false, `File is required for ${type} modules`, null, 400)
      );
    }

    // Create module data
    const moduleData = {
      title,
      description: description || '',
      category,
      type,
      uploadedBy: req.user.id,
      status: 'active',
      views: 0
    };

    // Add YouTube URL or file info based on type
    if (type === 'youtube') {
      moduleData.youtubeUrl = youtubeUrl;
    } else if (req.file) {
      moduleData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    const module = await Module.create(moduleData);
    
    // Populate uploadedBy field
    await module.populate('uploadedBy', 'name email department');

    res.status(201).json(
      apiResponse(true, 'Module uploaded successfully', { module })
    );
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public (changed from Private to allow frontend access)
export const getModules = async (req, res, next) => {
  try {
    const { category, type, status, page = 1, limit = 100 } = req.query;
    
    const query = {};
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    
    const modules = await Module.find(query)
      .populate('uploadedBy', 'name email department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Module.countDocuments(query);
    
    res.json(
      apiResponse(true, 'Modules retrieved successfully', {
        modules,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      })
    );
  } catch (error) {
    console.error('Get modules error:', error);
    next(error);
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Public
export const getModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('uploadedBy', 'name email department');
    
    if (!module) {
      return res.status(404).json(
        apiResponse(false, 'Module not found', null, 404)
      );
    }
    
    // Increment views
    module.views += 1;
    await module.save();
    
    res.json(
      apiResponse(true, 'Module retrieved successfully', { module })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private
export const updateModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json(
        apiResponse(false, 'Module not found', null, 404)
      );
    }
    
    // Check if user owns the module or is admin
    if (module.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to update this module', null, 403)
      );
    }
    
    const updateData = { ...req.body };
    
    // Handle file upload if provided
    if (req.file) {
      // Delete old file if exists
      if (module.file && module.file.path) {
        try {
          if (fs.existsSync(module.file.path)) {
            fs.unlinkSync(module.file.path);
          }
        } catch (error) {
          console.log('Error deleting old file:', error.message);
        }
      }
      
      updateData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email department');
    
    res.json(
      apiResponse(true, 'Module updated successfully', { module: updatedModule })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private
export const deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json(
        apiResponse(false, 'Module not found', null, 404)
      );
    }
    
    // Check if user owns the module or is admin
    if (module.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to delete this module', null, 403)
      );
    }
    
    // Delete associated file if exists
    if (module.file && module.file.path) {
      try {
        if (fs.existsSync(module.file.path)) {
          fs.unlinkSync(module.file.path);
        }
      } catch (error) {
        console.log('Error deleting file:', error.message);
      }
    }
    
    await Module.findByIdAndDelete(req.params.id);
    
    res.json(
      apiResponse(true, 'Module deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};