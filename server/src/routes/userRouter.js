import express from "express";
import prisma from "../config/db.js";
import { userLogin, userRegister } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/", userRegister);
userRouter.post("/login" , userLogin)

export default userRouter;