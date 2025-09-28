import MapData from '../models/MapData.js';
import { apiResponse } from '../utils/apiResponse.js';

// @desc    Get all map data with filters
// @route   GET /api/map
// @access  Public
export const getMapData = async (req, res, next) => {
  try {
    const { category, district, type, page = 1, limit = 50 } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (district) query.district = district;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mapData = await MapData.find(query)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await MapData.countDocuments(query);

    res.json(
      apiResponse(true, 'Map data retrieved successfully', {
        mapData,
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

// @desc    Get map data by ID
// @route   GET /api/map/:id
// @access  Public
export const getMapDataById = async (req, res, next) => {
  try {
    const mapData = await MapData.findById(req.params.id)
      .populate('createdBy', 'name email department');

    if (!mapData) {
      return res.status(404).json(
        apiResponse(false, 'Map data not found', null, 404)
      );
    }

    res.json(
      apiResponse(true, 'Map data retrieved successfully', { mapData })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create new map data
// @route   POST /api/map
// @access  Private
export const createMapData = async (req, res, next) => {
  try {
    const mapData = await MapData.create({
      ...req.body,
      createdBy: req.user.id
    });

    const populatedMapData = await MapData.findById(mapData._id)
      .populate('createdBy', 'name email');

    res.status(201).json(
      apiResponse(true, 'Map data created successfully', { mapData: populatedMapData })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update map data
// @route   PUT /api/map/:id
// @access  Private
export const updateMapData = async (req, res, next) => {
  try {
    let mapData = await MapData.findById(req.params.id);

    if (!mapData) {
      return res.status(404).json(
        apiResponse(false, 'Map data not found', null, 404)
      );
    }

    // Check if user is authorized to update
    if (mapData.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to update this map data', null, 403)
      );
    }

    mapData = await MapData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(
      apiResponse(true, 'Map data updated successfully', { mapData })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete map data
// @route   DELETE /api/map/:id
// @access  Private
export const deleteMapData = async (req, res, next) => {
  try {
    const mapData = await MapData.findById(req.params.id);

    if (!mapData) {
      return res.status(404).json(
        apiResponse(false, 'Map data not found', null, 404)
      );
    }

    // Check if user is authorized to delete
    if (mapData.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        apiResponse(false, 'Not authorized to delete this map data', null, 403)
      );
    }

    await MapData.findByIdAndDelete(req.params.id);

    res.json(
      apiResponse(true, 'Map data deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get map data within geographical bounds
// @route   GET /api/map/bounds
// @access  Public
export const getMapDataInBounds = async (req, res, next) => {
  try {
    const { north, south, east, west } = req.query;

    if (!north || !south || !east || !west) {
      return res.status(400).json(
        apiResponse(false, 'Please provide all bounds parameters', null, 400)
      );
    }

    const mapData = await MapData.find({
      geometry: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [[
              [parseFloat(west), parseFloat(south)],
              [parseFloat(east), parseFloat(south)],
              [parseFloat(east), parseFloat(north)],
              [parseFloat(west), parseFloat(north)],
              [parseFloat(west), parseFloat(south)]
            ]]
          }
        }
      },
      isActive: true
    }).populate('createdBy', 'name email');

    res.json(
      apiResponse(true, 'Map data within bounds retrieved successfully', { mapData })
    );
  } catch (error) {
    next(error);
  }
};