import Notification from '../models/notification.model.js';

export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
};

export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ message: 'Error clearing notifications' });
    }
};

export const createNotification = async (userId, content, type, itemId = null) => {
    try {
        const notification = await Notification.create({
            userId,
            content,
            type,
            itemId,
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Notification creation failed');
    }
};
