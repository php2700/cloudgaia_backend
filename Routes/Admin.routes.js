import express from "express";

import {
    addBlogStory,
    authAdmin, blogList , deleteStory ,updatestory,getBlogStoryById,getBlogStory
} from "../Controllers/Admin.controller.js";
import { Authentication } from "../Middlewares/Authentication.middleware.js";
import { Authorization } from "../Middlewares/Authorization.middleware.js";
import { Admin } from "mongodb";




const AdminRouter = express.Router();

/*  ------ login -------*/
AdminRouter.post("/admin_login", authAdmin);

/* ------sweets---------- */
AdminRouter.post("/add-blog-story", Authentication, Authorization(["Admin"]), addBlogStory)
AdminRouter.get("/blog_list", Authentication, Authorization(["Admin"]), blogList)
// AdminRouter.patch("/update_sweets", Authentication, Authorization(["Admin"]), updateSweets)
AdminRouter.delete('/delete_story/:id', Authentication, Authorization(["Admin"]), deleteStory);
// AdminRouter.patch('/update_sweets', Authentication, Authorization(["Admin"]), uploads.single('image'), updateSweet);
// AdminRouter.patch('/update_sweets', Authentication, Authorization(["Admin"]), updateSweet);
AdminRouter.get('/get-blog-story/:id',Authentication, Authorization(["Admin"]), getBlogStory);
// AdminRouter.get('/get-blog-storye/:id', Authentication, Authorization(["Admin"]),updatestory);   





export default AdminRouter;