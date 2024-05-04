import { setDoc , doc , collection,getDoc,getDocs} from "firebase/firestore"
import { db,storage } from './firebase.js';
import { ref, uploadString, getDownloadURL, uploadBytes, uploadBytesResumable, } from "firebase/storage";

import { decode } from 'base-64';


//<===> Melanoma <====>

export const melanomaSpotUpload = async ({
    userId,
    melanomaDocument,
    gender,
    birthmarkId,
    melanomaPictureUrl,
    storageLocation,
}) => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", birthmarkId);
        await setDoc(ref, {
            melanomaId: birthmarkId,
            melanomaDoc:melanomaDocument,
            gender: gender,
            melanomaPictureUrl: melanomaPictureUrl,
            storage_location: storageLocation,
        });
        console.log("Melanoma spot uploaded");
    } catch (error) {
        console.log(error);
    }
}

export const melanomaUploadToStorage = async ({
    melanomaPicFile,
    storageLocation,
}) => {
    try{ 
        if(typeof atob === 'undefined') {
            global.atob = decode;
          }
        const base64TypeMetaData = "data:image/jpeg;base64,";
        const storageRef = ref(storage, storageLocation);
        await uploadString(storageRef,melanomaPicFile);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.log(error);
    }
}





export const fetchMelanomaSpotData = async ({
    userId,
    melanomaId,
}) => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", melanomaId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            console.log("Melanoma data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllMelanomaSpotData = async ({
    userId,
    gender,
}) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        //ONLY PUT IF doc.data().gender == gender
        let melanomaData = [];
        snapshot.forEach((doc) => {
            if(doc.data().gender == gender){
                melanomaData.push(doc.data());
            }
        }
        );
        return melanomaData;
    } catch (error) {
        console.log(error);
    }
}

export const fetchUserData = async ({
    userId,
}) => {
    try{
        const ref = doc(db, "users", userId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return docSnap
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error);
    }
}