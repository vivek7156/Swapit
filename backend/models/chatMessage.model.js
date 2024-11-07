import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    requestId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PurchaseRequest', 
        required: true 
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
