import express from "express";

import {
    addBlogStory,
    authAdmin, blogList, deleteStory, getBlogStory,
    getContactList,
    getCareerist,
    getInnovationList,
    getGrowthList,
    getImplementationList,
    getOptimizationList,
    getBlogComments,
    updateBlogStory,
    updatePrivacyPolicy,
    updateCookieSetting,


} from "../Controllers/Admin.controller.js";
import { Authentication } from "../Middlewares/Authentication.middleware.js";
import { Authorization } from "../Middlewares/Authorization.middleware.js";


const AdminRouter = express.Router();

/*  ------ login -------*/
AdminRouter.post("/admin_login", authAdmin);

/* ------sweets---------- */
AdminRouter.get('/get-blog-story/:id', Authentication, Authorization(["Admin"]), getBlogStory);
AdminRouter.post("/add-blog-story", Authentication, Authorization(["Admin"]), addBlogStory)
AdminRouter.get("/blog_list", Authentication, Authorization(["Admin"]), blogList)
AdminRouter.delete('/delete_story/:id', Authentication, Authorization(["Admin"]), deleteStory);
AdminRouter.patch('/update-blog-story', Authentication, Authorization(["Admin"]), updateBlogStory);

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

/*-------------------------- blog-comments -----------------------------*/
AdminRouter.get('/blog-comments', Authentication, Authorization(["Admin"]), getBlogComments);

/*-------------------------- privacy-policy -----------------------------*/
AdminRouter.post('/privacy-policy', Authentication, Authorization(["Admin"]), updatePrivacyPolicy);

/*-------------------------- cookie-setting -----------------------------*/
AdminRouter.post('/cookie-setting', Authentication, Authorization(["Admin"]), updateCookieSetting);

export default AdminRouter;