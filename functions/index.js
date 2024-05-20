const functions = require("firebase-functions");
const OpenAI = require("openai");
const tf = require('@tensorflow/tfjs');




const openai = new OpenAI({
    organization: "org-1j559n72fko7IZSsTd5gtAAm",
    apiKey: "sk-proj-f0JKWEzz3VTHLqxytFCLT3BlbkFJH01RqdeQYjOYQSDJAJYX",
  });

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




exports.predict = functions.https.onCall(async (data, context) => {
    try {
        let photo = data.input;
        //console.log(photo)
        //const pred = await predict(data)
        return {"data":photo}
  } catch (error) {
    console.error("Error in openAIHttpFunctionSec:", error);
    return {"data": error}   
    }
});



async function predict(data) {
    let model = await tf.loadLayersModel(
      "https://firebasestorage.googleapis.com/v0/b/pocketprotect-cc462.appspot.com/o/model.json?alt=media&token=6b9f7e91-be8c-4a40-956e-4b772482c14a"
    );
    let input = tf.tensor1d(data);
    input = input.expandDims(0);
    return model.predict(input).dataSync();
  }