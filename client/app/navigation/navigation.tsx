

//<========> MELANOMA <=========>

import { SpotData,BodyPart,Gender,SkinType,SpotArrayData,UserData } from "../utils/types";



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
    gender,
    skin_type,
    userData,
    navigation
}: MelanomaNavigationParams) => {

    if (melanomaId && gender && skin_type !== undefined && userData) {
        navigation.navigate("SinglePartAnalasis", { 
            melanomaId: melanomaId,
            gender: gender,
            skin_type: skin_type,
            userData: userData
        });        
    } else {
        alert("Something went wrong");
    }
};

export const Navigation_SlugAnalysis = ({
    bodyPartSlug,
    userData,
    skin_type,
    navigation
}:MelanomaNavigationParams) => {
    if ( navigation != undefined ) {
        navigation.navigate("SlugAnalasis",{
            bodyPartSlug: bodyPartSlug,
            userData:userData,
            skin_type:skin_type,
        })
    }
}

export const Navigation_AddSlugSpot = ({
    userData,
    bodyPartSlug,
    skin_type = 0,   
    type,
    navigation
}: MelanomaNavigationParams) => {

    if (userData && bodyPartSlug && skin_type !== undefined && type) {
        navigation.navigate("MelanomaAdd",{ 
            userData: userData,
            skin_type: skin_type,
            bodyPartSlug:bodyPartSlug,
            type:type
        });      
    } else {
        alert("Something went wrong");
    }
};

export const Navigation_MoleUpload_1 = ({
    gender,
    skin_type,
    navigation
}:MelanomaNavigationParams) => {
    navigation.navigate("MelanomaAllAdd", {         
        gender: gender,
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

