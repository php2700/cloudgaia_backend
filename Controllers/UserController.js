import { Blog_comment_Model } from "../Models/blog_comment.model.js";
import { Blog_Model } from "../Models/Blog_story.model.js";
import { Carreer_Model } from "../Models/career.model.js";
import { Cloud_Model } from "../Models/cloud.model.js";
import { Contact_Model } from "../Models/contact.model.js";
import { Cookie_setting_Model } from "../Models/cookie.setting.model.js";
import { Growth_Model } from "../Models/growth.model.js";
import { Implementation_Model } from "../Models/implementation.model.js";
import { Innovation_Model } from "../Models/innnovation.model.js";
import { Non_profit_Model } from "../Models/Non-profit.model.js";
import { Optimization_Model } from "../Models/optimization.model.js";
import { Privacy_Policy_Model } from "../Models/privacy.policy.model.js";

export const addContactDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, company, country, message, agreeToEmails } = req.body;
        if (!firstName || !lastName || !email || !company || !message || !country) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message and country are required." });
        }

        const contactData = new Contact_Model({
            firstName, lastName, email, company, country, message, agreeToEmails
        });
        await contactData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}

export const registerCareer = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, country, mobile, area, linkedin, message } = req.body;
        if (!firstName || !lastName || !email || !mobile || !area || !linkedin || !message || !country) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message and country are required." });
        }

        const careerData = new Carreer_Model({
            firstName, lastName, email, country, mobile, area, linkedin, message
        });
        await careerData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}

export const Innovation = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, company, country, message, isAgree } = req.body;
        if (!firstName || !lastName || !email || !country || !message || !company) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message  are required." });
        }

        const innovationData = new Innovation_Model({
            firstName, lastName, email, company, country, message, isAgree
        });
        await innovationData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}

export const growth = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, company, country, message, isAgree } = req.body;
        if (!firstName || !lastName || !email || !country || !message || !company) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message  are required." });
        }

        const innovationData = new Growth_Model({
            firstName, lastName, email, company, country, message, isAgree
        });
        await innovationData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
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
        console.log("paginationDetails", paginationDetails);

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



export const Implementation = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, company, country, message, isAgree } = req.body;
        if (!firstName || !lastName || !email || !country || !message || !company) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message  are required." });
        }

        const innovationData = new Implementation_Model({
            firstName, lastName, email, company, country, message, isAgree
        });
        await innovationData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}



export const optimization = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, company, country, message, isAgree } = req.body;
        if (!firstName || !lastName || !email || !country || !message || !company) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message  are required." });
        }

        const innovationData = new Optimization_Model({
            firstName, lastName, email, company, country, message, isAgree
        });
        await innovationData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}


export const getBlogList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 6;
        const category = req.query.category;
        const filter = {};
        if (category) {
            filter.category = category;
        }

        const blogData = await Blog_Model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
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
            from: (page - 1) * perPage + 1,
            per_page: perPage,
            to: (page - 1) * perPage + updatedBlog.length,
            total: totalCount,
            totalPages: totalPages
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

export const getBlogDetail = async (req, res) => {
    try {
        const blogId = req.params._id;
        console.log(blogId, "aaaaaaaaaaaaaaaaaaaaaaa")
        const blogData = await Blog_Model.findOne({ _id: blogId });
        if (blogData) {
            return res.status(200).json({ success: true, blogDetail: blogData })
        }
        return res.status(500).json({
            status: false,
            message: "blog data not found",
            error: error.message
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong while fetching blog data",
            error: error.message
        });
    }
}

export const comment = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { name, comment, blogId } = req.body;
        if (!name || !comment) {
            return res.status(400).json({ error: "name,comment  are required." });
        }
        const commentData = new Blog_comment_Model({
            name, comment, blogId,
        });
        await commentData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}

export const commentList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const _id = req.params._id;

        const blogCommentData = await Blog_comment_Model.find({ blogId: _id }).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
        const totalCount = await Blog_comment_Model.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        let i = 0;
        const updatedBlogComment = blogCommentData?.map((blog) => {
            i++;
            return {
                ...blog.toObject(),
                orderId: i,
            };
        });
        const paginationDetails = {
            current_page: parseInt(page),
            data: updatedBlogComment,
            from: (page - 1) * perPage + 1,
            per_page: perPage,
            to: (page - 1) * perPage + updatedBlogComment.length,
            total: totalCount,
            totalPages: totalPages
        };

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

export const getPrivacyPolicy = async (req, res) => {
    try {
        const isPrivacyPolicy = await Privacy_Policy_Model.findOne();
        if (!isPrivacyPolicy) {
            return res.status(404).json({ message: "privacy policy not found." });
        }
        return res.status(200).json({
            privacyPolicy: isPrivacyPolicy
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getCookieSetting = async (req, res) => {
    try {
        const isCookieSetting = await Cookie_setting_Model.findOne();
        if (!isCookieSetting) {
            return res.status(404).json({ message: "privacy policy not found." });
        }
        return res.status(200).json({
            cookiesettingData: isCookieSetting
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const CloudImplement = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, country, company, message } = req.body;
        if (!firstName || !lastName || !email  || !message || !country) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message and country are required." });
        }

        const careerData = new Cloud_Model({
          firstName, lastName, email, country, company, message
        });
        await careerData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}

export const nonProfit = async (req, res) => {
    try {
        console.log(req?.body, 'ff')
        const { firstName, lastName, email, country, company, message } = req.body;
        if (!firstName || !lastName || !email  || !message || !country) {
            return res.status(400).json({ error: "firstName,lastName,email,company,message and country are required." });
        }

        const careerData = new Non_profit_Model({
firstName, lastName, email, country, company, message        });
        await careerData.save();
        return res.status(200).json({ success: true, message: 'sucessfully_add' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'something_went_wrong' })
    }
}