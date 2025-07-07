// 
import express from "express";
import { addContactDetails, blogList, comment, commentList, getBlogDetail, getBlogList, getCookieSetting, getPrivacyPolicy, growth, Implementation, Innovation, optimization, registerCareer } from "../Controllers/UserController.js";
const UserRouter = express.Router();

UserRouter.post("/contact", addContactDetails)

UserRouter.post("/career", registerCareer)

UserRouter.post("/innovation", Innovation)

UserRouter.post("/growth", growth)

UserRouter.post("/implementation", Implementation)

UserRouter.post("/optimization", optimization)

/*------------------- blog-list -------------*/
UserRouter.get("/blog-list", getBlogList)
UserRouter.get("/blog-detail/:_id", getBlogDetail)


/*-------------------blog- comment -------------*/
UserRouter.post("/blog-comment", comment)
UserRouter.get("/comment-list/:_id", commentList)

/*-----------privacy-policy------------*/
UserRouter.get('/privacy-policy', getPrivacyPolicy);

/*-----------cookie setting------------*/
UserRouter.get('/cookie-setting', getCookieSetting);


export default UserRouter;
