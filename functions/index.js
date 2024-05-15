const functions = require("firebase-functions");
const OpenAI = require("openai");



exports.openAIHttpFunctionSec = functions.https.onCall(async (data, context) => {
    try {
        const quest = data.name;
        const openAPIResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": `${quest}`}],
            temperature: 0,
        });
        return {"data": openAPIResponse};
    } catch (error) {
        console.error("Error in openAIHttpFunctionSec:", error);
        throw new functions.https.HttpsError("internal", "An error occurred while processing your request.");
    }
});
