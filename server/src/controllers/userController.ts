import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {};
  
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  // Get users with pagination
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if user can access this profile
  if (req.user?.role !== 'admin' && req.user?.id !== user.id) {
    throw createError('Not authorized to access this profile', 403);
  }

  res.json({
    success: true,
    data: { user }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or Own Profile
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    throw createError(errorMessages, 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check authorization
  const isAdmin = req.user?.role === 'admin';
  const isOwnProfile = req.user?.id === user.id;

  if (!isAdmin && !isOwnProfile) {
    throw createError('Not authorized to update this profile', 403);
  }

  const { name, email, role, isActive, avatar } = req.body;

  // Regular users can only update their own basic info
  if (!isAdmin) {
    if (role !== undefined || isActive !== undefined) {
      throw createError('Not authorized to update role or active status', 403);
    }
    if (email && email !== user.email) {
      throw createError('Not authorized to change email', 403);
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email && isAdmin) user.email = email;
  if (role && isAdmin) user.role = role;
  if (isActive !== undefined && isAdmin) user.isActive = isActive;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  logger.info(`User updated: ${user.email} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Prevent admin from deleting themselves
  if (req.user?.id === user.id) {
    throw createError('Cannot delete your own account', 400);
  }

  await User.findByIdAndDelete(req.params.id);

  logger.info(`User deleted: ${user.email} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

  // Users registered in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo } 
  });

  // Users logged in within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeInLastWeek = await User.countDocuments({ 
    lastLogin: { $gte: sevenDaysAgo } 
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      regularUsers: totalUsers - adminUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      recentUsers,
      activeInLastWeek
    }
  });
});