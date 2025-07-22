import { Admin_Model } from "../Models/Admin.model.js";
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken'
import { blogImg } from "../Config/imageupload.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { Sweets_Model } from "../Models/sweets.model.js";
import { Blog_Model } from "../Models/Blog_story.model.js";
import { Contact_Model } from "../Models/contact.model.js";
import { Carreer_Model } from "../Models/career.model.js";
import { Innovation_Model } from "../Models/innnovation.model.js";
import { Growth_Model } from "../Models/growth.model.js";
import { Implementation_Model } from "../Models/implementation.model.js";
import { Optimization_Model } from "../Models/optimization.model.js";
import { Blog_comment_Model } from "../Models/blog_comment.model.js";
import { Privacy_Policy_Model } from "../Models/privacy.policy.model.js";
import { Cookie_setting_Model } from "../Models/cookie.setting.model.js";
import { Non_profit_Model } from "../Models/Non-profit.model.js";
import { Cloud_Model } from "../Models/cloud.model.js";
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
// Pehle se bane hue model ko import karein

// --- Naya function jo data fetch karega ---

/**
 * @description Get a single blog story by its ID
 * @route       GET /api/admin/get-blog-story/:id
 * @access      Private (Maan lete hain ki isko access karne ke liye login zaroori hai)
 */
export const getBlogStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        console.log("Fetching blog story with ID:", storyId);
        const story = await Blog_Model.findById(storyId);
        console.log("Fetching blog story with ID:", storyId);
        console.log("Fetched story:", story);


        if (!story) {
            return res.status(404).json({
                success: false,
                Message: 'Blog story not found with this ID'
            });
        }

        // 'story.image' mein ab poora URL hoga (e.g., "http://localhost:5001/uploads/blog/12345.jpg")
        // ise front-end seedhe <img src="..."> mein use kar sakta hai.
        res.status(200).json({
            success: true,
            data: story
        });

    } catch (error) {
        console.error("Error fetching blog story:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, Message: 'Invalid ID format' });
        }
        res.status(500).json({
            success: false,
            Message: 'Server error while fetching the story'
        });
    }
};

export const deleteStory = async (req, res) => {
    const { id } = req.params;
    try {
        const story = await Blog_Model.findByIdAndDelete(id);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getBlogStoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Invalid or missing ID" });
        }

        const blog = await Blog_Model.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog story not found" });
        }

        res.status(200).json({ message: "Success", data: blog });

    } catch (error) {
        console.error("Error fetching blog story:", error.message);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


export const addBlogStory = async (req, res) => {
    blogImg.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        const { title, category, description, content } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ error: "title,description and category are required." });
        }
        const blogData = new Blog_Model({
            image: "uploads/blog/" + req.file?.filename,
            title, category, description, content
        });
        await blogData.save();
        return res.json({ filename: "uploads/blog/" + req.file?.filename });
    });
}

