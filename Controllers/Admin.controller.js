import { Admin_Model } from "../Models/Admin.model.js";
import fs from 'fs';
import path from 'path';
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
export const updatestory = async (req, res) => {
    // 1. Multer को कंट्रोलर के अंदर चलाएं
    // blogImageUpload.single('image') एक मिडलवेयर फंक्शन बनाता है।
    // हम इसे मैन्युअल रूप से req और res के साथ कॉल करेंगे।
    // const upload = blogImg.single('image');

    // upload(req, res, async (err) => {
    //     // Multer से आने वाली किसी भी एरर को हैंडल करें
    //     if (err) {
    //         // जैसे, गलत फाइल टाइप या फाइल साइज लिमिट से ज्यादा
    //         console.error("Multer Error:", err.message);
    //         return res.status(400).json({ message: err.message });
    //     }
    blogImg.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        
        // अब, req.file और req.body उपलब्ध होंगे (अगर फाइल अपलोड हुई है तो)
        
        try {
            // 2. URL से ब्लॉग की ID और बॉडी से डेटा प्राप्त करें
            const { title, category, description,
                _id
             } = req.body;

            // 3. डेटाबेस में उस ID का ब्लॉग ढूंढें
            const blogToUpdate = await Blog_Model.findById({ _id });

            if (!blogToUpdate) {
                return res.status(404).json({ message: "Blog story not found." });
            }

            // 4. अगर कोई नई इमेज फाइल अपलोड हुई है (req.file मौजूद है), तो उसे अपडेट करें
            if (req.file) {
                // (Recommended) पुरानी इमेज को सर्वर से डिलीट करें
                if (blogToUpdate.image) {
                    const oldImagePath = path.join('uploads', blogToUpdate.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                // नई इमेज का नाम असाइन करें
                blogToUpdate.image = req.file.filename;
            }

            // 5. बाकी फ़ील्ड्स को नए डेटा से अपडेट करें
            if (title) blogToUpdate.title = title;
            if (category) blogToUpdate.category = category;
            if (description) blogToUpdate.description = description;

            // 6. अपडेट किए गए ब्लॉग को डेटाबेस में सेव करें
            const updatedBlog = await blogToUpdate.save();
            
            // 7. सफलता का संदेश भेजें
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
        const { title, category, description } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ error: "title,description and category are required." });
        }

        const blogData = new Blog_Model({
            image: "uploads/blog/" + req.file?.filename,
            title, category, description
        });
        await blogData.save();
        return res.json({ filename: "uploads/blog/" + req.file?.filename });
    });
}

// export const addBlogStory = async (req, res) => {
//     blogImg.single("image")(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ error: "Error uploading image" });
//         }

//         // Check if file was uploaded
//         if (!req.file) {
//             return res.status(400).json({ error: "Image is required." });
//         }

//         const { title, category, description } = req.body;

//         if (!title || !description || !category) {
//             return res.status(400).json({ error: "title,description and category are required." });
//         }

//         // Pura URL banayein
//         const imageUrl = `${req.protocol}://${req.get('host')}/uploads/blog/${req.file.filename}`;

//         const blogData = new Blog_Model({
//             image: imageUrl, // <-- SAHI (Pura URL save karein)
//             title, category, description
//         });

//         await blogData.save();

//         // Response mein bhi pura URL bhej sakte hain (optional)
//         return res.json({ 
//             message: "Blog story added successfully!",
//             filename: imageUrl 
//         });
//     });
// }
// export const blogList = async (req, res) => {
//     try {
//         const { page = 1 } = req.query;
//         const perPage = 10;

//         const blogData = await Blog_Model.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
//         const totalCount = await Blog_Model.countDocuments();
//         const totalPages = Math.ceil(totalCount / perPage);
//         let i = 0;
//         const updatedBlog = blogData?.map((blog) => {
//             i++;
//             return {
//                 ...blog.toObject(),
//                 orderId: i,
//             };
//         });
//         const paginationDetails = {
//             current_page: parseInt(page),
//             data: updatedBlog,
//             first_page_url: `${baseURL}api/admin?page=1`,
//             from: (page - 1) * perPage + 1,
//             last_page: totalPages,
//             last_page_url: `${baseURL}api/admin?page=${totalPages}`,
//             links: [
//                 {
//                     url: null,
//                     label: "&laquo; Previous",
//                     active: false,
//                 },
//                 {
//                     url: `${baseURL}api/admin?page=${page}`,
//                     label: page.toString(),
//                     active: true,
//                 },
//                 {
//                     url: null,
//                     label: "Next &raquo;",
//                     active: false,
//                 },
//             ],
//             next_page_url: null,
//             path: `${baseURL}api/admin`,
//             per_page: perPage,
//             prev_page_url: null,
//             to: (page - 1) * perPage + updatedBlog.length,
//             total: totalCount,
//         };
//         console.log("paginationDetails", paginationDetails);

//         return res.status(200).json({
//             blogData: paginationDetails,
//             page: page.toString(),
//             total_rows: totalCount,
//         });
//     }
//     catch (error) {
//         console.error("Error fetching sweetsData:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Something went wrong while fetching sweets",
//             error: error.message
//         });
//     }
// }
// Aapka updated blogList function
// controllers/adminController.js (Backend)

export const blogList = async (req, res) => {
    try {
        // ... aapka page, perPage wala code
        
        // Yahan apne backend ka URL daalein. Best hai ki isko .env file mein rakhein.
        const baseURL = process.env.BASE_URL || 'http://localhost:8000'; // PORT 8000 YA JO BHI AAPKA HAI

        const blogData = await Blog_Model.find().sort({ createdAt: -1 }) //... baaki ka code

        // YAHAN PAR DHYAN DEIN
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
        // ...
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

