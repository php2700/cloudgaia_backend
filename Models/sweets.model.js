import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Sweets_Model = mongoose.model("about", aboutSchema);
export { Sweets_Model }