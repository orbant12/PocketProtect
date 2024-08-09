

//<========> MELANOMA <=========>

import { SpotData,BodyPart,Gender,SkinType,SpotArrayData,UserData, ContextToggleType, DiagnosisData } from "../utils/types";



export type UpdateMethod = {id:string,locationX:number,locationY:number};

export type Progress = number | null;

export interface MelanomaNavigationParams {
    melanomaId?: string;
    bodyPartSlug?: BodyPart;
    bodyPart?: SpotData;
    gender?: Gender;
    skin_type?: SkinType;
    userData?: UserData;
    navigation: any;
    type?: UpdateMethod;
    completedArray?: any[];
    progress?: Progress;
    bodyPartSpotArray?: SpotArrayData;
}

interface AssistanceNavigationParams {
    navigation: any;
}


export const Navigation_SingleSpotAnalysis = ({
    melanomaId,
    skin_type,
    navigation
}: MelanomaNavigationParams) => {

    if (melanomaId && skin_type !== undefined) {
        navigation.navigate("SinglePartAnalasis", { 
            melanomaId: melanomaId,
            skin_type: skin_type,
        });        
    } else {
        alert("Something went wrong");
    }
};

export const Navigation_SlugAnalysis = ({
    bodyPartSlug,
    skin_type,
    navigation
}:MelanomaNavigationParams) => {
    if ( navigation != undefined ) {
        navigation.navigate("SlugAnalasis",{
            bodyPartSlug: bodyPartSlug,
            skin_type:skin_type,
        })
    }
}

export const Navigation_AddSlugSpot = ({
    bodyPartSlug,
    skin_type = 0,   
    type,
    navigation
}: MelanomaNavigationParams) => {

    if (bodyPartSlug && skin_type !== undefined && type) {
        navigation.navigate("MelanomaAdd",{ 
            skin_type: skin_type,
            bodyPartSlug:bodyPartSlug,
            type:type
        });      
    } else {
        alert("Something went wrong");
    }
};

export const Navigation_MoleUpload_1 = ({
    skin_type,
    navigation
}:MelanomaNavigationParams) => {
    navigation.navigate("MelanomaAllAdd", {         
        skin_type: skin_type,
    });        
}

export const Navigation_MelanomaCenter = ({
    navigation
}:MelanomaNavigationParams) => {
    if ( navigation != undefined){
        navigation.navigate("MelanomaCenter")
    }       
}

export const Navigation_MelanomaFullsetup = ({
    navigation
}:MelanomaNavigationParams) => {
    if ( navigation != undefined){
        navigation.navigate("FullMelanomaProcess")
    }       
}

export const Navigation_MoleUpload_2 = ({
    navigation,
    bodyPartSlug,
    gender,
    completedArray = [],
    progress,
    skin_type,
}:MelanomaNavigationParams) => {
    if ( navigation != undefined ){
        navigation.navigate("MelanomaProcessSingleSlug",{
            bodyPartSlug:bodyPartSlug,
            gender: gender,
            completedArray: completedArray,
            progress: progress,
            skin_type: skin_type,
        })
    }       
}


//<========> Assistance <=========>

export const Navigation_AssistCenter = ({
    navigation
}:AssistanceNavigationParams) => {
    if ( navigation != undefined ) {
        navigation.navigate("AssistCenter")
    }
}

export const Navigation_AI_Assistant = ({
    navigation
}:AssistanceNavigationParams) => {
    if ( navigation != undefined ) {
        navigation.navigate("AI_Assistant")
    }
}

export const Navigation_AI_Diagnosis = ({
    navigation
}:AssistanceNavigationParams) => {
    if ( navigation != undefined ) {
        navigation.navigate("AI_Diagnosis")
    }
}


export const Navigation_AI_Chat = ({
    navigation,
    chatLog,
    contextToggles,
    preQuestion,
    userContexts
}:{
    navigation:any,
    chatLog:any[],
    contextToggles?:ContextToggleType;
    preQuestion?:{c_t:"blood_work" | "uv" | "medical" | "bmi" | "weather",message:string};
    userContexts:any;
}) => {
    if(navigation != undefined && chatLog != undefined){
        navigation.navigate("AI_Chat",{chatLog:chatLog,contextToggles:contextToggles,preQuestion:preQuestion,userContexts:userContexts})
    }
}

export const Navigation_Diag_Input = ({
    navigation,
    contextToggles,
    userContexts,
}:{
    contextToggles?:ContextToggleType,
    userContexts:any,
    navigation:any
}) => {
    if (navigation != undefined){
        navigation.navigate("Diagnosis_Chat",{contextToggles:contextToggles,userContexts:userContexts})
    }
}

export const Navigation_Diag_Survey = ({
    surveyData,
    result,
    isDone,
    navigation  
}:{
    surveyData:{type:string,q:string}[],
    result:{possibleOutcomes:string, clientSymptoms:string},
    isDone:string,
    navigation:any
}) => {
    try {
        surveyData.forEach((item) => {
            if(item.type == "feedback" || item.type == "binary"){
                
            }
        })
        if(navigation != undefined){
            navigation.navigate("SurveyScreen", {surveyData: surveyData, possibleOutcomes: result.possibleOutcomes, clientSymptoms: result.clientSymptoms,isDone: isDone})
        }
    } catch (error) {
        alert("Something went wrong")
    }

}

export const Navigation_Diag_Center = ({
    diagnosisData,
    navigationType,
    navigation
}:{
    diagnosisData?:DiagnosisData,
    navigationType:"from_diagn" | "other",
    navigation:any
}) => {
    if ( navigation != undefined && navigationType != undefined){
        navigation.navigate("DiagnosisCenter",{diagnosisData:diagnosisData,navigationType:navigationType})
    }
}

export const Navigation_AddBloodWork = ({
    navigation,
    type
}:{
    navigation:any,
    type:"first" | "update"
}) => {
    if ( navigation != undefined){
        navigation.navigate("Add_BloodWork",{type:type})
    }
}