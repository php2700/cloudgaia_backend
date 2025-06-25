import { Admin_Model } from "../Models/Admin.model.js";
import jwt from 'jsonwebtoken'
import {   blogImg} from "../Config/imageupload.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { Sweets_Model } from "../Models/sweets.model.js";
import { Blog_Model } from "../Models/Blog_story.model.js";

dotenv.config();
const baseURL = process.env.BASE_URL;

export const authAdmin = async (req, res) => {
    const { email, password } = req.body;
    const userdata = await Admin_Model.findOne({ email: email });
    if (!userdata) {
        return res.status(400).json({
            message: "Admin Not Found",
            status: false,
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, userdata?.password);

    if (!isPasswordMatch) {
        res.status(400).json({
            message: "Invalid Password ",
            status: false,
        });
        return;
    }

    const token = jwt.sign({ _id: userdata._id, role: userdata.role }, process.env.JSON_SECRET, { expiresIn: "7d" });
    return res.json({
        userdata,
        token,
        status: true,
    });
}

export const addBlogStory = async (req, res) => {
    blogImg.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        const { title, category, description } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ error: "title,description and category are required." });
        }

        const blogData = new Blog_Model({
            image: "blog/" + req.file?.filename,
            title, category, description
        });
        await blogData.save();
        return res.json({ filename: "blog/" + req.file?.filename });
    });
}

export const blogList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const blogData = await Blog_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Blog_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedBlog = blogData?.map((blog) => {
            i++;
            return {
                ...blog.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedBlog,
            first_page_url: `${baseURL}api/admin?page=1`,
            from: (page - 1) * perPage + 1,
            last_page: totalPages,
            last_page_url: `${baseURL}api/admin?page=${totalPages}`,
            links: [
                {
                    url: null,
                    label: "&laquo; Previous",
                    active: false,
                },
                {
                    url: `${baseURL}api/admin?page=${page}`,
                    label: page.toString(),
                    active: true,
                },
                {
                    url: null,
                    label: "Next &raquo;",
                    active: false,
                },
            ],
            next_page_url: null,
            path: `${baseURL}api/admin`,
            per_page: perPage,
            prev_page_url: null,
            to: (page - 1) * perPage + updatedBlog.length,
            total: totalCount,
        };

        return res.status(200).json({
            blogData: paginationDetails,
            page: page.toString(),
            total_rows: totalCount,
        });
    }
    catch (error) {
        console.error("Error fetching sweetsData:", error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong while fetching sweets",
            error: error.message
        });
    }
}

export const updateSweets = async (req, res) => {
    await sweets.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        // const { _id, name, amount, category, description } = req.body;

        const { _id, name, amount, category, description, isSweet, isWedding, isBestSeller } = req.body;

        const existingSweet = await Sweets_Model.findById(_id);
        if (!existingSweet) {
            return res.status(404).json({ error: "Sweet not found" });
        }

        const updatedData = {
            name,
            amount,
            category,
            description
        };
        if (isSweet) {
            updatedData.isSweet = (isSweet == 'true') ? true : false
        }
        if (isWedding) {
            updatedData.isWedding = (isWedding == 'true') ? true : false
        }
        if (isBestSeller) {
            updatedData.isBestSeller = (isBestSeller == 'true') ? true : false
        }

        if (req?.file) {
            updatedData.image = "sweets/" + req.file?.filename
        }
        await Sweets_Model.findByIdAndUpdate(_id,
            updatedData
        )
        return res.json({ message: "data_updated" });
    });
}

export const DeleteDecoration = async (req, res) => {
    const { id } = req?.params;
    try {
        await Decoration_Model.findByIdAndDelete(id);
        return res.status(200).json({
            status: true,
            message: 'decoration delete successflly',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "decoration id not found",
            error: error.message
        });
    }
}

