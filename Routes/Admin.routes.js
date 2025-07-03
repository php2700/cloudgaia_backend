import express from "express";

import {
    addBlogStory,
    authAdmin, blogList, deleteStory, updatestory, getBlogStoryById, getBlogStory,
    getContactList,
    getCareerist,
    getInnovationList,
    getGrowthList,
    getImplementationList,
    getOptimizationList
} from "../Controllers/Admin.controller.js";
import { Authentication } from "../Middlewares/Authentication.middleware.js";
import { Authorization } from "../Middlewares/Authorization.middleware.js";


const AdminRouter = express.Router();

/*  ------ login -------*/
AdminRouter.post("/admin_login", authAdmin);

/* ------sweets---------- */
AdminRouter.post("/add-blog-story", Authentication, Authorization(["Admin"]), addBlogStory)
AdminRouter.get("/blog_list", Authentication, Authorization(["Admin"]), blogList)
// AdminRouter.patch("/update_sweets", Authentication, Authorization(["Admin"]), updateSweets)
AdminRouter.delete('/delete_story/:id', Authentication, Authorization(["Admin"]), deleteStory);

// AdminRouter.patch('/update_sweets', Authentication, Authorization(["Admin"]), updateSweet);
AdminRouter.get('/get-blog-story/:id', Authentication, Authorization(["Admin"]), getBlogStory);


/*-------------------------- contact -------------------*/
AdminRouter.get('/contact-list', Authentication, Authorization(["Admin"]), getContactList);

/*-------------------------- career -----------------------------*/
AdminRouter.get('/career-list', Authentication, Authorization(["Admin"]), getCareerist);

/*-------------------------- innovation -------------------*/
AdminRouter.get('/innovation-list', Authentication, Authorization(["Admin"]), getInnovationList);

/*-------------------------- growth -----------------------------*/
AdminRouter.get('/growth-list', Authentication, Authorization(["Admin"]), getGrowthList);

/*-------------------------- implementation -------------------*/
AdminRouter.get('/implementation-list', Authentication, Authorization(["Admin"]), getImplementationList);

/*-------------------------- optimization -----------------------------*/
AdminRouter.get('/optimization-list', Authentication, Authorization(["Admin"]), getOptimizationList);







export default AdminRouter;