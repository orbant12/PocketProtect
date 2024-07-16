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
import { Gender, SkinType, Slug, SpotData, Success_Purchase_Client_Checkout_Data, UserData,AssistanceFields, AssistantData } from "../utils/types";
import { MelanomaMetaData } from "../pages/Libary/Melanoma/melanomaCenter";
import { numberOfMolesOnSlugs } from "../components/LibaryPage/Melanoma/slugCard";

const DOMAIN = "http://localhost:3001";

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
    melanomaBlob?:string;
    newData?:SpotData;
    melanomaDocument?: {
        spot:
            {slug:Slug,
            pathArray: any[],
            color:string},
        
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
        risk:number;
    };
    metaData?:MelanomaMetaData;
    melanomaPicFile?: Blob;
    slug?:Slug;
    data?: SpotData;
    deleteType?: SpotDeleteTypes;
    completedArray?: {slug:Slug}[];
    moleId?:string;
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

export type SpecialSpotResponse = {
    risky: SpotData[];
    outdated: SpotData[];
    unfinished: SpotData[];
}

//<===> Melanoma <====>

//DONE
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
    melanomaBlob
}:API_Melanoma) => {
    try{

        const response = await fetch(`${DOMAIN}/client/upload/melanoma`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                spotData: {
                    melanomaDoc: {
                        location: { x: melanomaDocument.location.x, y: melanomaDocument.location.y },
                        spot: {
                            slug: melanomaDocument.spot.slug,
                            pathArray: melanomaDocument.spot.pathArray,
                            color: melanomaDocument.spot.color
                        }
                    },
                    melanomaId: spotId,
                    risk,
                    gender,
                    storage_name: storage_name,
                    storage_location: storageLocation,
                    melanomaPictureUrl,
                    created_at: created_at.toISOString(), // Convert to ISO string for consistency
                },
                melanomaBlob
            }),
            
        });

        if(response.ok){
            return true;
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// DONE
export const updateSpotRisk = async ({
    userId,
    spotId,
    riskToUpdate
}:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/update/melanoma-risk`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            spotId,
            risk: riskToUpdate.risk
        }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}

//DONE
export const melanomaMetaDataUpload = async ({
    userId,
    metaData
}:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/upload/melanoma-metadata`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            metaData
        }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}

//DONE
export const fetchSelectedMole = async ({
    userId,
    spotId,
}:API_Melanoma): Promise <SpotData | null> => {

    const response = await fetch(`${DOMAIN}/client/get/one-melanoma`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            spotId
        }),
    });

    if(response.ok){
        const data = await response.json();
        return data as SpotData;
    } else {
        return null
    }
}

// DONE
export const fetchAllMelanomaSpotData = async ({
    userId,
    gender,
}:API_Melanoma) => {
    try{
        const response = await fetch(`${DOMAIN}/client/get/all-melanoma`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                gender
            })
        });

        if(response.ok){
            const data = await response.json();
            return data as SpotData[];
        } else {
            return []
        }
    } catch (error) {
        return false
    }
}

// DONE
export const fetchSlugMelanomaData = async ({
    userId,
    gender,
    slug,
}:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/get/melanoma-on-slug`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            gender,
            slug
        }),
    });

    if(response.ok){
        const data = await response.json();
        return data as SpotData[];
    } else {
        return []
    }
}

//DONE
export const fetchSpotHistory = async ({ userId, spotId }:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/get/melanoma-history`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, spotId }),
    });

    if(response.ok){
        const data = await response.json();
        return data;
    } else {
        return "NoHistory";
    }
};

