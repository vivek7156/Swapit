import express from 'express';
import { isAdmin } from '../middleware/admin.js';
import { deleteUser, getAllItems, getAllUsers, updateUserRole } from '../controllers/admin.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/users', protectRoute, isAdmin, getAllUsers); // View all users
router.put('/users/role', protectRoute, isAdmin, updateUserRole); // Update user role
router.delete('/users/:userId', protectRoute, isAdmin, deleteUser); // Delete a user
router.get('/items', protectRoute, isAdmin, getAllItems); // View all items

export default router;
