import { ai } from "../config/gemini.js"

export async function calculateEmotionScore(feedback) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        Analyze the following feedback and return only JSON.

        emotionScore must be an integer between 0 and 100 where:
        0 = extremely positive
        50 = neutral
        100 = extremely negative

        Feedback : "${feedback}"
        
        Example Structure only: 
        {
            "emotion" : "happy|neutral|angry|frustrated|sad",
            "emotionScore":90
        }
        `
    })

    const text = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    return JSON.parse(text)
}

export async function solveIssue(feedback) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Analyze the following customer feedback:

            Feedback: ${feedback}

            Your task:
            1. Understand the customer's issue.
            2. Suggest the best resolution.
            3. Write a polite response to the customer.

            Examples:
            - Torn cloth → Offer replacement or refund.
            - Wrong item delivered → Arrange exchange.
            - Delayed delivery → Apologize and provide an update.

            Return only the customer support reply.
        `
    })
    const text = response.text;
    return text;
}