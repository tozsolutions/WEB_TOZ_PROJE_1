import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Validation rules
const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

// Routes
router.get('/stats', authenticate, authorize('admin'), getUserStats);
router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/:id', authenticate, userIdValidation, getUser);
router.put('/:id', authenticate, updateUserValidation, updateUser);
router.delete('/:id', authenticate, authorize('admin'), userIdValidation, deleteUser);

export default router;