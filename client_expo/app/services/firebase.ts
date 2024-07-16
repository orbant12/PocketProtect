//<********************************************>
//LAST EDITED: 2023.12.04
//EDITED BY: ORBAN TAMAS
//DESCRIPTION: This file contains the firebase configuration.
//<********************************************>

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from  'firebase/storage' ;


//Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyBdDaUvv_CM4TgovSQ-U4TIvvL3iTP9XX4",
   authDomain: "pocketprotect-cc462.firebaseapp.com",
   projectId: "pocketprotect-cc462",
   storageBucket: "pocketprotect-cc462.appspot.com",
   messagingSenderId: "567381254436",
   appId: "1:567381254436:web:552134ac293e586d0393b1"
};


//FIREBASE APP INIT
export const app = initializeApp(firebaseConfig);

//FIREBASE AUTH INIT
export const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//FIREBASE FIRESTORE INIT
export const db = getFirestore(app);

//FIREBASE STORAGE INIT
export const storage = getStorage();


// IOS: 567381254436-1mi5rsbhrhfe3lhf7if2nhqmf6fnuf22.apps.googleusercontent.com

// ANDROID: 567381254436-b0cqltfecu40o0skrmiq77iiqp2h9njl.apps.googleusercontent.com





