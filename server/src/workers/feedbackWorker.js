import client from "../config/redis";
import prisma from "../config/db";

export const startWorker = () => {
    setInterval(async () => {
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
            return
        }
        const feedbackId = data[0];
        const feedback = await prisma.feedback.findUnique({
            where: {
                id: feedbackId
            }
        });
        console.log("Processing : ", feedback.title);


        /* AI solves the issue */


        await prisma.feedback.update({
            where: {
                id: feedback.id
            },
            data: {
                status: "resolved"
            }
        });
        await client.zRem("feedbackQueue", data[0])
    },5000)
}


