import mongoose, { Schema } from "mongoose";

const CollegeSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      location: {
        type: String,
        required: true,
        trim: true,
      },
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "User", // Reference to users in the college
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  const College = mongoose.model("College", CollegeSchema);
  export default College;