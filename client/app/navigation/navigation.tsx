

//<========> MELANOMA <=========>

export type Gender = "female" | "male" | string;
export type SkinType = 0 | 1 | 2 | 3;
type UpdateMethod = {} | "new";
type Progress = Number | null;

export type UserData = {
    id:string;
    fullname:string;
    gender: Gender;
    birth_date: Date;
    email:string;
    profilePictureUrl:string;
    user_since:string;
}

export type SpotData = {
    melanomaId:`Birthmark#${number}`;
    melanomaDoc:{
        location:{x:number,y:number},
        spot:[
            slug:string,
            pathArray: any[],
            color:string,
        ]
    },
    risk:number;
    gender:Gender;
    created_at: Date;
    storage_name:string;
    storage_location:string;
    melanomaPictureUrl:string;
}

interface MelanomaNavigationParams {
    melanomaId?: string;
    bodyPart?: SpotData;
    gender?: Gender;
    skin_type?: SkinType;
    userData?: UserData;
    navigation: any;
    type?: UpdateMethod;
    completedArray?: any[];
    progress?: Progress
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

export const Navigation_AddSlugSpot = ({
    userData,
    bodyPart,
    skin_type = 0,   
    type = {},
    navigation
}: MelanomaNavigationParams) => {

    if (userData && bodyPart && skin_type !== undefined && type) {
        navigation.navigate("MelanomaAdd",{ 
            userData: userData,
            skin_type: skin_type,
            bodyPart:bodyPart,
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
    bodyPart,
    gender,
    completedArray = [],
    progress,
    skin_type,
}:MelanomaNavigationParams) => {
    if ( navigation != undefined ){
        navigation.navigate("MelanomaProcessSingleSlug",{
            bodyPart:bodyPart,
            gender: gender,
            completedArray: completedArray,
            progress: progress,
            skin_type: skin_type,
        })
    }       
}


//<========> Assistance <=========>

interface AssistanceNavigationParams {
    navigation: any;
}

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

