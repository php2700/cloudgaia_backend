// 
import express from "express";
import { addContactDetails, blogList, CloudImplement, comment, commentList, getBlogDetail, getBlogList, getCookieSetting, getPrivacyPolicy, growth, Implementation, Innovation, nonProfit, optimization, registerCareer } from "../Controllers/UserController.js";
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

    // clood
UserRouter.post("/cloud", CloudImplement)


//non-profit
UserRouter.post("/non-profit", nonProfit)



export default UserRouter;
