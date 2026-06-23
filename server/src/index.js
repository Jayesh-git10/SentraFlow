import express from "express";
import prisma from "./config/db.js";
import router from "./routes/feedbackRoutes.js";
import userRouter from "./routes/userRouter.js";
import { startWorker } from "./workers/feedbackWorker.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

startWorker();

app.get('/' , (req,res)=>{
    res.send("Hello world")
})

app.get('/db-check', async (req, res) => {
    try {
        const models = Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_'));
        res.json({ status: "ok", prismaLoaded: true, models });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/feedback',router)
app.use('/api/user',userRouter)

app.listen(PORT , ()=>console.log(`App Listen on PORT ${PORT}`))