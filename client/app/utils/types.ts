//<===================== MELANOOMA ==========================>

import { Timestamp } from "./date_manipulations";

//BODY-PART
export type Slug =
    | "abs"
    | "head"
    | "left-arm"
    | "right-arm"
    | "chest"
    | "upper-leg-right"
    | "upper-leg-left"
    | "lower-leg-right"
    | "lower-leg-left"
    | "left-feet"
    | "right-feet"
    | "right-hand"
    | "left-hand"
    | "back"
    | "head(back)"
    | "left-arm(back)"
    | "right-arm(back)"
    | "left-leg(back)"
    | "right-leg(back)"
    | "left-feet(back)"
    | "right-feet(back)"
    | "right-palm"
    | "left-palm"
    | "legs"
    | "torso"
    | "feet"
    | ""
    | "gluteal";

export interface BodyPart {
    intensity?: number;
    color: string;
    slug: Slug;
    pathArray: string[];
}

export type SpotData = {
    melanomaId:string;
    melanomaDoc:{
        location:{x:number,y:number},
        spot:[
            {slug:Slug,
            pathArray: any[],
            color:string,}
        ]
    },
    risk:number | null;
    gender:Gender;
    created_at: Timestamp | Date;
    storage_name:string;
    storage_location:string;
    melanomaPictureUrl:string;
}

export type SpotArrayData = {
    slug:Slug,
    pathArray: any[],
    color:string
}


export type SkinType = 0 | 1 | 2 | 3;

//<===================== USER DATA ==========================>

export type Gender = "female" | "male";


export type UserData = {
    id:string;
    fullname:string;
    gender: Gender;
    birth_date: Date;
    email:string;
    profilePictureUrl:string;
    user_since:string;
}


//<===================== ASSISTANT ==========================>

export type AssistanceFields = "dermatologist" 

export type AssistantData = {
    fullname:string;
    email:string;
    profileUrl:string;
    id:string;
    field:AssistanceFields;
}

export type Products = "mole_check" | "full_melanoma_check";

export type Success_Purchase_Client_Checkout_Data = {
    answered:boolean;
    assistantData:{
        fullname:string;
        id:string;
        profileUrl:string;
        email:string;
        field:AssistanceFields;
    };
    clientData:{
        fullname:string;
        id:string;
        profileUrl:string;
        email:string;
        birth_date:Date | Timestamp;
        gender:Gender;
    };
    chat:{date:Timestamp | Date, message:string, inline_answer:boolean,sent:boolean,user:string}[];
    id:string;
    purchase:{
        type:Products;
        item:any[];
    }
}

export type Success_Purchase_Assistant_Checkout_Data = {
    answered:boolean;
    clientData:{
        fullname:string;
        id:string;
        profileUrl:string;
        email:string;
    };
    assistantData:{
        fullname:string;
        id:string;
        profileUrl:string;
    };
    chat:{date:Timestamp | Date, message:string, inline_answer:boolean,sent:boolean,user:string}[];
    id:string;
    purchase:{
        type:Products;
        item:any[];
    }
}