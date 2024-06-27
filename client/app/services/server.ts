import { 
    setDoc,
    doc,
    collection,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc,
} from "firebase/firestore"
import { db,storage } from './firebase';
import { ref,  getDownloadURL, uploadBytes,deleteObject} from "firebase/storage";
import { dateDistanceFromToday, Timestamp } from "../utils/date_manipulations";
import { Gender, SkinType, Slug, SpotData, Success_Purchase_Client_Checkout_Data, UserData,AssistanceFields } from "../utils/types";
import { MelanomaMetaData } from "../pages/Libary/Melanoma/melanomaCenter";


type SpotDeleteTypes = "history" | "latest"

type userFields = "gender" | "birth_date"



export type BloodWorkTypes = 
    | "Basic Health Indicators" 
    | "Lipid Panel"
    | "Metabolic Panel"
    | "Liver Function Tests"
    | "Thyroid Panel"
    | "Iron Studies"
    | "Vitamins and Minerals"
    | "Inflammatory Markers"
    | "Hormonal Panel"
    | "Hormonal Panel";

export type DiagnosisData = {
    id:string,
        diagnosis: string,
        clientSymphtoms:string,
        created_at: string,
        possibleOutcomes: string;
        stages:{
            stage_one:[{a:string,q:string,type:"binary" | "feedback"}]
            stage_two:{
                chance:string;
                survey:[{a:string,q:string,type:"binary" | "feedback"}]
            }
            stage_three:{
                assistance_frequency:string
            }
            stage_four:any
        }
        title:string;
}



export type BloodWorkCategory = {
    title: string;
    data: {
        type: string;
        number: number;
    }[];
};

export type BloodWorkData = BloodWorkCategory[];

export type BloodWorkDoc = {
    created_at:string;
    data:BloodWorkData;
    id: string;
    risk: boolean;
}





interface API_Melanoma {
    userId?:string;
    melanomaDocument?: {
        spot:[
            {slug:Slug,
            pathArray: any[],
            color:string},
        ],
        location: {x:number,y:number}
    };
    spotId?:string;
    gender?: Gender;
    melanomaPictureUrl?:string;
    storageLocation?:string;
    risk?:number;
    storage_name?:string;
    created_at?: Date;
    riskToUpdate?: {
        risk:string
    };
    metaData?:MelanomaMetaData;
    melanomaPicFile?: Blob;
    slug?:Slug;
    data?: SpotData;
    deleteType?: SpotDeleteTypes;
    completedArray?: {slug:Slug}[]
}

interface API_User {
    userId:string;
    fieldNameToChange: userFields;
    dataToChange: any
}

interface API_Diagnosis {
    userId:string;
    data?:DiagnosisData;
}

interface API_BloodWork {
    userId: string;
    higherRisk?: boolean;
    data?: BloodWorkData;
    Create_Date?: string;
    id?:string;
}

//<===> Melanoma <====>

