# Flask API for CNN model
### ( Currently used in production )

---

# Getting Started

### Step 1: Install Packages

```bash
    pip install -r requirements.txt
```

### Step 2: Run the server (port: 5001)

```bash
    python server.py
```

### Step 3: Get the predictions from base64 image

```bash
    curl -X POST http://localhost:5001/predict -H "Content-Type: application/json" -d '{"image": "base64_image"}'  
```

---

# About the /predict endpoint

### 1.) Step - Request

- Method: POST
- URL: http://localhost:5001/predict
- Headers: Content-Type: application/json
- Body: {"image": "base64_image"}

---

### 2.) Step - Data Preprocessing

```python
    def preprocess_image(image, target_size):
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image = image.resize(target_size)
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0)
        image = image / 255.0  # Rescale the image
        return image

    # Decode the base64 image
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))    

    # Preprocess the image
    processed_image = preprocess_image(image, target_size=(128, 128))
```

---

### 3.) Step - Model Prediction ( Response )

```python
     # Make prediction
    prediction = model.predict(processed_image)
    prediction_class = 'Malignant' if prediction[0][0] > 0.5 else 'Benign'
        
    # Return the prediction
    response = {
        'prediction': prediction_class,
        'confidence': float(prediction[0][0])
    }
```



