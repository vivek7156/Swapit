import express from 'express';
import Message from '../models/message.model.js';

const router = express.Router();

// Route to fetch chat messages for a specific item
router.get('/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const messages = await Message.find({ itemId }).sort({ timestamp: 1 }); // Sort messages by timestamp (oldest first)
        
        if (!messages) {
            return res.status(404).json({ message: 'No messages found for this item.' });
        }
        
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
