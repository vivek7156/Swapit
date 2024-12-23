import Item from '../models/item.model.js';
import College from '../models/college.model.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/user.model.js';
import fs from 'fs';
import { createNotification } from '../controllers/notification.controller.js';

export const createItem = async (req, res) => {
    try {
        const { title, description, price, category, collegeId } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'title required' });
        }
        if (!description) {
            return res.status(400).json({ message: 'description required' });
        }
        if (!price) {
            return res.status(400).json({ message: 'price required' });
        }
        if (!category) {
            return res.status(400).json({ message: 'category required' });
        }
        if (!collegeId) {
            return res.status(400).json({ message: 'collegeId required' });
        }
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Upload images to Cloudinary
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Upload the image to Cloudinary
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'items', // Optional: specify a folder in Cloudinary
                });
                uploadedImages.push(result.secure_url);

                // Remove the file from the server after uploading
                fs.unlinkSync(file.path);
            }
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

export const getItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 }).populate('createdBy', 'username profileImage').populate('collegeId', 'name');
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching items' });
    }
};


// Get all items in a specific college
export const getItemsByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const items = await Item.find({ college: collegeId }).sort({ createdAt: -1 });
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



export const updateItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const { title, description, price, category, existingImages } = req.body;
      const userId = req.user._id;
      const uploadedImages = [];
  
      // Upload new images
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'items',
          });
          uploadedImages.push(result.secure_url);
          fs.unlinkSync(file.path);
        }
      }
  
      // Parse existing images
      let existingImagesArray = [];
      if (existingImages) {
        existingImagesArray = JSON.parse(existingImages);
      }
  
      // Combine existing and new images
      const images = [...existingImagesArray, ...uploadedImages];
  
      const item = await Item.findOneAndUpdate(
        { _id: itemId, createdBy: userId },
        { title, description, price, category, images },
        { new: true }
      );
  
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      const content = `Your item "${title}" has been updated successfully.`;
      await createNotification(userId, content, 'item_update', item._id);
  
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating item' });
    }
  };

export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user._id;

        // Find and delete the item
        const item = await Item.findOneAndDelete({ _id: itemId, createdBy: userId });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Find the user and remove the item ID from their listings
        const user = await User.findById(userId);
        if (user) {
            user.listings = user.listings.filter(listingId => listingId.toString() !== itemId);
            await user.save();
        }

        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting item' });
    }
};
export const searchItems = async (req, res) => {
    try {
        const { query, minPrice, maxPrice, category, collegeId, location } = req.query;

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
        if (location) {
            const matchingColleges = await College.find({
                location: { $regex: location, $options: 'i' }
            }).select('_id');
            const collegeIds = matchingColleges.map(college => college._id);
            filter.collegeId = { $in: collegeIds }; // Filter items by these college IDs
        }

        // Fetch items matching the filter
        const items = await Item.find(filter).populate('createdBy', 'username profileImage').populate('collegeId', 'name location');;

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};