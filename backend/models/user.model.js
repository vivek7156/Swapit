import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
      name: {
        type: String,
        trim: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College", // Reference to the college the user belongs to
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      bio: {
        type: String,
        maxlength: 300,
        default: "", // User bio
      },
      link: {
        type: String,
        default: "",
      },
      profileImage: {
        type: String,
        default: "", // URL to profile image
      },
      ratings: {
        type: Number,
        default: 0,
      },
      sellerRatings: [{
        fromUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        }
      }],
      listings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item", // Reference to listings created by the user
        },
      ],
      watchlist: [
        { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Item' 
        },  // Adding watchlist field
      ],
      isAdmin: { type: Boolean, default: false },
    },
    {
      timestamps: true,
    }
  );
  
const User = mongoose.model("User", UserSchema);
export default User;