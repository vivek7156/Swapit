import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();
const app = express();

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    connectMongoDB();
});