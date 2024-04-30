import { setDoc , doc , collection,getDoc,getDocs} from "firebase/firestore"
import { db } from './firebase.js';



//<===> Melanoma <====>

export const melanomaSpotUpload = async ({
    userId,
    melanomaDocument,
}) => {
    try{
        const birthMarkId = "Birthmark#4";
        const ref = doc(db, "users", userId, "Melanoma", birthMarkId);
        await setDoc(ref, {
            melanomaId: "Birthmark#4",
            melanomaDoc:melanomaDocument,
        });
        console.log("Melanoma spot uploaded");
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
}) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        const melanomaData = snapshot.docs.map(doc => doc.data());
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