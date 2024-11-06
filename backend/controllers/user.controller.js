import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { username, name, email, currentpassword, newpassword, college, bio, link } = req.body;
    let { profileImage } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        if((!newpassword && currentpassword) || (newpassword && !currentpassword)){
            return res.status(400).json({ message: "Please provide both new password and current password" });
        }
        if(currentpassword && newpassword){
            const isMatch = await bcrypt.compare(currentpassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }
            if(newpassword.length < 6){
                return res.status(400).json({ message: "Password should be at least 6 characters" });
            }   
            const salt = await bcrypt.genSalt(10);
            // Hash the password
            const hashedPassword = await bcrypt.hash(newpassword, salt);
            user.password = hashedPassword
        }
        if(profileImage){
            if(user.profileImage){
                const publicId = user.profileImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImage);
            profileImage = uploadedResponse.secure_url;
        }
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.name = name || user.name;
        user.name = username || user.username;
        user.email = email || user.email;
        user.college = college || user.college;
        user.profileImage = profileImage || user.profileImage;

        user = await user.save();
        user.password = null;


        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserListings = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('listings');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addToWatchlist = async (req, res) => {
    try {
        const { itemId } = req.body;  // Assume we pass the itemId in the request body
        
        // Log the itemId to ensure we're getting the right data
        console.log('Item ID received:', itemId);

        // Check if the item exists
        const item = await Item.findById(itemId);
        if (!item) {
            console.error('Item not found with the given ID:', itemId);  // Log error
            return res.status(404).json({ message: 'Item not found' });
        }

        // Add the item to the user's watchlist
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchlist: itemId },  // $addToSet ensures no duplicates
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Item added to watchlist' });
    } catch (error) {
        console.error('Error adding item to watchlist:', error);  // Log the error
        res.status(500).json({ message: 'Error adding item to watchlist' });
    }
};

export const removeFromWatchlist = async (req, res) => {
    try {
        const { itemId } = req.body;
        
        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Remove the item from the user's watchlist
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { watchlist: itemId },  // $pull removes the item from the array
        });

        res.status(200).json({ message: 'Item removed from watchlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item from watchlist' });
    }
};

export const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('watchlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
};