import Report from '../models/Report.js';
import { apiResponse } from '../utils/apiResponse.js';

// @desc    Get all reports with filters
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res, next) => {
  try {
    const { 
      category, 
      status, 
      priority, 
      district,
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = {};
    
    // Build query based on filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (district) query['location.district'] = district;
    
    // Regular users can only see their own reports, admins/moderators can see all
    if (req.user.role === 'user') {
      query.reportedBy = req.user.id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email department')
      .populate('assignedTo', 'name email department')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json(
      apiResponse(true, 'Reports retrieved successfully', {
        reports,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email department phone')
      .populate('assignedTo', 'name email department');

    if (!report) {
      return res.status(404).json(
        apiResponse(false, 'Report not found', null, 404)
      );
    }

    // Check if user has access to this report
    if (req.user.role === 'user' && report.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to access this report', null, 403)
      );
    }

    res.json(
      apiResponse(true, 'Report retrieved successfully', { report })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const report = await Report.create({
      ...req.body,
      reportedBy: req.user.id,
      images: req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path
      })) : []
    });

    const populatedReport = await Report.findById(report._id)
      .populate('reportedBy', 'name email department');

    res.status(201).json(
      apiResponse(true, 'Report created successfully', { report: populatedReport })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json(
        apiResponse(false, 'Report not found', null, 404)
      );
    }

    // Check if user has permission to update
    if (req.user.role === 'user' && report.reportedBy.toString() !== req.user.id) {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to update this report', null, 403)
      );
    }

    // Only admins/moderators can change status and assign reports
    if (req.user.role === 'user') {
      delete req.body.status;
      delete req.body.assignedTo;
      delete req.body.resolutionNotes;
    }

    // If status is being updated to 'resolved', set resolvedAt
    if (req.body.status === 'resolved' && report.status !== 'resolved') {
      req.body.resolvedAt = new Date();
    }

    report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('reportedBy', 'name email department')
      .populate('assignedTo', 'name email department');

    res.json(
      apiResponse(true, 'Report updated successfully', { report })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json(
        apiResponse(false, 'Report not found', null, 404)
      );
    }

    // Check if user has permission to delete
    if (req.user.role === 'user' && report.reportedBy.toString() !== req.user.id) {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to delete this report', null, 403)
      );
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json(
      apiResponse(true, 'Report deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get report statistics
// @route   GET /api/reports/stats
// @access  Private/Admin
export const getReportStats = async (req, res, next) => {
  try {
    const stats = await Report.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          byCategory: { $push: { category: '$category', status: '$status' } }
        }
      }
    ]);

    const categoryStats = await Report.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      }
    ]);

    const districtStats = await Report.aggregate([
      {
        $group: {
          _id: '$location.district',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(
      apiResponse(true, 'Report statistics retrieved successfully', {
        overall: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0 },
        byCategory: categoryStats,
        byDistrict: districtStats
      })
    );
  } catch (error) {
    next(error);
  }
};