// 
import express from "express";
import { addContactDetails, blogList, getBlogList, growth, Implementation, Innovation, optimization, registerCareer } from "../Controllers/UserController.js";
const UserRouter = express.Router();

UserRouter.post("/contact", addContactDetails)

UserRouter.post("/career", registerCareer)

UserRouter.post("/innovation", Innovation)

UserRouter.post("/growth", growth)

UserRouter.post("/implementation", Implementation)

UserRouter.post("/optimization", optimization)

/*------------------- blog-list -------------*/
UserRouter.get("/blog-list", getBlogList)


export default UserRouter;
