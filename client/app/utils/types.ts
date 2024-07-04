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
    color?: string;
    slug: Slug;
    pathArray?: string[];
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
    profileUrl:string;
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

export type Product_Types = "mole_check" | "full_melanoma_check";


export interface Answer {
    answer: string;
    description: string;
}

export interface Result {
    answer: 0 | 1 | 2 | 3 | 4 | 5;
    description: string;
}
export interface MoleAnswers {
    asymmetry: Answer;
    border: Answer;
    color: Answer;
    diameter: Answer;
    evolution: Answer;
    id:string;
}

export interface ResultAnswers {
    mole_malignant_chance: Result;
    mole_evolution_chance: Result;
    mole_advice: string;
    id:string;
}

export interface ReportInspectType {
    inspect: Record<string, MoleAnswers>;
    results: Record<string, ResultAnswers>; 
    overall_results:{
        chance_of_cancer:{
            answer: 0 | 1 | 2 | 3 | 4,
            description:string
        }
    },
    pdf:string;

}

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
        type:Product_Types;
        item:any[];
    },
    created_at:Timestamp | Date;
    result_documents?: ReportInspectType | null;
}



export type PromptEngineering_Feedback_Type = "binary" | "feedback";

export type DiagnosisData = {
    title:string;
    clientSymphtoms:string;
    created_at:Timestamp | Date | string;
    diagnosis:string;
    id:string;
    possibleOutcomes:string;
    stages:{
        stage_one:{
            a: string;
            q: string;
            type: PromptEngineering_Feedback_Type
        }[],
        stage_two:{
            chance: string
            survey: {
                a: string;
                q: string;
                type: PromptEngineering_Feedback_Type
            }[]
        },
        stage_three:{
            assistance_frequency: string;
        },
        stage_four:null
    }
}