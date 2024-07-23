import { collection, doc,getDocs, getDoc,updateDoc,deleteDoc,setDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import { AssistantData, SessionType, SpotData } from "@/utils/types";
import { MoleAnswers, OverallResultAnswers, ResultAnswers } from "@/app/assistant/sessions/[id]/page";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface FetchingProps{
    userId: string;
}

type RespondDocument = {
    inspect: Record<string, MoleAnswers>;
    results: Record<string, ResultAnswers>; 
 };

export interface ReportinspectType {
    inspect: Record<string, MoleAnswers>;
    results: Record<string, ResultAnswers>; 
    overall_results:{
        chance_of_cancer:{
            answer: 0 | 1 | 2 | 3 | 4,
            description:string
        }
    },
    pdf?: any;
}



export const fetchAllAssistantIDs = async () => {
    try {
        const ref = collection(db, "assistants");
        const snapshot = await getDocs(ref);
        let assistantIDs: string[] = [];
        snapshot.forEach((doc) => {
            assistantIDs.push(doc.id);
        });

        return assistantIDs;
    } catch (err) {
        console.error("Error fetching assistant IDs:", err);
        return [];
    }
};

export const fetchSingleAssistantData = async ({ userId }:FetchingProps) => {
    try {
        const ref = doc(db, "assistants", userId);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            return snapshot.data() as AssistantData ;
        } else {
            console.error(`Assistant with ID ${userId} does not exist.`);
            return null;
        }
    } catch (err) {
        console.error("Error fetching assistant data:", err);
        return null;
    }
};


export const fetchSessions_All = async ({ userId }:FetchingProps) => {
    try{
        const ref = collection(db, "assistants",userId,"Sessions");
        const snapshot = await getDocs(ref);
        let assistantSession: any[] = [];
        snapshot.forEach((doc) => {
            assistantSession.push(doc.data());
        });
        return assistantSession;
    } catch(err) {
        return [{err}]
    }
}

export const fetchSession_Single = async ({sessionId,userId} : {sessionId:string,userId:string}):Promise <SessionType | null> => {
    try{
        const ref = doc(db, "assistants",userId,"Sessions",sessionId)
        const snapshot = await getDoc(ref)
        if (snapshot.exists()) {
            return snapshot.data() as SessionType;
        } else {
            return null;
        }
    } catch {
        return null
    }
}

export const fetchSessionSingleOrder = async ({
    sessionId,
    userId,
}: {
    sessionId: string;
    userId: string;
}): Promise<RespondDocument | null> => {
    try {
        const ref = doc(db, "assistants", userId, "Sessions", sessionId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            return null;
        }

        const data = snapshot.data() as SessionType;
        if(data.result_documents){
        const inspectData = data.result_documents.inspect
        const resultData = data.result_documents.results

        const respondDocument: RespondDocument = {
            inspect: inspectData,
            results: resultData
        };

        return respondDocument;
        } else {
            return null
        }

    } catch (error) {
        return null;
    }
};

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


export const realTimeUpdateChat = async ({
    userId,
    sessionId,
    chat
}:{
    userId:string;
    sessionId:string;
    chat: any[];
}) => {
    try{
        const ref = doc(db, "users", userId, "Assist_Panel", sessionId) 
        await updateDoc(ref,{chat:[...chat]})
        return true
     } catch(Err) {
        return Err
     }
}

export const fetchRequests = async ({userId}:{userId:string}) => {
    try{
        const ref = collection(db,"assistants",userId,"Requests")
        const snapshot = await getDocs(ref)
        let requests: any[] = [];
        snapshot.forEach((doc) => {
            requests.push(doc.data());
        });
        return requests;
    } catch(err) {
        console.log(err)
        return [{err}]
    }
}

