# Pocket Protect 

(Avalible on App Store and Play Store !)

### Pocket Protect is mainly a cross-platform mobile application designed to help in areas of Skin Cancer Prevention / Detection, LLM Medical Assistance with provided medical data

---

## Features
- `Skin Cancer Probability`: Picture can be uploaded from libary or with the phone's camera and then predicted on the aws cloud (EC2) from the CNN Model ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) ,[Model](https://github.com/orbant12/PocketProtect/tree/main/ML) )
  
- `Birthmark Organisation`: User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )

---

## Technologies Used

### 📱 Expo Mobile [[mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo)]
- React Native
- Expo
- Typescript
- Firebase Auth

### ⚙️ Go Backend [[REST-API](https://github.com/orbant12/PocketProtect/tree/main/serverGo)]
- Go (REST API)
- Tensorflow-js-node (CLOUD COMPUTE for DL Model)
- Firebase Functions (Server Provider)
- Firebase - Firestore and Storage (Database)

### 🖥️ Next Web [[web](https://github.com/orbant12/PocketProtect/tree/main/client_next)]
- Next.js
- Typescript
  
### ML - CNN Model [[Model](https://github.com/orbant12/PocketProtect/tree/main/ML)]
`CNN Model`
    - Python
    - Tensorflow
    - ISIC Database
    - Numpy

`Prediction API Endpoint`
    - Flask
    - Node.js

---
