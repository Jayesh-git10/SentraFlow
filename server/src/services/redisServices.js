import client from "../config/redis.js";

export const addToQueue = async(
    feedbackId,
    emotionScore
)=>{
    await client.zAdd("feedbackQueue",{
        score : emotionScore,
        value : feedbackId
    })
    console.log("Send to redis")
}

