import { BloodWorkData, BloodWorkDoc } from "../services/server";
import { Gender } from "../navigation/navigation";

export const UserData_Default = {
        id:"default",
        birth_date: new Date(),
        gender: "male" as Gender,
        profilePictureUrl:"",
        user_since:"",
        email:"",
        fullname:""
}

export const BloodWorkData_Default: BloodWorkData = [
    {
        title:"Basic Health Indicators",
        data:[
            {type:"Hemoglobin (Hgb)",number:0},
            {type:"Hematocrit (Hct)",number:0},
            {type:"Red Blood Cell Count (RBC)",number:0},     
            {type:"White Blood Cell Count (WBC)",number:0},   
            {type:"Platelet Count",number:0},               
        ]
    },
    {
        title:"Lipid Panel",
        data:[
            {type:"Total Cholesterol",number:0},
            {type:"High Density Lipoprotein",number:0},
            {type:"Low Density Lipoprotein",number:0},     
            {type:"Triglycerides",number:0},                               
        ]
    },
    {
        title:"Metabolic Panel",
        data:[
            {type:"Glucose",number:0},
            {type:"Blood Urea Nitrogen",number:0},
            {type:"Creatinine",number:0},     
            {type:"Sodium",number:0},
            {type:"Potassium",number:0},  
            {type:"Chloride",number:0},  
            {type:"Carbon Dioxide",number:0},
            {type:"Calcium",number:0}, 
        ]
    },
    {
        title:"Liver Function Tests:",
        data:[
            {type:"Alanine Aminotransferase",number:0},
            {type:"Aspartate Aminotransferase",number:0},
            {type:"Alkaline Phosphatase",number:0},     
            {type:"Bilirubin",number:0},
            {type:"Albumin",number:0},  
            {type:"Total Protein",number:0},    
        ]
    },
    {
        title:"Thyroid Panel:",
        data:[
            {type:"Thyroid Stimulating Hormone",number:0},
            {type:"Free Thyroxine",number:0},
            {type:"Free Triiodothyronine",number:0},     
        ]
    },
    {
        title:"Iron Studies:",
        data:[
            {type:"Serum Iron",number:0},
            {type:"Ferritin",number:0},
            {type:"Total Iron Binding Capacity",number:0},     
            {type:"Transferrin Saturation",number:0}, 
        ]
    }, 
    {
        title:"Vitamins and Minerals:",
        data:[
            {type:"Vitamin D",number:0},
            {type:"Vitamin B12",number:0},
            {type:"Folate",number:0},                     
        ]
    }, 
    {
        title:"Inflammatory Markers:",
        data:[
            {type:"C Reactive Protein",number:0},
            {type:"Erythrocyte Sedimentation Rate",number:0},                                    
        ]
    },  
    {
        title:"Hormonal Panel:",
        data:[
            {type:"Testosterone",number:0},
            {type:"Estrogen",number:0},    
            {type:"Progesterone",number:0},                                  
        ]
    },
]

export const BloodWork_Document_Deafault: BloodWorkDoc = {
    created_at:"",
    data:BloodWorkData_Default,
    id:"",
    risk: false,
}