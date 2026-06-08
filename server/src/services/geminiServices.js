import { ai } from "../config/gemini"

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