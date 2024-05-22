const functions = require("firebase-functions");
const OpenAI = require("openai");
const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');




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


exports.predict = functions
  .runWith({ timeoutSeconds: 300, memory: '2GB' })  // Increase timeout and memory allocation
  .https.onCall(async (data, context) => {
    try {
        const photo = data.input;
        console.log("Received input: ", photo);

        // Decode base64 encoded image string to a TensorFlow tensor
        const imageTensor = await decodeBase64ToTensor(photo);
        console.log("Image tensor shape: ", imageTensor.shape);

        // Load the model
        const modelUrl = "https://firebasestorage.googleapis.com/v0/b/pocketprotect-cc462.appspot.com/o/skincancer.json?alt=media&token=fd378918-7503-40c9-8aee-33bc9d61337d";
        const model = await tf.loadLayersModel(modelUrl);
        console.log("Model loaded successfully");

        // Preprocess the image tensor as necessary by your model
        const preprocessedImageTensor = preprocessImage(imageTensor);

        // Make prediction
        const prediction = await predict(model, preprocessedImageTensor);
        console.log("Prediction result: ", prediction);

        // Return prediction result
        return { prediction };
    } catch (error) {
        console.error("Error in predict function:", error);
        return { error: error.message };
    }
});

async function decodeBase64ToTensor(base64String) {
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const { data, info } = await sharp(buffer)
            .resize(224, 224)
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { width, height, channels } = info;
        if (width !== 224 || height !== 224 || channels !== 3) {
            throw new Error('Image is not the correct size or number of channels.');
        }

        const imageTensor = tf.tensor3d(new Uint8Array(data), [height, width, channels]);
        return imageTensor;
    } catch (error) {
        console.error("Error in decodeBase64ToTensor function:", error);
        throw error;
    }
}

function preprocessImage(imageTensor) {
    try {
        // Normalize the image tensor to have values in [0, 1] and add batch dimension
        const normalizedTensor = imageTensor.div(tf.scalar(255.0)).expandDims(0);
        return normalizedTensor;
    } catch (error) {
        console.error("Error in preprocessImage function:", error);
        throw error;
    }
}

async function predict(model, imageTensor) {
    try {
        // Perform prediction using the loaded model
        const prediction = model.predict(imageTensor);
        const predictionData = await prediction.data();
        return predictionData;
    } catch (error) {
        console.error("Error in predict function:", error);
        throw error;
    }
}