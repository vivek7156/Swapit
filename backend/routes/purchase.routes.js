import express from 'express';
import { createPurchase, getUserPurchases, getItemPurchases, updatePurchaseStatus } from '../controllers/purchase.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.post('/', protectRoute, createPurchase);
router.get('/user/:userId', protectRoute, getUserPurchases);
router.get('/item/:itemId', protectRoute, isAdmin, getItemPurchases);
router.put('/:purchaseId/status', protectRoute, isAdmin, updatePurchaseStatus);

export default router;
