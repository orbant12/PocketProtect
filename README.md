# Skin Screen 

 - This project repo is a failed startup, helping others with my 1.5 year of work.
 - It was running on appstore and AWS EC2 for 4 months.
 - It was helped by Vrije University of Amsterdam's startup program DemonstratorLab. More about them: https://www.demonstratorlab.nl
   
 - Cause of failiure: Low Demand with High Competition

-----

### Feature Showcase Video - [[Click to watch the showcase video](https://www.youtube.com/watch?v=Yij-03l_Cps)]


[![Watch the video](https://github.com/user-attachments/assets/2bca9b30-d94e-4b3d-982f-3d1b8d2f8a06)](https://www.youtube.com/watch?v=Yij-03l_Cps)


----
 
### This app is mainly a cross-platform React Native mobile application designed to help in areas of Skin Cancer Prevention with built in CNN deep learning model and an interactive web interface for professional dermotologists with powerful analasis features and the ability to live chat with their clients (Web Socket).

### Other Features: LLM Medical Assistance with user provided medical data, Daily UV index alert with advice like "What factor of sunscreen should you apply ..." and more.
 
--- 
  
# Features  
#### `Skin Cancer Probability` 
-  Picture can be uploaded from libary or with the phone's camera and then predicted on the aws cloud (EC2) from the CNN Model ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) ,[Model](https://github.com/orbant12/PocketProtect/tree/main/ML) ) 
  
---
#### `LLM health assistant with user context ( Blood Work, UV index, Allergies, Weather )`
- User can use their data to get assistance by an LLM ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )
  
---
#### `Professional Dermotologist Interface Panel ( Web  Next )`
- User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )

---
#### `Birthmark Organisation`
- User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )
  
---
#### `Outdated Birthmark Reminder for Skin Cancer`
- User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )

---
#### `Live UV index & advice`
- User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )

---
#### `Sunburn Organisation`
- User can mark the position of his mole with a build in Human Body model and organise his moles by BIRTHMARKS / BODY PART ( [Mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo) )

---

## Technologies Used

### 📱 Expo Mobile [[mobile](https://github.com/orbant12/PocketProtect/tree/main/client_expo)]
- React Native
- Expo
- Typescript
- Firebase Auth

### ⚙️ Go Backend [[REST-API](https://github.com/orbant12/PocketProtect/tree/main/serverGo)]
- Go (REST API)
- AWS EC2 (Web Server Provider)
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
