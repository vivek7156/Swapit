import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
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
        type: Schema.Types.ObjectId,
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
      listings: [
        {
          type: Schema.Types.ObjectId,
          ref: "Listing", // Reference to listings created by the user
        },
      ],
    },
    {
      timestamps: true,
    }
  );
  
const User = mongoose.model("User", UserSchema);
export default User;