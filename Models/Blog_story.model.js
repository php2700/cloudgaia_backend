import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Blog_Model = mongoose.model("blog", blogSchema);
export { Blog_Model }