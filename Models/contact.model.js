import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
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
    agreeToEmails: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

const Contact_Model = mongoose.model("contact", contactSchema);
export { Contact_Model }