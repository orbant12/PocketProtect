# Skin Cancer Binary Classification( Malignant or Bening ) 

## 1.) Dataset
### Collected Images from isic cli - Shared on my google drive
https://drive.google.com/drive/folders/1RdlCSJl6IwPfvVNwzX6PDbz1KCXHwysM?usp=sharing

### Total Images: 3297
#### Malignant: 1 496
#### Beingn: 1 801 
![download](https://github.com/orbant12/Melanoma_CNN/assets/124793231/0231e8d1-3819-4bd6-b26a-f8c2afa18b50)
![download (1)](https://github.com/orbant12/Melanoma_CNN/assets/124793231/05478550-40ca-4fbb-b948-0aa267aaa8ee)
![download (2)](https://github.com/orbant12/Melanoma_CNN/assets/124793231/81c84d53-4336-4332-aba5-24c7346592d8)

---

## 2.) Simple Image Decoding
<code>def decode_image(filepath, label):
    img = tf.io.read_file(filepath)
    img = tf.image.decode_jpeg(img)
    img = tf.image.resize(img, [224, 224])
    img = tf.cast(img, tf.float32) / 255.0
    return img, label</code>

---

## 3.) Model Architecture

![Screenshot 2024-05-22 at 17 24 32](https://github.com/orbant12/Melanoma_CNN/assets/124793231/c80aa69d-4379-4b55-b96e-853d9bac2222)


---

## 4.) Results
### Loss
![download (3)](https://github.com/orbant12/Melanoma_CNN/assets/124793231/1b28e47d-81a2-4f6b-8849-cbeceec71901)

### Accuracy - 0.92
![download (4)](https://github.com/orbant12/Melanoma_CNN/assets/124793231/88a5d3c5-381d-40ba-9b6b-d17a5b41b4f3)


---

### +.) Export Model to Json
    
        !pip install tensorflowjs
    !tensorflowjs_converter \
        --input_format=keras \
        my_model.h5 \
        drive/MyDrive/ML/my_tfjs_model_new

---

# +.) Problems and Solutions

## Problem: New moles from the mobile app is very inaccurate, but images from the dataset uploaded trough the app is accurate

### 1.) Hypothesis: Model does better on the data it has been trained on - Overfitting
    Proven wrong by:
        - Creating a validation set with 20% of the full dataset
        - Validation has 0.92 accuracy 
            Therfore this hypothesis is WRONG

### 2.) Hypothesis: Commonly expected images from the app differs significantly from the images in the dataset
    Solution:
        - Collecting each mole image carefully from ISIC ARCHIVE 
            with the following statment: "Could this picture be taken with a phone"

<img width="1034" alt="Screenshot 2024-06-05 at 11 17 15" src="https://github.com/orbant12/Skincancer_binary-classification/assets/124793231/b1d52ffe-f4e7-4477-a1b9-490aae58fda0">






