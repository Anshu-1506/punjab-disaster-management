import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { apiResponse } from '../utils/apiResponse.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(
        apiResponse(false, 'User already exists with this email', null, 400)
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      phone
    });

    if (user) {
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json(
        apiResponse(true, 'User registered successfully', {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          token: generateToken(user._id),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json(
          apiResponse(false, 'Account is deactivated. Please contact administrator.', null, 401)
        );
      }

      user.lastLogin = new Date();
      await user.save();

      res.json(
        apiResponse(true, 'Login successful', {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          token: generateToken(user._id),
        })
      );
    } else {
      res.status(401).json(
        apiResponse(false, 'Invalid credentials', null, 401)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json(
      apiResponse(true, 'User data retrieved successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      })
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department || user.department;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json(
        apiResponse(true, 'Profile updated successfully', {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          department: updatedUser.department,
          phone: updatedUser.phone,
          token: generateToken(updatedUser._id),
        })
      );
    } else {
      res.status(404).json(
        apiResponse(false, 'User not found', null, 404)
      );
    }
  } catch (error) {
    next(error);
  }
};