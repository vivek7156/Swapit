import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['message', 'purchase_request', 'item_update'], 
        required: true 
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item', 
        required: false 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
    }
}, { timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