export const updateBlogStory = async (req, res) => {
    blogImg.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        try {
            const { title, category, description, content,
                _id
            } = req.body;
            const blogToUpdate = await Blog_Model.findById({ _id });

            if (!blogToUpdate) {
                return res.status(404).json({ message: "Blog story not found." });
            }
            if (req.file) {
                if (blogToUpdate.image) {
                    const oldImagePath = path.join('uploads', blogToUpdate.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                blogToUpdate.image = "uploads/blog/" + req.file?.filename
            }
            if (title) blogToUpdate.title = title;
            if (category) blogToUpdate.category = category;
            if (description) blogToUpdate.description = description;
            if (content) blogToUpdate.content = content;
            const updatedBlog = await blogToUpdate.save();
            res.status(200).json({
                message: "Blog story updated successfully!",
                data: updatedBlog
            });

        } catch (error) {
            console.error("Update Story Error:", error);
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    });
};




export const blogList = async (req, res) => {
    try {
        const blogData = await Blog_Model.find().sort({ createdAt: -1 })

        const updatedBlog = blogData?.map((blog) => {
            return {
                ...blog.toObject(),
                // Kya aapne yeh line add ki hai?
                image: blog.image ? `${blog.image}` : null,
            };
        });

        const paginationDetails = {
            // ...
            data: updatedBlog, // Yahan 'updatedBlog' ka istemal karein
            // ...
        };

        return res.status(200).json({
            blogData: paginationDetails,
            // ...
        });

    } catch (error) {
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

export const getContactList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const contactData = await Contact_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Contact_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedContact = contactData?.map((contact) => {
            i++;
            return {
                ...contact.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedContact,
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
            to: (page - 1) * perPage + updatedContact.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            contactData: paginationDetails,
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


export const getCareerist = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const careerData = await Carreer_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Carreer_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedCareer = careerData?.map((career) => {
            i++;
            return {
                ...career.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedCareer,
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
            to: (page - 1) * perPage + updatedCareer.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            careerData: paginationDetails,
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

export const getInnovationList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const innovationData = await Innovation_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Innovation_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedInnovation = innovationData?.map((innovation) => {
            i++;
            return {
                ...innovation.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedInnovation,
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
            to: (page - 1) * perPage + updatedInnovation.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            InnovationData: paginationDetails,
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


export const getGrowthList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const growthData = await Growth_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Growth_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedGrowth = growthData?.map((growth) => {
            i++;
            return {
                ...growth.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedGrowth,
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
            to: (page - 1) * perPage + updatedGrowth.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            growthData: paginationDetails,
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

export const getImplementationList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const implementationData = await Implementation_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Implementation_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedImplementation = implementationData?.map((implementation) => {
            i++;
            return {
                ...implementation.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedImplementation,
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
            to: (page - 1) * perPage + updatedImplementation.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            implementationData: paginationDetails,
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

export const getOptimizationList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const optimizationData = await Optimization_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Optimization_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedOptimization = optimizationData?.map((growth) => {
            i++;
            return {
                ...growth.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedOptimization,
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
            to: (page - 1) * perPage + updatedOptimization.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            optimizationData: paginationDetails,
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


export const getBlogComments = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const blogCommentData = await Blog_comment_Model.find()
            .populate('blogId')
            .sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Blog_comment_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedBlogComment = blogCommentData?.map((growth) => {
            i++;
            return {
                ...growth.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedBlogComment,
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
            to: (page - 1) * perPage + updatedBlogComment.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            blogCommentData: paginationDetails,
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

export const updatePrivacyPolicy = async (req, res) => {
    try {
        const { privacyPolicy } = req.body;
        const isPrivacyPolicy = await Privacy_Policy_Model.findOne();
        if (!isPrivacyPolicy) {
            const newPolicy = new Privacy_Policy_Model({ privacyPolicy });
            await newPolicy.save();
            return res.status(201).json({
                message: "Privacy policy added successfully!",
            });
        }
        isPrivacyPolicy.privacyPolicy = privacyPolicy;
        await isPrivacyPolicy.save();
        return res.status(200).json({
            message: "privacy policy updated successfully!",
        });

    } catch (error) {
        console.error("Update  Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const updateCookieSetting = async (req, res) => {
    try {
        const { description } = req.body;
        const isCookieSetting = await Cookie_setting_Model.findOne();
        if (!isCookieSetting) {
            const newDescription = new Cookie_setting_Model({ description });
            await newDescription.save();
            return res.status(201).json({
                message: "cookie setting added successfully!",
            });
        }
        isCookieSetting.description = description;
        await isCookieSetting.save();
        return res.status(200).json({
            message: "cookie setting updated successfully!",
        });

    } catch (error) {
        console.error("Update  Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const getNonProfitList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const nonProftData = await Non_profit_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Non_profit_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedNonProfit = nonProftData?.map((nonProfit) => {
            i++;
            return {
                ...nonProfit.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedNonProfit,
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
            to: (page - 1) * perPage + updatedNonProfit.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            nonProfitData: paginationDetails,
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


export const getDoordashList = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const perPage = 10;

        const doordashData = await Cloud_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Cloud_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedDoordash = doordashData?.map((doordash) => {
            i++;
            return {
                ...doordash.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedDoordash,
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
            to: (page - 1) * perPage + updatedDoordash.length,
            total: totalCount,
        };
        console.log("paginationDetails", paginationDetails);

        return res.status(200).json({
            doordashData: paginationDetails,
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