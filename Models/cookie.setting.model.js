import mongoose from "mongoose";

const cookieSettingSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Cookie_setting_Model = mongoose.model("cookieSetting", cookieSettingSchema);
export { Cookie_setting_Model }