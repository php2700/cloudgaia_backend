import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, // assuming image is always needed
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Sweets_Model = mongoose.model("about", aboutSchema);
export { Sweets_Model }