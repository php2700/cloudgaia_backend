import mongoose from "mongoose";

const implementationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    company: {
        type: String,
        required: true,
    },
    isAgree: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

const Implementation_Model = mongoose.model("implementation", implementationSchema);
export { Implementation_Model }