import { 
    setDoc,
    doc,
    collection,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc
} from "firebase/firestore"
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
    risk,
    storage_name,
    created_at
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
            storage_name,
            created_at
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

export const fetchSpotHistory = async ({ userId, spotId }) => {
    try {
        const ref = collection(db, "users", userId, "Melanoma", spotId, "History");
        const snapshot = await getDocs(ref);
        
        if (!snapshot.empty) {
            let melanomaData = [];
            snapshot.forEach((doc) => {
                melanomaData.push(doc.data());
            });
            
            melanomaData.sort((a, b) => {
                return b.created_at.seconds - a.created_at.seconds;
            });
            
            return melanomaData;
        } else {
            return "NoHistory"; 
        }
    } catch (error) {
        console.error("Error fetching spot history: ", error);
        return false; 
    }
};

export const updateSpot = async ({
    userId,
    spotId,
    data,    
}) => {
    const saveCurrentToHistory = async () => {
        const ref = doc(db, "users", userId, "Melanoma", spotId);
        const docSnap = await getDoc(ref);
        const refSave = doc(db, "users", userId, "Melanoma", spotId, "History",docSnap.data().storage_name);
        await setDoc(refSave, docSnap.data()); 
    };

    const saveNew = async () => {
        const ref = doc(db, "users", userId, "Melanoma", spotId);
        await setDoc(ref, data);
    };

    try {
        await saveCurrentToHistory();
        await saveNew();
        return true;
    } catch (error) {
        console.error("Error updating spot and saving history: ", error);
        return false; 
    }
};

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

export const deleteSpotWithHistoryReset = async ({
    userId,
    spotId,
    type,
    storage_name
}) => {
    const deleteFromFirestore = async () => {
        try {
            if(type == "history"){
                const ref = doc(db, "users", userId, "Melanoma", spotId, "History",storage_name);            
                await deleteDoc(ref);
                return { success: true, message: "Deleted from Firestore" };
            } else {
                const ref = doc(db, "users", userId, "Melanoma", spotId);                                    
                const closest = collection(db, "users", userId, "Melanoma", spotId, "History");
                const snapshot = await getDocs(closest)
                if (!snapshot.empty) {
                    let historyData = [];
                    snapshot.forEach((doc) => {
                        historyData.push(doc.data());
                    });
                    historyData.sort((a, b) => {
                        return b.created_at.seconds - a.created_at.seconds;
                    });
                    const elementWithHighestDate = historyData[0];       
                    //DELETE
                    const closestDelete = doc(db, "users", userId, "Melanoma", spotId, "History",elementWithHighestDate.storage_name);
                    await deleteDoc(closestDelete)
                    //SET NEW
                    await setDoc(ref,elementWithHighestDate)
                    return { success: true, message: "Deleted from Firestore" };                      
                } else {
                    await deleteDoc(ref)
                    return { success: true, message: "Deleted from Firestore" };   
                }                                               
            }
        } catch (error) {
            console.error("Error deleting from Firestore:", error);
            return { success: false, message: "Failed to delete from Firestore" };
        }
    };

    const deleteFromStorage = async () => {
        try {
            const path = `users/${userId}/melanomaImages/${storage_name}`;
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

export const fetchNumberOfMoles = async ({
    userId,
    gender
})=>{
    const distanceFromToday = (timestamp) => {
        const today = new Date();
        const givenDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);                
        const timeDifference = today.getTime() - givenDate.getTime();                
        const dayDifference = timeDifference / (1000 * 3600 * 24);        
        return Math.round(dayDifference);
    };
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const completedRef = doc(db, "users", userId, "Medical_Data","skin_data");
        const docSnap = await getDoc(completedRef);
        const snapshot = await getDocs(ref);        
        let melanomaDataCount = 0;
        let beningDataCount = 0;
        let malignantDataCount = 0;
        let outdatedDataCount = 0;
        snapshot.forEach((doc) => {
            const data = doc.data();                        
            if (data.gender === gender) {
                melanomaDataCount++;
            }            
            if (data.risk < 0.5) {
                beningDataCount++;
            } else if (data.risk > 0.5) {
                malignantDataCount++;
            }        
            if (distanceFromToday(data.created_at) > 186) {
                outdatedDataCount++;
            }
        });
        if(docSnap.exists() &&  docSnap.data().completedArray != undefined){
            const completedArray = docSnap.data().completedArray;
            let completedParts = completedArray.length;       
            return {
                all: melanomaDataCount,
                bening: beningDataCount,
                malignant: malignantDataCount,
                outdated: outdatedDataCount,
                completed: completedParts,
            };
        } else {
            return {
                all: melanomaDataCount,
                bening: beningDataCount,
                malignant: malignantDataCount,
                outdated: outdatedDataCount,
                completed: 0,
            };
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

export const updateCompletedParts = async ({
    userId,
    completedArray
}) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "skin_data")    
        await setDoc(ref,{completedArray})
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}


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
        const data = { [field]: toChange }; 
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
        if(!snapshot.empty){
            let diagnosisData = [];
            snapshot.forEach((doc) => {
                diagnosisData.push(doc.data());
            });
            return diagnosisData;
        } else {
            return "NoDiagnosis"
        }        
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


//<===>  Blood Work <====>

export const saveBloodWork = async ({
    userId,
    higherRisk,
    data,
    Create_Date,
    id
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
        await setDoc(ref,{
            data: data,
            created_at: Create_Date,
            id: id,
            risk: higherRisk
        });        
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

export const updateBloodWork = async ({
    userId,    
    data,
    Create_Date,
    id,
    higherRisk  
}) => {
    const saveCurrentToHistory = async () => {
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        const docSnap = await getDoc(ref);   
        const refSave = doc(db, "users", userId, "Medical_Data", "blood_work", "History", docSnap.data().id);
        await setDoc(refSave, docSnap.data()); 
    };

    const saveNew = async () => {
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        await setDoc(ref, {
            data: data,
            created_at: Create_Date,
            id: id,
            risk: higherRisk
        });
    };

    try {
        await saveCurrentToHistory();
        await saveNew();
        return true;
    } catch (error) {
        console.error("Error updating spot and saving history: ", error);
        return false; 
    }
};

export const fetchBloodWork = async ({
    userId,
}) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        const snapshot = await getDoc(ref);
        if(snapshot.exists()){
            return snapshot.data()
        } else {
            return "NoBloodWork"
        }
    } catch {
        return false
    }
}

export const fetchBloodWorkHistory = async ({
    userId,
}) => {
    try{
        const ref = collection(db, "users", userId, "Medical_Data", "blood_work","History");
        const snapshot = await getDocs(ref)
        if (!snapshot.empty) {
            let historyData = [];
            snapshot.forEach((doc) => {
                historyData.push(doc.data());
            });
            historyData.sort((a, b) => {
                return new Date(b.created_at) - new Date (a.created_at);
            });
            return historyData
        } else {
            return "NoHistory"
        }
    } catch {
        return false
    }
}


//<===>  Task_Manager <====>

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
            const date = splitDate(doc.data().date)
            if(date.year == year){
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
    data,
    id,
    date
}) => {
    try{
        const ref = doc(db, "users", userId, "Task_Manager", id);
        await setDoc(ref,
            {
                data,
                date,
                id
            }
        );
        return true           
    } catch (error) {
        console.log(error);
        return false
    }
}


//<===>  Reminder <====>

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

