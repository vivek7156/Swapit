import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import College from "../models/college.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, email, password, collegeId } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}
        if(!username || !email || !password || !collegeId) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
        return res.status(400).json({ message: 'User already exists' });
        }

        const college = await College.findById(collegeId);
        if (!college) {
          return res.status(404).json({ message: "College not found" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters' });
        }
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
        username,
        email,
        password: hashedPassword,
        college: college._id,
        });
        if(user) {
            generateTokenAndSetCookie(user._id, res);
            await user.save();
            res.status(201).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                college: user.college,
            });
        } else {
            return res.status(400).json({ message: 'User could not be created' });
        }
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with user data
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
        });
    } catch (error) {
        console.error("Login error:", error); // Log the detailed error
        res.status(500).json({ message: 'Server error' });
    }
};
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 15 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout error:", error); // Log the detailed error
        res.status(500).json({ message: 'Server error' });
    }
};
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('college');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error); // Log the detailed error
        res.status(500).json({ message: 'Server error' });
    }
};