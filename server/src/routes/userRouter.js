import express from "express";
import prisma from "../config/db.js";
import { userLogin, userLogout, userRegister } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", userRegister);
userRouter.post("/login" , userLogin);
userRouter.post("/logout",userLogout);

export default userRouter;