//DONE
export const updateSpot = async ({
    userId,
    spotId,
    newData,    
    melanomaBlob
}:API_Melanoma) => {

    const response = await fetch(`${DOMAIN}/client/update/melanoma-data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            spotId,
            newData,
            melanomaBlob
        }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
};

//DONE
export const deleteSpot = async ({
    userId,
    spotId
}:API_Melanoma): Promise <{firestore:{message:string,success:boolean},storage:{message:string, success:boolean}}> => {

    const response = await fetch(`${DOMAIN}/client/delete/melanoma`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, spotId }),
    });
    if(response.ok){
        const data:{firestore:{message:string,success:boolean},storage:{message:string, success:boolean}} = await response.json();
        return { firestore: data.firestore, storage: data.storage };
    } else {
        return { firestore: { success: false, message: "Firestore deletion failed" }, storage: { success: false, message: "Storage deletion failed" } };
    }
};

// DONE
export const deleteSpotWithHistoryReset = async ({
    userId,
    spotId,
    deleteType,
    storage_name
}:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/delete/melanoma-with-history-reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, spotId, deleteType, storage_name }),
    });

    if(response.ok){
        const data:{firestore:{message:string,success:boolean},storage:{message:string, success:boolean}} = await response.json();
        return { firestore: data.firestore, storage: data.storage };
    } else {
        return { firestore: { success: false, message: "Firestore deletion failed" }, storage: { success: false, message: "Storage deletion failed" } };
    }
    // const deleteFromFirestore = async () => {
    //     try {
    //         if(deleteType == "history"){
    //             const ref = doc(db, "users", userId, "Melanoma", spotId, "History",storage_name);            
    //             await deleteDoc(ref);
    //             return { success: true, message: "Deleted from Firestore" };
    //         } else if ( deleteType == "latest" ) {
    //             const ref = doc(db, "users", userId, "Melanoma", spotId);                                    
    //             const closest = collection(db, "users", userId, "Melanoma", spotId, "History");
    //             const snapshot = await getDocs(closest)
    //             if (!snapshot.empty) {
    //                 let historyData = [];
    //                 snapshot.forEach((doc) => {
    //                     historyData.push(doc.data());
    //                 });
    //                 historyData.sort((a, b) => {
    //                     return b.created_at.seconds - a.created_at.seconds;
    //                 });
    //                 const elementWithHighestDate = historyData[0];       
    //                 //DELETE
    //                 const closestDelete = doc(db, "users", userId, "Melanoma", spotId, "History",elementWithHighestDate.storage_name);
    //                 await deleteDoc(closestDelete)
    //                 //SET NEW
    //                 await setDoc(ref,elementWithHighestDate)
    //                 return { success: true, message: "Deleted from Firestore" };                      
    //             } else {
    //                 await deleteDoc(ref)
    //                 return { success: true, message: "Deleted from Firestore" };   
    //             }                                               
    //         }
    //     } catch (error) {
    //         console.error("Error deleting from Firestore:", error);
    //         return { success: false, message: "Failed to delete from Firestore" };
    //     }
    // };

    // const deleteFromStorage = async () => {
    //     try {
    //         const path = `users/${userId}/melanomaImages/${storage_name}`;
    //         const storageRef = ref(storage, path);
    //         await deleteObject(storageRef);
    //         return { success: true, message: "Deleted from Storage" };
    //     } catch (error) {
    //         console.error("Error deleting from Storage:", error);
    //         return { success: false, message: "Failed to delete from Storage" };
    //     }
    // };

    // try {
    //     const firestoreRes = await deleteFromFirestore();
    //     const storageRes = await deleteFromStorage();
    //     return { firestore: firestoreRes, storage: storageRes };
    // } catch (error) {
    //     console.error("Error deleting spot:", error);
    //     return { firestore: { success: false, message: "Firestore deletion failed" }, storage: { success: false, message: "Storage deletion failed" } };
    // }
};

//DONE
export const fetchNumberOfMoles = async ({
    userId,
    gender
}:API_Melanoma):
    Promise < {
        all: number;
        bening: number;
        malignant: number;
        outdated: number;
        completed: number;
    } | null> =>{
    const response = await fetch(`${DOMAIN}/client/get/number-of-melanoma`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            gender
        })}
    );

    if(response.ok){
        const data = await response.json();
        return data;
    } else {
        return null
    }
}

//DONE
export const fetchNumberOfMolesOnSlugs = async ({
    userId, 
}:API_Melanoma):Promise <numberOfMolesOnSlugs | []> =>{
    const response = await fetch(`${DOMAIN}/client/get/number-of-melanoma-on-slug`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
        })}
    );

    if(response.ok){
        const data = await response.json();
        return [data] as numberOfMolesOnSlugs;
    } else {
        return []
    }
}

// DONE
export const updateCompletedParts = async ({
    userId,
    completedArray
}:API_Melanoma):Promise<boolean> => {
    const response = await fetch(`${DOMAIN}/client/update/completed-parts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, completedArray }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}

// DONE
export const fetchCompletedParts = async ({
    userId
}:API_Melanoma): Promise<{slug:Slug}[] | null> => {
    const response = await fetch(`${DOMAIN}/client/get/completed-parts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });
    
    if(response.ok){
        const data = await response.json();
        return data;
    } else {
        return null
    }
}

//DONE
export const fetchSpecialSpots = async ({
    userId
}:API_Melanoma): Promise <SpecialSpotResponse | null> => {
    try{
        const response = await fetch(`${DOMAIN}/client/get/special-moles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });
        if(response.ok){
            const data = await response.json();
            console.log("Special spots data:", data);  // Correct logging
            return data;
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

//DONE
export const fetchSkinType = async ({
    userId
}:API_Melanoma):Promise <SkinType | null> => {
    const response = await fetch(`${DOMAIN}/client/get/skin-type`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data = await response.json();
        return data as SkinType;
    } else {
        return null
    }
}

//DONE
export const fetchSingleMoleById = async ({
    userId,
    moleId
}:API_Melanoma):Promise <null | SpotData> => {
    const response = await fetch(`${DOMAIN}/client/get/melanoma--by-id`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, moleId }),
    });

    if(response.ok){
        const data = await response.json();
        return data as SpotData;
    } else {
        return null
    }
}

