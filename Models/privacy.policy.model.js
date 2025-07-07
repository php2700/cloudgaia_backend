import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema(
    {
        privacyPolicy: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Privacy_Policy_Model = mongoose.model("privacyPolicy", privacyPolicySchema);
export { Privacy_Policy_Model }