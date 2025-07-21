import mongoose from "mongoose";

const cloudImplementatiom = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Cloud_Model = mongoose.model("cloudImplement", cloudImplementatiom);
export { Cloud_Model }