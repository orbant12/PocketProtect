

// ASSISTANCE TYPES

import {  ReportinspectType } from "@/services/api";



type Assistance_Fields = "dermotologist" 

export type AssistantData = {
    fullname: string,
    email:string,
    field: string,
    phone: string,
    id: string,
    profileUrl: string,
}

//CLIENT TYPES

export type Gender = "male" | "female"

type UserData = {
    profileUrl: string,
    fullname: string,
    email: string,
    id:string,
    user_since: string,
    birth_date: Date | Timestamp | string,
}




//Session TYPES

export type Product_Types = "mole_check" | "full_melanoma_check";

export type SessionType = {
    answered:boolean;
    date:string;
    assistantData:{
        fullname:string;
        id:string;
        profileUrl:string;
        email:string;
        field:Assistance_Fields;
    };
    clientData:{
        fullname:string;
        id:string;
        profileUrl:string;
        email:string;
        birth_date:Timestamp;
        gender:Gender;
    };
    chat:{date:Timestamp | Date, message:string, inline_answer:boolean,sent:boolean,user:string}[];
    id:string;
    purchase:{
        type:Product_Types;
        item:SpotData[];
    },
    created_at:Timestamp | Date;
    result_documents: ReportinspectType | null;
}


//MELNAOMO TYPES

export type SkinType = 0 | 1 | 2 | 3;

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


// Special Data structure types

export type Timestamp = {
    seconds: number,
    nanoseconds: number
}