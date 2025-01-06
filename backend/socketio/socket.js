import { Server } from 'socket.io';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';

let io;
let getReceiverSocketId;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'https://swapit-vhlk.onrender.com',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  let userSocketMap = new Map();

  getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('userOnline', (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} is now online`);
      io.emit('userStatusChanged', { userId, status: 'online' });
    });

    socket.on('joinChat', ({ conversationId }) => {
      if (conversationId && typeof conversationId === 'string') {
        socket.join(conversationId);
        console.log(`User joined chat room: ${conversationId}`);
      } else {
        console.error('Invalid conversationId during joinChat:', conversationId);
      }
    });

    socket.on('sendMessage', ({ conversationId, senderId, content }) => {
      // Create/save message logic here, or just broadcast
      io.to(conversationId).emit('receiveMessage', {
        _id: Date.now().toString(),
        senderId,
        content,
        createdAt: new Date(),
      });
    });

    socket.on('updateStatus', ({ conversationId, status }) => {
      io.to(conversationId).emit('statusUpdated', { status });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          io.emit('userStatusChanged', { userId, status: 'offline' });
          break;
        }
      }
    });
  });
};

export { io, getReceiverSocketId };
