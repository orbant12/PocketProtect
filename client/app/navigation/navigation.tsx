
//<========> MELANOMA <=========>

type Gender = "female" | "male";
type SkinType = 0 | 1 | 2 | 3;
type UpdateMethod = {} | "new";
type Progress = Number | null;

interface NavigationParams {
    melanomaId: string;
    bodyPart: any[];
    gender?: Gender;
    skin_type?: SkinType;
    userData?: any[];
    navigation: any;
    type: UpdateMethod;
    completedArray: any[];
    progress: Progress
}

export const Navigation_SingleSpotAnalysis = ({
    melanomaId,
    gender = "female",
    skin_type = 0,
    userData = [],
    navigation
}: NavigationParams) => {

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
    userData = [],
    bodyPart = [],
    skin_type = 0,   
    type = {},
    navigation
}: NavigationParams) => {

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
}:NavigationParams) => {
    navigation.navigate("MelanomaAllAdd", {         
        gender: gender,
        skin_type: skin_type,
    });        
}

export const Navigation_MelanomaCenter = ({
    navigation
}:NavigationParams) => {
    if ( navigation != undefined){
        navigation.navigate("MelanomaCenter")
    }       
}

export const Navigation_MelanomaFullsetup = ({
    navigation
}:NavigationParams) => {
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
}:NavigationParams) => {
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





