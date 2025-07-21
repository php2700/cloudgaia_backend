import mongoose from "mongoose";

const nonProfitSchema = new mongoose.Schema({
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

const Non_profit_Model = mongoose.model("nonProfit", nonProfitSchema);
export { Non_profit_Model }