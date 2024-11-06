import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import collegeRoutes from './routes/college.routes.js';
import itemRoutes from './routes/item.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectMongoDB();
});