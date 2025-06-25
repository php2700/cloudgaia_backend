import express from "express";
import {
    addBlogStory,
    authAdmin, blogList, updateSweets,
} from "../Controllers/Admin.controller.js";
import { Authentication } from "../Middlewares/Authentication.middleware.js";
import { Authorization } from "../Middlewares/Authorization.middleware.js";


const AdminRouter = express.Router();

/*  ------ login -------*/
AdminRouter.post("/admin_login", authAdmin);

/* ------sweets---------- */
AdminRouter.post("/add-blog-story", Authentication, Authorization(["Admin"]), addBlogStory)
AdminRouter.get("/blog_list", Authentication, Authorization(["Admin"]), blogList)
AdminRouter.patch("/update_sweets", Authentication, Authorization(["Admin"]), updateSweets)



export default AdminRouter;