export const melanomaSpotUpload = async ({
    userId,
    melanomaDocument,
    gender,
    spotId,
    melanomaPictureUrl,
    storageLocation,
    risk,
    storage_name,
    created_at,
}:API_Melanoma) => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", spotId);
        await setDoc(ref, {
            melanomaId: spotId,
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

export const updateSpotRisk = async ({
    userId,
    spotId,
    riskToUpdate
}:API_Melanoma) => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", spotId)
        await updateDoc(ref,{risk: riskToUpdate.risk})
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}

export const melanomaMetaDataUpload = async ({
    userId,
    metaData
}:API_Melanoma) => {
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
}:API_Melanoma) => {
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

export const fetchSelectedMole = async ({
    userId,
    spotId,
}:API_Melanoma): Promise <SpotData | null> => {
    try{
        const ref = doc(db, "users", userId, "Melanoma", spotId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return docSnap.data() as SpotData
            
        } else {
            console.log("No such document!");
            return null
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

export const fetchAllMelanomaSpotData = async ({
    userId,
    gender,
}:API_Melanoma) => {
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
}:API_Melanoma) => {
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

export const fetchSpotHistory = async ({ userId, spotId }:API_Melanoma) => {
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
}:API_Melanoma) => {
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
}:API_Melanoma) => {
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
    deleteType,
    storage_name
}:API_Melanoma) => {
    const deleteFromFirestore = async () => {
        try {
            if(deleteType == "history"){
                const ref = doc(db, "users", userId, "Melanoma", spotId, "History",storage_name);            
                await deleteDoc(ref);
                return { success: true, message: "Deleted from Firestore" };
            } else if ( deleteType == "latest" ) {
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
}:API_Melanoma)=>{
    const distanceFromToday = (timestamp:Timestamp) => {
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
        let melanomaDataCount : number = 0;
        let beningDataCount : number = 0;
        let malignantDataCount : number = 0;
        let outdatedDataCount : number = 0;
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

export const fetchNumberOfMolesOnSlugs = async ({
    userId, 
}:API_Melanoma)=>{
    try{
        const ref = collection(db, "users", userId, "Melanoma");                
        const snapshot = await getDocs(ref);        
        let slugValues = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data && data.melanomaDoc && data.melanomaDoc.spot && data.melanomaDoc.spot.length > 0) {
                const slug = data.melanomaDoc.spot[0].slug;
                slugValues.push(slug);
            }
        }            
        const slugCount = slugValues.reduce((acc, slug) => {
            acc[slug] = (acc[slug] || 0) + 1;
            return acc;
        }, {});    
        const result = Object.keys(slugCount).map(key => ({ [key]: slugCount[key] }));

        return result;
    } catch (error) {
        console.log(error)
        return []
    }
}

export const updateCompletedParts = async ({
    userId,
    completedArray
}:API_Melanoma) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "skin_data")
        await updateDoc(ref,{completedArray})
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

export const fetchCompletedParts = async ({
    userId
}:API_Melanoma): Promise<{slug:Slug}[] | null> => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "skin_data")    
        const snapshot = await getDoc(ref);
        if( snapshot.exists()){
            return [...snapshot.data().completedArray]
        }        
    } catch(err) {
        return null
    }
}

export const fetchOutDatedSpots = async ({
    userId
}:API_Melanoma) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        let melanomaData = [];
        snapshot.forEach((doc) => {
            if(dateDistanceFromToday(doc.data().created_at) >= 200){
                melanomaData.push(doc.data());
            }
        }
        );
        return melanomaData;
    } catch (error) {
        return []
    }
}

export const fetchRiskySpots = async ({
    userId
}:API_Melanoma) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        let melanomaData = [];
        snapshot.forEach((doc) => {
            if(doc.data().risk >= 5 && doc.data().risk != null ){
                melanomaData.push(doc.data());
            }
        }
        );
        return melanomaData;
    } catch (error) {
        return []
    }
}

export const fetchUnfinishedSpots = async ({
    userId
}:API_Melanoma) => {
    try{
        const ref = collection(db, "users", userId, "Melanoma");
        const snapshot = await getDocs(ref);
        let melanomaData = [];
        snapshot.forEach((doc) => {
            if(doc.data().risk == null){
                melanomaData.push(doc.data());
            }
        }
        );
        return melanomaData;
    } catch (error) {
        return []
    }
}

export const fetchSkinType = async ({
    userId
}:API_Melanoma) => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "skin_data");
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return docSnap.data().skin_type;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        return false
    }
}


//<===> USER <====>

