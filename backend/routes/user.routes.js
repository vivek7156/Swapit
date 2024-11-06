import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { addToWatchlist, getUserListings, getUserProfile, getWatchlist, removeFromWatchlist, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.post('/update', protectRoute, updateUserProfile);
router.get('/:userId/listings', getUserListings);
router.post('/:userId/watchlist', protectRoute, addToWatchlist);
router.delete('/:userId/watchlist', protectRoute, removeFromWatchlist);
router.get('/:userId/watchlist',protectRoute, getWatchlist);

export default router;