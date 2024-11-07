import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import collegeRoutes from './routes/college.routes.js';
import itemRoutes from './routes/item.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import chatRoutes from './routes/chat.routes.js';
import Message from './models/message.model.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.CLIENT_URL, // Replace with frontend URL if necessary
//         methods: ["GET", "POST"]
//     }
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectMongoDB();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a chat room (same as before)
    socket.on('joinChat', ({ buyerId, sellerId, itemId }) => {
        const chatRoom = `${itemId}-${buyerId}-${sellerId}`;
        socket.join(chatRoom);
        console.log(`User joined chat room: ${chatRoom}`);
        io.to(chatRoom).emit('notification', { message: 'You have joined the chat!' });
    });

    // Listen for incoming messages and save them to the database
    socket.on('message', async ({ roomId, senderId, content }) => {
        // Get the receiverId from the roomId (assuming that the room contains buyerId and sellerId)
        const [itemId, buyerId, sellerId] = roomId.split('-');
        const receiverId = senderId === buyerId ? sellerId : buyerId; // The receiver is the other user

        // Create a new message and save it to the database
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            itemId,
        });

        try {
            await newMessage.save(); // Save the message to the database
            console.log(`Message saved to the database: ${content}`);

            // Broadcast the message to the room
            io.to(roomId).emit('receiveMessage', { senderId, content });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Update purchase status (approve/reject)
    socket.on('updatePurchaseStatus', ({ roomId, status }) => {
        io.to(roomId).emit('purchaseStatusUpdated', { status });
        console.log(`Purchase status updated in room ${roomId} to: ${status}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

app.use("/api", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    
});