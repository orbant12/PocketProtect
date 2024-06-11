
//<========> MELANOMA <=========>

type Gender = "female" | "male";
type SkinType = 0 | 1 | 2 | 3;
type UpdateMethod = {} | "new"

interface NavigationParams {
    melanomaId: string;
    bodyPart: any[];
    gender?: Gender;
    skin_type?: SkinType;
    userData?: any[];
    navigation: any;
    type: UpdateMethod;
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

export const Navigation_MoleUpload = ({
    gender,
    skin_type,
    navigation
}:NavigationParams) => {
    navigation.navigate("MelanomaAllAdd", {         
        gender: gender,
        skin_type: skin_type,
    });        
}





