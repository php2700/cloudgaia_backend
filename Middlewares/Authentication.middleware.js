import jwt from 'jsonwebtoken'
import { Admin_Model } from '../Models/Admin.model.js';
import dotenv from 'dotenv'
dotenv.config();
const JWT_SECRET = process.env.JSON_SECRET;

const Authentication = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) {
            console.log(`Token Not Found - URL : ${req.url}`);
            return res.status(403).json({ Message: "Un-authorized. Token Not Found" });
        }
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(400).json({ Message: err.message, status: "error" })
            req.headers.userID = decoded._id;
            req.headers.role = decoded.role;
            let user;

            user = await Admin_Model.findById(decoded._id).exec();

            if (decoded.role === "user") {
                if (!user) {
                    return res.status(404).json({ Message: "User not found", status: "error" });
                }
                if (user.termination) {
                    return res.status(403).json({ Message: "You have been terminated by an admin" });
                }

                if (user.deactive_status) {
                    return res.status(403).json({ Message: "You have been deactivated by an admin" });
                }
            }
            next()
        })
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong while authorizing user", err: error });
    }
}

export { Authentication }
