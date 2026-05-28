import express from "express";
import prisma from "../config/db.js";

const userRouter = express.Router();

userRouter.post("/", async (req, res) => {

    try {

        const user = await prisma.user.create({
            data: {
                name: "Jayesh",
                email: "jayesh@gmail.com"
            }
        });

        res.json(user);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

export default userRouter;