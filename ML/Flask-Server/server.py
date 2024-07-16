from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)

# Load the trained model
model = load_model('../CNN_model/skin_cancer_model.h5')

def preprocess_image(image, target_size):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = image / 255.0  # Rescale the image
    return image

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the base64-encoded image from the request
        data = request.get_json()
        image_data = data['image']
        
        # Decode the base64 image
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        
        # Preprocess the image
        processed_image = preprocess_image(image, target_size=(128, 128))
        
        # Make prediction
        prediction = model.predict(processed_image)
        prediction_class = 'Malignant' if prediction[0][0] > 0.5 else 'Benign'
        
        # Return the prediction
        response = {
            'prediction': prediction_class,
            'confidence': float(prediction[0][0])
        }
        print(response)
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
