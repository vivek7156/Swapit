import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    images: [String], // Array of image URLs
    collegeId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College', 
        required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        equired: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
