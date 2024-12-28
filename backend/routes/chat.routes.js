import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getConversation, getMessages, getReceivedMessages, getSentMessages, rateSeller, requestChat, sendMessage, updateConversationStatus } from '../controllers/chat.controller.js';


const router = express.Router();

// Route to fetch chat messages for a specific item
router.get('/all/:id', protectRoute, getMessages);
router.post('/send', protectRoute, sendMessage);
router.post('/request', protectRoute, requestChat); 
router.get('/received', protectRoute, getReceivedMessages); 
router.get('/sent', protectRoute, getSentMessages);
router.get('/conversations/:id', protectRoute, getConversation);
router.post('/status', protectRoute, updateConversationStatus);
router.post('/rate', protectRoute, rateSeller);

export default router;
