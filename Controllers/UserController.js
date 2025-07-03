import { Blog_Model } from "../Models/Blog_story.model.js";
import { Carreer_Model } from "../Models/career.model.js";
import { Contact_Model } from "../Models/contact.model.js";
import { Growth_Model } from "../Models/growth.model.js";
import { Implementation_Model } from "../Models/implementation.model.js";
import { Innovation_Model } from "../Models/innnovation.model.js";
import { Optimization_Model } from "../Models/optimization.model.js";

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