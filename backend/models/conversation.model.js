import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
      _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
      },
      role: {
      type: String,
      enum: ['seller', 'buyer'],
      required: true
      }
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }],
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