export const fetchUserData = async ({
    userId
}: { userId: string }): Promise<UserData | null> => { 
    try {
        const ref = doc(db, "users", userId);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            return data;
        } else {
            console.log("No such document!");
            return null; 
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const changePersonalData = async ({
    fieldNameToChange,
    dataToChange,
    userId,
}:API_User) => {
    const changeData = (field: userFields) => {
        const data = { [field]: dataToChange }; 
        const ref = doc(db, "users", userId);
        updateDoc(ref, data);
    };
    try{
        if (fieldNameToChange == "gender"){
            changeData(fieldNameToChange)
        }
        if (fieldNameToChange == "birth_date"){
            changeData(fieldNameToChange)
        }
        return true
    } catch {
        return false
    }
}


//<===> DIAGNOSIS <====>

export const fetchAllDiagnosis = async ({
    userId
}:API_Diagnosis) => {
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
}:API_Diagnosis) => {
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
}:API_BloodWork) => {
    const formatDate = (dateString:string) => {
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
        const splited = formatDate(Create_Date)
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
}:API_BloodWork) => {
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
}:{userId:string}): Promise<BloodWorkDoc | null> => {
    try{
        const ref = doc(db, "users", userId, "Medical_Data", "blood_work");
        const snapshot = await getDoc(ref);
        if(snapshot.exists()){
            return {
                    created_at:snapshot.data().created_at,
                    data: snapshot.data().data,
                    id: snapshot.data().id,
                    risk: snapshot.data().risk
                }
        } else {
            return {
                    created_at:"Not provided yet",
                    data:[],
                    id:"",
                    risk:false
                }
        }
    } catch {
        return null
    }
}

export const fetchBloodWorkHistory = async ({
    userId,
}:API_BloodWork) => {
    try{
        const ref = collection(db, "users", userId, "Medical_Data", "blood_work","History");
        const snapshot = await getDocs(ref)
        if (!snapshot.empty) {
            let historyData = [];
            snapshot.forEach((doc) => {
                historyData.push(doc.data());
            });
            historyData.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date (a.created_at).getTime();
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
}:{userId:string,year:number,month:number}) => {
    function splitDate(date:string){
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
        return []
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


//<===> Payment <====>

export const handleSuccesfullPayment = async ({
    checkOutData,
    session_UID
}:{
    checkOutData:Success_Purchase_Client_Checkout_Data,
    session_UID:string
    }) => {
    try {
        const assistRef = doc(db,"assistants", checkOutData.assistantData.id, "Requests",session_UID)

        await createAssistantSession({
            userId: checkOutData.clientData.id,
            session_UID:session_UID,
            data:checkOutData
        })
        await setDoc(assistRef,checkOutData)
        return true
    } catch(err) {
        console.log(err)
        return err
    }
}

export const createAssistantSession = async({
    userId,
    session_UID,
    data
}:{
    userId:string,
    session_UID:string,
    data:Success_Purchase_Client_Checkout_Data
}) => {
    try{
        const clientRef = doc(db,"users",userId, "Assist_Panel",session_UID)
        await setDoc(clientRef,data)
    } catch(err) {
        
    }
}

//<===> Asssistants <====>

export const fetchAssistantsByField = async ({
    field
}:{
    field:AssistanceFields
}) => {
    try{
        const assistantRef = collection(db,"assistants")
        const snapshot = await getDocs(assistantRef)

        let assistants = [];
        snapshot.forEach((doc) => {
            if(doc.data().field == field){
                assistants.push(doc.data());
            } 
        }
        );
        return assistants;
    } catch(err) {
        console.log(err)
        return err
    }
}



export const fetchAssistantSessions = async({
    userId
}) => {
    try{
        const clientRef = collection(db,"users",userId, "Assist_Panel")
        const snapshot = await getDocs(clientRef);
        //ONLY PUT IF doc.data().gender == gender
        let sessionData = [];
        snapshot.forEach((doc) => {
            sessionData.push(doc.data());
        }
        );
        return sessionData;
    } catch {

    }
}

export const realTimeUpdateChat = async ({
    userId,
    sessionId,
    chat
}) => {
    try{
        const ref = doc(db, "users", userId, "Assist_Panel", sessionId) 
        await updateDoc(ref,{chat:[...chat]})
        return true
     } catch(Err) {
        console.log(Err)
        return Err
     }
}

export const fetchChat = async({sessionId,clientId}:{sessionId:string,clientId:string}) => {
    try{
        const ref = doc(db,"users",clientId,"Assist_Panel",sessionId)
        const snapshot = await getDoc(ref)
        if (snapshot.exists()) {
            return snapshot.data().chat;
        } else {
            return [];
        }
    } catch {
        return []
    }
}