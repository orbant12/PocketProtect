
//<========> MELANOMA <=========>

type Gender = "female" | "male";
type SkinType = 0 | 1 | 2 | 3;
type UpdateMethod = {} | "new"

interface NavigationParams {
    bodyPart: any[];
    gender: Gender;
    skin_type: SkinType;
    userData: any[];
    navigation: any;
    type: UpdateMethod;
}

export const Navigation_SingleSpotAnalysis = ({
    bodyPart = [],
    gender = "female",
    skin_type = 0,
    userData = [],
    navigation
}: NavigationParams) => {

    if (bodyPart && gender && skin_type !== undefined && userData) {
        navigation.navigate("SinglePartAnalasis", { 
            bodyPart: bodyPart,
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
