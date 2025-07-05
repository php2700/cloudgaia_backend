import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blog'
    }

}, {
    timestamps: true
});

const Blog_comment_Model = mongoose.model("blog-comment", commentSchema);
export { Blog_comment_Model }