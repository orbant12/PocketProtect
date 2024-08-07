
import { Timestamp } from "../utils/date_manipulations";
import { Gender, SkinType, Slug, SpotData, Success_Purchase_Client_Checkout_Data, UserData,AssistanceFields, AssistantData, DiagnosisData, WeatherAPIResponse } from "../utils/types";
import { MelanomaMetaData } from "../pages/Libary/Melanoma/melanomaCenter";
import { numberOfMolesOnSlugs } from "../components/LibaryPage/Melanoma/slugCard";
import { getWeatherAPIKey } from "../../key";


//export const FLASK_DOMAIN = "http://51.21.97.54:5001"
//const DOMAIN = "http://51.21.97.54:3001";

const DOMAIN = "http://localhost:3001";
export const FLASK_DOMAIN =  "http://localhost:5001";

type SpotDeleteTypes = "history" | "latest"

type userFields = "gender" | "birth_date" | "profileUrl"


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
    fieldNameToChange?: userFields;
    dataToChange?: any;
    profileBlob?:string;
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

export interface WeatherApiCallTypes {
    lat?: number;
    lon?: number;
    part?: "current" | "minutely" | "hourly" | "daily";
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
    gender
}:API_Melanoma):Promise <numberOfMolesOnSlugs | []> =>{
    const response = await fetch(`${DOMAIN}/client/get/number-of-melanoma-on-slug`, {
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
    userId,
    gender
}:API_Melanoma): Promise <SpecialSpotResponse | null> => {
    try{
        const response = await fetch(`${DOMAIN}/client/get/special-moles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId,gender }),
        });
        if(response.ok){
            const data = await response.json();
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

export const updateSkinType = async ({
    userId,
    newType
}:{
    userId:string;
    newType:SkinType
}):Promise<boolean> => {
    const response = await fetch(`${DOMAIN}/client/update/skin-type`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId,newType }),
    });

    if(response.ok){
        return true;
    } else {
        return false
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

export const changeMelanomaPicture = async ({
    userId,
    melanomaBlob,
    spotId
}:API_Melanoma) => {
    const response = await fetch(`${DOMAIN}/client/change/melanoma-picture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, melanomaBlob, spotId }),
    });

    if(response.ok){
        return true;
    } else {
        return false
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
        return null;
    }
};

//DONE - Not Tested
export const changePersonalData = async ({
    fieldNameToChange,
    dataToChange,
    userId,
}:API_User):Promise <boolean> => {    
        const response = await fetch(`${DOMAIN}/client/update/user-data`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fieldNameToChange, dataToChange, userId }),
        });
        if(response.ok){
            return true;
        } else {
            return false
        }

}

//DONE
export const changeProfilePicture = async ({
    userId,
    profileBlob
}:API_User):Promise<boolean>  => {
    const response = await fetch(`${DOMAIN}/client/update/profile-picture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, profileBlob }),
    });

    if(response.ok){
        return true;
    } else {
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
}:API_Diagnosis):Promise <boolean>  => {
    const response = await fetch(`${DOMAIN}/client/upload/diagnosis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, data }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}

export const deleteDiagnosis = async ({
    diagnosisId,
    userId,
}:{
    diagnosisId:string,
    userId:string
}):Promise<boolean> => {
    const response = await fetch(`${DOMAIN}/client/delete/diagnosis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ diagnosisId, userId }),
    });

    if(response.ok){
        return true;
    } else {
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
    const response = await fetch(`${DOMAIN}/assistant/get/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, clientId }),
    });

    if(response.ok){
        const data = await response.json();
        return data;
    } else {
        return []
    }
}

//<============== | WETAHER API | ===============>

export const getWeatherData = async({
    lat,
    lon,
    part,
}:WeatherApiCallTypes):Promise<null | any> => {
    const API_key = getWeatherAPIKey();
    const WEATHER_API = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current&appid=${API_key}`;
    const response = await fetch(WEATHER_API, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if(response.ok){
        const data : WeatherAPIResponse = await response.json();
        return data;
    } else {
        return null;
    }
}


//<============== | Meta Data | ===============>

export const fetchAllergies =  async ({userId}:{userId:string}):Promise <{"allergiesArray":string[]}> => {
    const response = await fetch(`${DOMAIN}/client/get/allergies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if(response.ok){
        const data :  {"allergiesArray":string[]} = await response.json();
        if(data.allergiesArray != null){
            return data;
        } else {
            return {"allergiesArray":[]}
        } 
    } else {
        return {"allergiesArray":[]}
    }
}

export const updateAllergies =  async ({userId,newData}:{userId:string,newData:string[]}):Promise <boolean> => {
    const response = await fetch(`${DOMAIN}/client/update/allergies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newData }),
    });

    if(response.ok){
        return true;
    } else {
        return false
    }
}
 