export const handleRequestAccept = async ({sessionData}:{sessionData:SessionType}) => {
    try{
        const ref = doc(db,"assistants",sessionData.assistantData.id,"Sessions",sessionData.id)
        const reqRef = doc(db,"assistants",sessionData.assistantData.id,"Requests",sessionData.id)
        const response_document = await setupDocumentsForAssistant({sessionData})
        if(response_document != false){
            sessionData.result_documents = response_document as ReportinspectType
            await setDoc(ref,sessionData)
        }
        await deleteDoc(reqRef)
        return true
    } catch(err) {
        const reqRef = doc(db,"assistants",sessionData.assistantData.id,"Requests",sessionData.id)
        await setDoc(reqRef,sessionData)
        console.log(err)
        return false
    }
}

export const fetchMoleHistory = async ({moleId,userId}:{moleId:string,userId:string}) => {
    try{
        const ref = collection(db,"users",userId,"Melanoma",moleId,"History")
        const snapshot = await getDocs(ref)
        let history: any[] = [];
        snapshot.forEach((doc) => {
            history.push(doc.data());
        })
        return history;
    } catch {
        return null
    }
}

export const setupDocumentsForAssistant = async ({ sessionData }: { sessionData: SessionType }): Promise<ReportinspectType | false> => {
    try {
        const stateObjectForOrders = sessionData.purchase.item.reduce((acc: Record<string, MoleAnswers>, item: SpotData) => {
            acc[item.melanomaId] = {
                asymmetry: { answer: "", description: "" },
                border: { answer: "", description: "" },
                color: { answer: "", description: "" },
                diameter: { answer: "", description: "" },
                evolution: { answer: "", description: "" },
                id: item.melanomaId,
            };
            return acc;
        }, {});

        const stateObjectForResults = sessionData.purchase.item.reduce((acc: Record<string, ResultAnswers>, item: SpotData) => {
            acc[item.melanomaId] = {
                mole_malignant_chance: { answer: 0, description: "" },
                mole_evolution_chance: { answer: 0, description: "" },
                mole_advice: "",
                id: item.melanomaId,
            };
            return acc;
        }, {});

        const result_documents: ReportinspectType = {
            inspect: stateObjectForOrders,
            results: stateObjectForResults,
            overall_results: {
                chance_of_cancer: {
                    answer: 0,
                    description: "",
                },
            },
        };

        return result_documents;
    } catch (err) {
        console.error("Error setting up documents for assistant:", err);
        return false;
    }
};


export const updateInspectMole_Results = ({userId,sessionId,moleId,inspectData,resultData}:{
    userId:string;
    sessionId:string;
    moleId:string;
    inspectData: MoleAnswers;
    resultData: ResultAnswers;
}) => {
    try{
        const ref = doc(db,"assistants",userId,"Sessions",sessionId)
        updateDoc(ref,{
            [`result_documents.inspect.${moleId}`]:inspectData,
            [`result_documents.results.${moleId}`]:resultData
        })
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

export const uploadAnalasisResults = async ({sessionData,inspectData,resultData,overallResults,pdfBlob}:
    {
        sessionData:SessionType;inspectData:Record<string,MoleAnswers>;resultData:Record<string,ResultAnswers>;overallResults:OverallResultAnswers;pdfBlob:any}) => {
    try{
        const docRef = doc(db,"users",sessionData.clientData.id,"Assist_Panel",sessionData.id)
        const assistantRef = doc(db,"assistants",sessionData.assistantData.id,"Complete_Sessions",sessionData.id)
        const deleteRef = doc(db,"assistants",sessionData.assistantData.id,"Sessions",sessionData.id)
        const storageRef = ref(storage,`users/${sessionData.clientData.id}/melanomaResults"/${sessionData.id}.pdf`)
        await uploadBytes(storageRef,pdfBlob)
        const url = await getDownloadURL(storageRef)
        await updateDoc(docRef,{
            result_documents:{
                inspect:inspectData,
                results:resultData,
                overall_results:overallResults,
                pdf: url
            },
        })
        await deleteDoc(deleteRef)
        await setDoc(assistantRef,sessionData)

        return true
    } catch(err) {
        const deleteRef = doc(db,"assistants",sessionData.assistantData.id,"Sessions",sessionData.id)
        await setDoc(deleteRef,sessionData)
        console.log(err)
        return false
    }
}