import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    role: { type: String, default: 'Admin' },
    email: String,
    password: String
});

const Admin_Model = mongoose.model('Admin', adminSchema);
export { Admin_Model }