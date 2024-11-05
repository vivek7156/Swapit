import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.post('/update', protectRoute, updateUserProfile);

export default router;