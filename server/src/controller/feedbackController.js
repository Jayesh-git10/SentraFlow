import prisma from "../config/db";
import { addToQueue } from "../services/redisServices";

export const getFeedback = async(req,res)=>{
    try {
        const feedbacks = await prisma.feedback.findMany();
        res.json(feedbacks)
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

export const  createFeedback = async(req,res)=>{
    try {
        const {title , content , authorId} = req.body;
        const feedback = await prisma.feedback.create({
            data : {
                title , 
                content,
                emotion  : "neutral",
                emotionScore : 50,
                status : "pending",
                authorId
            }
        })
        
        //--------------Adding to queue---------
        await addToQueue(
            feedback.id,
            feedback.emotionScore
        );
        //--------------------------------------
        res.status(201).json({
            success : true,
            feedback

        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })      
    }
}