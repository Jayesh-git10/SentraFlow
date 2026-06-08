import prisma from "../config/db";
import { calculateEmotionScore } from "../services/geminiServices";
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

        //-------- AI Generates status and emotionScore------
        const {emotion, emotionScore} = await calculateEmotionScore(content)
        //--------
        const feedback = await prisma.feedback.create({
            data : {
                title , 
                content,
                emotion  ,
                emotionScore ,
                status : "pending",
                authorId
            }
        })
        console.log(feedback.emotion , feedback.emotionScore);
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

