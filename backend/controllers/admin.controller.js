import Item from '../models/item.model.js';
import User from '../models/user.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId, isAdmin } = req.body;

        // Ensure required fields are present
        if (!userId || typeof isAdmin !== 'boolean') {
            return res.status(400).json({ message: 'Invalid input. userId and isAdmin are required.' });
        }

        // Update the user's isAdmin role
        const user = await User.findByIdAndUpdate(
            userId,
            { isAdmin },
            { new: true }
        );

        if (user) {
            res.status(200).json({ message: 'User role updated successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const { collegeId, category } = req.query;
        let filter = {};
        if (collegeId) filter.collegeId = collegeId;
        if (category) filter.category = category;

        const items = await Item.find(filter);
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
