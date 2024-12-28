import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socketio/socket.js";
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const { conversationId, textMessage } = req.body;

    if (!textMessage) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const receiver = conversation.participants.find(
      (participant) => participant._id.toString() !== senderId.toString()
    );
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId: receiver._id,
      itemId: conversation.itemId,
      content: textMessage,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(newMessage.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
      console.log('Message sent to receiver by controller');
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: 'messages',
      model: 'Message',
      populate: { path: 'senderId receiverId', model: 'User' }
  });
  console.log(conversation);

    if (!conversation) return res.status(200).json({ success: true, messages: [] });

    return res.status(200).json({ success: true, messages: conversation.messages, chat: conversation, participants: conversation.participants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const requestChat = async (req, res) => {
  try {
    const { itemId, sellerId, buyerId, participants } = req.body;

    // Check for existing conversation
    const existingConversation = await Conversation.findOne({
      itemId,
      'participants._id': { $all: [buyerId, sellerId] }
    });

    if (existingConversation) {
      return res.status(409).json({ 
        message: 'Conversation already exists',
        conversationId: existingConversation._id 
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants,
      itemId,
      messages: []
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Error creating request' });
  }
};

export const getReceivedMessages = async (req, res) => {
  try {
    const userId = req.id;
    const conversations = await Conversation.find({
      'participants': {
        $elemMatch: {
          _id: userId,
          role: 'seller'  // Changed from 'receiver' to 'seller'
        }
      }
    })
    .populate('participants._id', 'username profileImage')
    .populate({
      path: 'messages',
      populate: {
        path: 'senderId',
        select: 'username profileImage'
      }
    })
    .populate('itemId', 'title images')
    .sort({ updatedAt: -1 });

    const receivedMessages = conversations.map(conv => {
      const buyer = conv.participants.find(
        p => p._id._id.toString() !== userId && p.role === 'buyer'
      );

      return {
        _id: conv._id,
        user: buyer?._id.username || 'Unknown User',
        message: conv.messages[conv.messages.length - 1]?.content || "Started a conversation",
        avatar: buyer?._id.profileImage || '/default-avatar.png',
        time: conv.updatedAt,
        itemTitle: conv.itemId?.title || 'Unknown Item',
        role: 'seller',
        status: conv.status
      };
    });

    res.status(200).json(receivedMessages);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    res.status(500).json({ message: 'Error fetching received messages' });
  }
};

export const getSentMessages = async (req, res) => {
  try {
    const userId = req.id;
    const conversations = await Conversation.find({
      'participants': {
        $elemMatch: {
          _id: userId,
          role: 'buyer'  // Changed from 'sender' to 'buyer'
        }
      }
    })
    .populate('participants._id', 'username profileImage')
    .populate({
      path: 'messages',
      populate: {
        path: 'senderId',
        select: 'username profileImage'
      }
    })
    .populate('itemId', 'title images')
    .sort({ updatedAt: -1 });

    const sentMessages = conversations.map(conv => {
      const seller = conv.participants.find(
        p => p._id._id.toString() !== userId && p.role === 'seller'
      );

      return {
        _id: conv._id,
        user: seller?._id.username || 'Unknown User',
        message: conv.messages[conv.messages.length - 1]?.content || "Started a conversation",
        avatar: seller?._id.profileImage || '/default-avatar.png',
        time: conv.updatedAt,
        itemTitle: conv.itemId?.title || 'Unknown Item',
        role: 'buyer',
        status: conv.status
      };
    });

    res.status(200).json(sentMessages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ message: 'Error fetching sent messages' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params; // Conversation ID
    const conversation = await Conversation.findById(id)
      .populate('messages')
      .populate('participants._id', 'username profileImage')
      .populate('itemId', 'title images');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
};

export const updateConversationStatus = async (req, res) => {
  try {
    const { conversationId, status } = req.body;
    
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { status },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (status === 'accepted') {
      await Item.findByIdAndUpdate(
        conversation.itemId._id,
        { status: 'swapped' }
      );
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({ message: 'Error updating conversation status' });
  }
};

export const rateSeller = async (req, res) => {
  try {
    const { sellerId, rating, itemId } = req.body;
    const buyerId = req.id;

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    seller.sellerRatings.push({ fromUser: buyerId, rating, itemId });


    // Calculate new average rating
    const avg = seller.sellerRatings.reduce((acc, curr) => acc + curr.rating, 0) / 
               seller.sellerRatings.length;
    
    seller.ratings = Math.round(avg * 10) / 10;
    await seller.save();

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ message: 'Error rating seller' });
  }
};
