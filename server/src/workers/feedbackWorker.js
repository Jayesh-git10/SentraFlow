import client from "../config/redis.js";
import prisma from "../config/db.js";
import { solveIssue } from "../services/geminiServices.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const startWorker = async () => {
    while(true){
        const data = await client.zRange(
            "feedbackQueue",
            0,
            0,
            {
                REV: true
            }
        )
        if (data.length === 0) {
            console.log("Queue Empty");
            await sleep(5000);
            continue
        }
        const feedbackId = data[0];
        await client.zRem("feedbackQueue", data[0])
        const feedback = await prisma.feedback.findUnique({
            where: {
                id: feedbackId
            }
        });
        
        try {
            console.log("Processing : ", feedback.title);

            /* AI solves the issue */
            const content = feedback.content;
            const solution = await solveIssue(content);
            console.log(solution);   
            await prisma.feedback.update({
                where: {
                    id: feedback.id
                },
                data: {
                    status: "resolved",
                    aiReply: solution
                }
            });
        } catch (error) {
            console.error("Error processing feedback in worker:", error.message);
            try {
                await prisma.feedback.update({
                    where: {
                        id: feedback.id
                    },
                    data: {
                        status: "failed",
                        aiReply: `AI Generation Failed: ${error.message}`
                    }
                });
            } catch (dbError) {
                console.error("Failed to update error status in DB:", dbError.message);
            }
        }
        
    }
}
