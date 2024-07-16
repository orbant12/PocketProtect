const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs'); // Use @tensorflow/tfjs for compatibility with browsers
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5001;

app.use(bodyParser.json({ limit: '50mb' })); // To handle large input data

app.post('/predict', async (req, res) => {
    try {
        const photo = req.body.input;
        console.log("Received input: ", photo);

        // Decode base64 encoded image string to a TensorFlow tensor
        const imageTensor = await decodeBase64ToTensor(photo);
        console.log("Image tensor shape: ", imageTensor.shape);

        // Load the model
        const modelUrl = "https://firebasestorage.googleapis.com/v0/b/pocketprotect-cc462.appspot.com/o/model.json?alt=media&token=b44ea9f3-830d-4357-be27-7d9ccc98303e";
        const model = await tf.loadLayersModel(modelUrl);
        console.log("Model loaded successfully");

        // Preprocess the image tensor as necessary by your model
        const preprocessedImageTensor = preprocessImage(imageTensor);

        // Make prediction
        const prediction = await predict(model, preprocessedImageTensor);
        console.log("Prediction result: ", prediction);

        // Return prediction result
        res.json({ prediction });
    } catch (error) {
        console.error("Error in predict function:", error);
        res.status(500).json({ error: error.message });
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
