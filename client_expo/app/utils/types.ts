//<===================== MELANOOMA ==========================>

import { BloodWorkDoc } from "../services/server";
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
        spot:{
            slug:Slug,
            pathArray: any[],
            color:string,
        }
        
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

export type CompletedParts = Slug[]

export type SunBurnData = {slug:string, stage: 0 | 1 | 2 | 3}[]

export type DetectableRealatives = "none" | "mother" | "father" | "sibling" | "grandmother" | "grandfather" | "other" | "none" [];

export type SkinDataType = {
    completedArray: CompletedParts,
    detected_relatives: DetectableRealatives,
    skin_type: SkinType,
    sunburn: SunBurnData,
}

export type MolePerSlugNumber = {
    abs: number;
    head: number;
    leftArm: number;
    rightArm: number;
    chest: number;
    upperLegRight: number;
    upperLegLeft: number;
    lowerLegRight: number;
    lowerLegLeft: number;
    leftFeet: number;
    rightFeet: number;
    rightHand: number;
    leftHand: number;
    back: number;
    headBack: number;
    leftArmBack: number;
    rightArmBack: number;
    leftLegBack: number;
    rightLegBack: number;
    leftFeetBack: number;
    rightFeetBack: number;
    rightPalm: number;
    leftPalm: number;
    legs: number;
    torso: number;
    feet: number;
    gluteal: number;
};



export type SkinType = 0 | 1 | 2 | 3;

//<===================== USER DATA ==========================>

export type Gender = "female" | "male";


export type UserData = {
    uid:string;
    fullname:string;
    gender: Gender;
    birth_date: string;
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
    created_at: string;
    diagnosis:string;
    id:string;
    possibleOutcomes:string;
    stages:{
        stage_one:DiagnosisResultType | {diagnosis:"Not yet"},
        stage_two:DiagnosisResultType,
    },
}

export type DiagnosisResultType = {
    diagnosis?:string,
    description?:string,
    chance?:string,
    explain_video?:string,
    symphtoms?:{numbering:string,content:string}[],
    periodic_assistance?:string,
}

export type ContextToggleType = {
    useBloodWork:boolean,
    useUvIndex:boolean,
    useMedicalData:boolean,
    useWeatherEffect:boolean
}

export type UserContextType = {
    useBloodWork:null | string,
    useUvIndex:null | string,
    useMedicalData:null | any[],
    useWeatherEffect:null | string
}

export type WeatherAPIResponse = {
      dt?: number,
      sunrise?: number,
      sunset?: number,
      moonrise?: number,
      moonset?: number,
      moon_phase?: number,
      summary?: string,
      temp?: {
        day?: number,
        min?: number,
        max?: number,
        night?: number,
        eve?: number,
        morn?: number
      },
      feels_like?: {
        day?: number,
        night?: number,
        eve?: number,
        morn?: number
      },
      pressure?: number,
      humidity?: number,
      dew_point?: number,
      wind_speed?: number,
      wind_deg?: number,
      wind_gust?: number,
      weather?: Array<{
        id?: number,
        main?: string,
        description?: string,
        icon?: string
      }>,
      clouds?: number,
      pop?: number,
      rain?: number,
      uvi?: number
};

export type keys_types = "uvi" | "temp" | "pressure" | "humidity" | "weather" | "clouds" | "pop"

export type WeatherSortedResponse =  Record<keys_types, any>;