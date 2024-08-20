import { useWeather } from "../context/WeatherContext"
import { convertBloodWorkCategoriesToString } from "../pages/Chat/aiChatPage"
import { selectableDataTypes } from "../pages/Profile/tabs/userSavedPage"
import { BloodWorkDoc, DOMAIN } from "../services/server"
import { convertWeatherDataToString } from "../utils/melanoma/weatherToStringConvert"
import { BloodWork } from "./BloodWork"



export class ContextPanelData {
    
    private contextOptions:{title:string,stateName:any,stateID:selectableDataTypes}[] = [
        {
            title:"Blood Work",
            stateName: null,
            stateID:"useBloodWork"
        },
        {
            title:"Uv Index",
            stateName: null,
            stateID:"useUvIndex"
        },
        {
            title:"Allergies",
            stateName: null,
            stateID:"useMedicalData"
        },
        {
            title:"Weather Effects",
            stateName: null,
            stateID:"useWeatherEffect"
        },
    ]

    private userId : string;

    constructor(userId: string, private weatherContext:any){
        this.userId = userId;
    }

    private handleAllergiesFetch = async (type:"normal" | "string") => {
        const response = await fetch(`${DOMAIN}/client/get/allergies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });

        const index = this.contextOptions.findIndex(
            (option) => option.stateID === "useMedicalData"
        );

        if(type == "normal"){
    
            if(response.ok){
                const data :  {"allergiesArray":string[]} = await response.json();
                if(data.allergiesArray != null){
                    this.contextOptions[index].stateName = data;
                } else {
                    this.contextOptions[index].stateName = null;
                } 
            } else {
                this.contextOptions[index].stateName = null;
            }
        } else {
            if(response.ok){
                const data :  {"allergiesArray":string[]} = await response.json();
                const convertedArrayToString = data.allergiesArray.join(", ");
                if(data.allergiesArray != null){
                    this.contextOptions[index].stateName = "I have the following allergie(s): " + convertedArrayToString;
                } else {
                    this.contextOptions[index].stateName = null;
                } 
            } else {
                this.contextOptions[index].stateName = null;
            }
        }
    }

    private handleBloodWorkFetch = async (type:"normal" | "string") => {
        const bloodObj = new BloodWork(this.userId);
        await bloodObj.fetchBloodWorkData()
        const response : BloodWorkDoc = bloodObj.getBloodWorkData()
        if (type == "normal"){
            if (response != null){
                const index = this.contextOptions.findIndex(
                    (option) => option.stateID === "useBloodWork"
                );
                this.contextOptions[index].stateName = response;
            } 
        } else {
            if (response != null){
                const index = this.contextOptions.findIndex(
                    (option) => option.stateID === "useBloodWork"
                );
                const convertedBlood = convertBloodWorkCategoriesToString(response.data);
                this.contextOptions[index].stateName = convertedBlood;
            } 
        }
    } 

    private handleUvIndexFetch = async (type:"normal" | "string") => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === "useUvIndex"
        );
        if (type == "normal"){
            this.contextOptions[index].stateName = this.weatherContext.locationPermissionGranted ? (this.weatherContext.weatherData != null ? `UV Index: ${this.weatherContext.weatherData.uvi}` : null) : null;
        } else {
            this.contextOptions[index].stateName = this.weatherContext.locationPermissionGranted ? (this.weatherContext.weatherData != null ? `The UV Index is currently: ${this.weatherContext.weatherData.uvi}` : null) : null;
        }
    }

    private handleWeatherFetch = async (type:"normal" | "string") => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === "useWeatherEffect"
        );
        if(type == "normal"){
            this.contextOptions[index].stateName = this.weatherContext.weatherData != null ? convertWeatherDataToString(this.weatherContext.weatherData) : null;
        } else {
            this.contextOptions[index].stateName = this.weatherContext.weatherData != null ? `The weather is currently: ${convertWeatherDataToString(this.weatherContext.weatherData)}` : null;
        }
    }


    public loadContextData = async ():Promise <void> => {
        await this.handleAllergiesFetch("normal");
        await this.handleBloodWorkFetch("normal");
        await this.handleWeatherFetch("normal");
        await this.handleUvIndexFetch("normal");
    }

    public loadContextDataForString = async ():Promise <void> => {
        await this.handleAllergiesFetch("string");
        await this.handleBloodWorkFetch("string");
        await this.handleWeatherFetch("string");
        await this.handleUvIndexFetch("string");
    }

    public setContextOptions = async (field:selectableDataTypes,data:any):Promise <string> => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === field
        );
        this.contextOptions[index].stateName = {allergiesArray:data};
        const convertedArrayToString = data.join(", ");
        return "I have the following allergie(s): " + convertedArrayToString;
    }

    public getContextOptions = () => {
        return this.contextOptions
    }
}