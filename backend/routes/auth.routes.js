import express from 'express';
import { getProfile, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/myprofile', protectRoute, getProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;