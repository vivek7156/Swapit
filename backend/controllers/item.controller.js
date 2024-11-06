import Item from '../models/item.model.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/user.model.js';
import { createNotification } from '../controllers/notification.controller.js';

export const createItem = async (req, res) => {
    try {
        const { title, description, price, category, collegeId } = req.body;
        let {images} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        // Upload images to Cloudinary
        const uploadedImages = [];
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'items', // Optional: you can specify a folder in Cloudinary
            });
            uploadedImages.push(result.secure_url);
        }
        if(!images || !title || !description || !price || !category || !collegeId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newItem = new Item({
            title,
            description,
            price,
            category,
            images: uploadedImages, // Use the URLs from Cloudinary
            collegeId,
            createdBy: req.user._id
        });
        const content = `Your item "${title}" has been listed successfully.`;
        await createNotification(userId, content, 'item_update', newItem._id);
        await newItem.save();
        await User.findByIdAndUpdate(req.user._id, {
            $push: { listings: newItem._id }
        }, { new: true });

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating item' });
    }
};


// Get all items in a specific college
export const getItemsByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const items = await Item.find({ collegeId });
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching items' });
    }
};

// Get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId).populate('createdBy', 'name');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching item' });
    }
};

// Update an item listing
export const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { title, description, price } = req.body;
        const userId = req.user._id;
        const item = await Item.findOneAndUpdate(
            { _id: itemId, createdBy: userId },
            { title, description, price },
            { new: true }
        );
        const content = `Your item "${title}" has been updated successfully.`;
        await createNotification(userId, content, 'item_update', item._id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating item' });
    }
};

// Delete an item listing
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting item' });
    }
};

export const searchItems = async (req, res) => {
    try {
        const { query, minPrice, maxPrice, category, collegeId } = req.query;

        // Build the search filter
        let filter = {};

        if (query) {
            filter.title = { $regex: query, $options: 'i' }; // case-insensitive search for title
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' }; // case-insensitive search for category
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (collegeId) {
            filter.collegeId = collegeId; // Make sure it's the exact collegeId
        }

        // Fetch items matching the filter
        const items = await Item.find(filter);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};