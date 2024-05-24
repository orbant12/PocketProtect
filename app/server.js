import { setDoc , doc , collection,getDoc,getDocs,updateDoc,addDocs,deleteDoc} from "firebase/firestore"
import { db,storage } from './firebase.js';
import { ref,  getDownloadURL, uploadBytes,deleteObject} from "firebase/storage";


//<===> Melanoma <====>

export const melanomaSpotUpload = async ({
    userId,
    melanomaDocument,
    gender,
    birthmarkId,
    melanomaPictureUrl,
    storageLocation,
    risk
}) => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", birthmarkId);
        await setDoc(ref, {
            melanomaId: birthmarkId,
            melanomaDoc:melanomaDocument,
            gender: gender,
            melanomaPictureUrl: melanomaPictureUrl,
            storage_location: storageLocation,
            risk: risk,
        });
        return true;
    } catch (error) {
        console.log(error);
    }
}

export const melanomaMetaDataUpload = async ({
    userId,
    metaData
}) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "skin_data");
        await setDoc(ref,metaData);
        return true
    } catch {
        return false
    }
}

export const melanomaUploadToStorage = async ({
    melanomaPicFile,
    storageLocation,
}) => {
    try{ 
        const base64TypeMetaData = "data:image/jpeg;base64,";
        const storageRef = ref(storage, storageLocation);
        await uploadBytes(storageRef,melanomaPicFile);
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
        const ref = doc(db, "users", userId, "Medical_Data", melanomaId);
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
        return false
    }
}

export const fetchSlugMelanomaData = async ({
    userId,
    gender,
    slug,
}) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        //ONLY PUT IF doc.data().gender == gender
        let melanomaData = [];
        snapshot.forEach((doc) => {
            if(doc.data().gender == gender && doc.data().melanomaDoc.spot[0].slug == slug){
                melanomaData.push(doc.data());
            }
        }
        );
        return melanomaData;
    } catch (error) {
        console.log(error);
    }
}

export const deleteSpot = async ({
    userId,
    spotId
}) => {
    const deleteFromFirestore = async () => {
        try {
            const ref = doc(db, "users", userId, "Melanoma", spotId);            
            await deleteDoc(ref);
            return { success: true, message: "Deleted from Firestore" };
        } catch (error) {
            console.error("Error deleting from Firestore:", error);
            return { success: false, message: "Failed to delete from Firestore" };
        }
    };

    const deleteFromStorage = async () => {
        try {
            const path = `users/${userId}/melanomaImages/${spotId}`;
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
            return { success: true, message: "Deleted from Storage" };
        } catch (error) {
            console.error("Error deleting from Storage:", error);
            return { success: false, message: "Failed to delete from Storage" };
        }
    };

    try {
        const firestoreRes = await deleteFromFirestore();
        const storageRes = await deleteFromStorage();
        return { firestore: firestoreRes, storage: storageRes };
    } catch (error) {
        console.error("Error deleting spot:", error);
        return { firestore: { success: false, message: "Firestore deletion failed" }, storage: { success: false, message: "Storage deletion failed" } };
    }
};


//<===> USER <====>

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

export const changePersonalData = async ({
    type,
    toChange,
    userId,
}) => {
    const changeData = (field) => {
        const data = { [field]: toChange }; // Dynamically create an object property
        const ref = doc(db, "users", userId);
        updateDoc(ref, data);
    };
    try{
        if (type == "gender"){
            changeData(type)
        }
        if (type == "birth_date"){
            changeData(type)
        }
        return true
    } catch {
        return false
    }
}

//<===> DIAGNOSIS <====>

export const fetchAllDiagnosis = async ({
    userId
}) => {
    try{
        const ref = collection(db, "users", userId , "Diagnosis")
        const snapshot = await getDocs(ref);
        let diagnosisData = [];
        snapshot.forEach((doc) => {
            diagnosisData.push(doc.data());
        });
        return diagnosisData;
    } catch (e) {
        return false
    }
}

export const saveDiagnosisProgress = async ({
    userId,
    data
}) => {
    try{
        const ref = doc(db, "users", userId, "Diagnosis", data.id);
        await setDoc(ref,data);
        return true           
    } catch (error) {
        console.log(error);
        return false
    }
}


// Medical Data

export const saveBloodWork = async ({
    userId,
    higherRisk,
    data,
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return {year,month,day};
    };
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        const ref2 = doc(db, "users", userId, "Reminders", "blood_work");
        await setDoc(ref,data);
        const splited = formatDate(data.Created_Date)
        if(higherRisk == true){
            if(Number(splited.month) + 6 <= 12){
                const reminderDate = {expires:`${splited.year}-${Number(splited.month) + 6}-${splited.day}`,id:"blood_work"}
                await setDoc(ref2,reminderDate)
            } else {
                const leftOff = Number(splited.month) - 12
                const reminderDate = {expires:`${Number(splited.year) + 1}-${Number(splited.month) + leftOff}-${splited.day}`,id:"blood_work"}
                await setDoc(ref2,reminderDate)
            }
        } else {
            const reminderDate = {expires:`${splited.year + 1}-${splited.month}-${splited.day}`,id:"blood_work"}
            await setDoc(ref2,reminderDate)
        }      
        return true    
    } catch (err) {
        return err
    }
}

export const fetchBloodWork = async ({
    userId,
}) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        const snapshot = await getDoc(ref);
        console.log(snapshot.data())
        return snapshot.data()
    } catch {
        return false
    }
}

// Medical Data

export const fetchMonthTasks = async ({
    month,
    userId,
    year
}) => {
    function splitDate(date){
        const [year, month, day] = date.split('-').map(Number);
        return {year,month,day}
    }
    try{
        const ref = collection(db,"users",userId,"Task_Manager");
        const snapshot = await getDocs(ref);
        let taskData = [];
        snapshot.forEach((doc) => {
            const date = splitDate(doc.data().id)
            if(date.month == month && date.year == year){
                taskData.push(doc.data());
            };
        })
        return taskData;
        
    } catch {   
        return false
    }
}

export const saveTask = async ({
    userId,
    date,
    data
}) => {
    try{
        const ref = doc(db, "users", userId, "Task_Manager", String(date));
        await setDoc(ref,data);
        return true           
    } catch (error) {
        console.log(error);
        return false
    }
}

export const fetchReminders = async ({
    userId
}) => {
    try{
        const ref = collection(db,"users",userId,"Reminders");
        const snapshot = await getDocs(ref);
        let taskData = [];
        snapshot.forEach((doc) => {
                taskData.push(doc.data());
        })
        return taskData;
        
    } catch {   
        return false
    }
}

