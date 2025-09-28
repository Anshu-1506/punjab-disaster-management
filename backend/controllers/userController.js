import User from '../models/User.js';
import { apiResponse } from '../utils/apiResponse.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json(
      apiResponse(true, 'Users retrieved successfully', {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json(
        apiResponse(false, 'User not found', null, 404)
      );
    }

    res.json(
      apiResponse(true, 'User retrieved successfully', { user })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json(
        apiResponse(false, 'User not found', null, 404)
      );
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json(
      apiResponse(true, 'User updated successfully', {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          department: updatedUser.department,
          phone: updatedUser.phone,
          isActive: updatedUser.isActive,
          lastLogin: updatedUser.lastLogin,
          createdAt: updatedUser.createdAt,
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json(
        apiResponse(false, 'User not found', null, 404)
      );
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json(
        apiResponse(false, 'You cannot delete your own account', null, 400)
      );
    }

    await User.findByIdAndDelete(req.params.id);

    res.json(
      apiResponse(true, 'User deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};