//DONE
export const checkUniqueBirthmarkId = async ({
    userId,
    pendingUID
}:{
    userId:string,
    pendingUID:string
}):Promise<boolean> => {
    const response = await fetch(`${DOMAIN}/client/check-uid/melanoma`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, pendingUID }),
    });

    if(response.ok){
        const data:{checkResult:boolean} = await response.json();
        return data.checkResult;
    } else {
        return null
    }
}

//<===> USER <====>

//DONE
export const fetchUserData = async ({
    userId
}: { userId: string }): Promise<UserData | null> => { 
    try {
        const response = await fetch(`${DOMAIN}/client/get/user-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });
        if(response.ok){
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

//DONE - Not Tested
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
        // if (fieldNameToChange == "gender"){
        //     changeData(fieldNameToChange)
        // }
        // if (fieldNameToChange == "birth_date"){
        //     changeData(fieldNameToChange)
        // }
        // return true
        const response = await fetch(`${DOMAIN}/client/change/personal-data`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fieldNameToChange, dataToChange, userId }),
        });
        if(response.ok){
            return true;
        }
    } catch {
        return false
    }
}


//<===> DIAGNOSIS <====>

//DONE
export const fetchAllDiagnosis = async ({
    userId
}:API_Diagnosis):Promise <DiagnosisData[] | false | "NoDiagnosis"> => {
    const response = await fetch(`${DOMAIN}/client/get/diagnosis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data = await response.json();
        if(data != "NoDiagnosis"){
            return data as DiagnosisData[];
        }
        return "NoDiagnosis"
    } else {
        return false
    }
}

//DONE
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

// DONE
export const saveBloodWork = async ({
    userId,
    higherRisk,
    data,
    Create_Date,
    id
}:API_BloodWork) => {
    const response = await fetch(`${DOMAIN}/client/upload/blood`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            higherRisk,
            data,
            Create_Date,
            id
        }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}

// DONE
export const updateBloodWork = async ({
    userId,    
    data,
    Create_Date,
    id,
    higherRisk  
}:API_BloodWork):Promise <boolean> => {
    const response = await fetch(`${DOMAIN}/client/update/blood`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            data,
            Create_Date,
            id,
            higherRisk
        }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
};

// DONE
export const fetchBloodWork = async ({
    userId,
}:{userId:string}): Promise<BloodWorkDoc | null> => {
    const response = await fetch(`${DOMAIN}/client/get/blood`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data = await response.json();
        return data as BloodWorkDoc;
    } else {
        return null
    }
}

// DONE
export const fetchBloodWorkHistory = async ({
    userId,
}:API_BloodWork):Promise <"NoHistory" | false | BloodWorkCategory[]> => {
    const response = await fetch(`${DOMAIN}/client/get/blood-history`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data = await response.json();
        if(data != "NoHistory"){
            return data as BloodWorkCategory[];
        } else {
            return "NoHistory"
        }
    } else {
        return false
    }
}



//<===> Payment <====>

// DONE
export const handleSuccesfullPayment = async ({
    checkOutData,
    session_UID
}:{
    checkOutData:Success_Purchase_Client_Checkout_Data,
    session_UID:string
    }):Promise <boolean> => {
        const response = await fetch(`${DOMAIN}/client/handle/successful-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ checkOutData, session_UID }),
        });

        if(response.ok){
            return true;
        } else {
            return false;
        }
}

//<===> Asssistants <====>

//DONE
export const fetchAssistantsByField = async ({
    field
}:{
    field:AssistanceFields
}):Promise <null | AssistantData[] | "NoAssistant"> => {
    const response = await fetch(`${DOMAIN}/assistant/get-by-field/data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ field }),
    });

    if(response.ok){
        const data = await response.json();
        if(data != "NoAssistant"){
            return data as AssistantData[];
        } else {
            return "NoAssistant"
        }
    } else {
        return null
    }
}

//DONE
export const fetchAssistantSessions = async({
    userId
}):Promise <[] | Success_Purchase_Client_Checkout_Data[]> => {
    const response = await fetch(`${DOMAIN}/client/get/user-sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data = await response.json();
        console.log(data[0].chat)
        return data as Success_Purchase_Client_Checkout_Data[];
    } else {
        return []
    }
}

//DONE
export const realTimeUpdateChat = async ({
    userId,
    sessionId,
    chat
}):Promise <boolean>  => {
    const response = await fetch(`${DOMAIN}/assistant/update/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, sessionId, chat }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}


//DONE
export const fetchChat = async({sessionId,clientId}:{sessionId:string,clientId:string}):Promise <[] | {date:Timestamp | Date, message:string, inline_answer:boolean,sent:boolean,user:string}[]> => {
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