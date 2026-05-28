import client from "../config/redis";

export const addToQueue = async(
    feedbackId,
    emotionScore
)=>{
    await client.zAdd("feedbackQueue",{
        id : feedbackId,
        score : emotionScore,
        value : feedbackId
    })
    console.log("Send to redis")
}