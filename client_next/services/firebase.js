
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from  'firebase/storage' ;
   
const firebaseConfig = {
   apiKey: "AIzaSyBdDaUvv_CM4TgovSQ-U4TIvvL3iTP9XX4",
   authDomain: "pocketprotect-cc462.firebaseapp.com",
   projectId: "pocketprotect-cc462",
   storageBucket: "pocketprotect-cc462.appspot.com",
   messagingSenderId: "567381254436",
   appId: "1:567381254436:web:552134ac293e586d0393b1"
 };
 
   // FIREBASE APP INIT_______________________________________________________________.
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();




