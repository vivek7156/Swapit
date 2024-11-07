import Chat from '../models/chat.model.js';

export const sendMessage = async (req, res) => {
    const { requestId, senderId, message } = req.body;
    try {
        const chatMessage = await Chat.create({ requestId, senderId, message });
        res.status(200).json(chatMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};
