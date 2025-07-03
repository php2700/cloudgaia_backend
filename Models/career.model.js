import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobile: {
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
    area: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Carreer_Model = mongoose.model("career", careerSchema);
export { Carreer_Model }