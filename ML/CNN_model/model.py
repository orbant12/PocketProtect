# DATA SET IMAGES LINK: https://www.kaggle.com/c/dogs-vs-cats/data
# DATA COLLECTED FROM ISIC (INTERNATIONAL SKIN IMAGE COLLABORATION) DATABASE: https://www.isic-archive.com/#!/topWithHeader/onlyHeaderTop/gallery

# -------- IMPORTS --------

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import os
import glob
from sklearn.model_selection import train_test_split
import pandas as pd

# -------- DATA PREPROCESSING --------

# Define the path to the data
data_path = './drive/MyDrive/Melanoma/data/*/*.jpg'

# Get all image file paths
all_image_paths = glob.glob(data_path)

# Create a dictionary to store image paths and their respective labels
data_dict = {'filepath': [], 'label': []}

# Extract labels from folder names
for path in all_image_paths:
    label = os.path.basename(os.path.dirname(path))  # Assuming the label is the name of the parent folder
    data_dict['filepath'].append(path)
    data_dict['label'].append(label)

# Convert dictionary to DataFrame
data_df = pd.DataFrame(data_dict)

# Split the data into training and testing sets
train_df, test_df = train_test_split(data_df, test_size=0.2, stratify=data_df['label'], random_state=42)

# -------- DATA GENERATORS --------

# Define ImageDataGenerators for data augmentation
train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

test_datagen = ImageDataGenerator(rescale=1.0/255)

train_generator = train_datagen.flow_from_dataframe(
    train_df,
    x_col='filepath',
    y_col='label',
    target_size=(128, 128),
    batch_size=32,
    class_mode='binary'
)

test_generator = test_datagen.flow_from_dataframe(
    test_df,
    x_col='filepath',
    y_col='label',
    target_size=(128, 128),
    batch_size=32,
    class_mode='binary'
)

# -------- CNN MODEL --------

# Define the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])

# -------- TRAINING --------

# Train the model
history = model.fit(
    train_generator,
    epochs=10,
    validation_data=test_generator
)

# -------- EVALUATION --------

# Evaluate the model on the test data
loss, accuracy = model.evaluate(test_generator)
print(f'Test Accuracy: {accuracy * 100:.2f}%')


# -------- SAVE MODEL --------

# Save the trained model
model.save('./skin_cancer_model.h5')



