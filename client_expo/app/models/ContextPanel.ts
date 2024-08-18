import { useWeather } from "../context/WeatherContext"
import { selectableDataTypes } from "../pages/Profile/tabs/userSavedPage"
import { BloodWorkDoc, DOMAIN } from "../services/server"
import { convertWeatherDataToString } from "../utils/melanoma/weatherToStringConvert"
import { BloodWork } from "./BloodWork"

const { weatherData, locationString, locationPermissionGranted } = useWeather()

export class ContextPanelData {

    private contextData = {
        useBloodWork:null,
        useUvIndex:locationPermissionGranted ? (weatherData != null ? `UV Index: ${weatherData.uvi}` : null) : null,
        useMedicalData:null,
        useWeatherEffect:weatherData != null ? convertWeatherDataToString(weatherData) : null,
    }

    private contextOptions:{title:string,stateName:any,stateID:selectableDataTypes}[] = [
        {
            title:"Blood Work",
            stateName:this.contextData.useBloodWork,
            stateID:"useBloodWork"
        },
        {
            title:"Uv Index",
            stateName:this.contextData.useUvIndex,
            stateID:"useUvIndex"
        },
        {
            title:"Allergies",
            stateName:this.contextData.useMedicalData,
            stateID:"useMedicalData"
        },
        {
            title:"Weather Effects",
            stateName:this.contextData.useWeatherEffect,
            stateID:"useWeatherEffect"
        },
    ]

    private userId : string;

    constructor(userId: string){
        this.userId = userId;
    }

    private handleAllergiesFetch = async () => {
        const response = await fetch(`${DOMAIN}/client/get/allergies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
    
        if(response.ok){
            const data :  {"allergiesArray":string[]} = await response.json();
            if(data.allergiesArray != null){
                this.contextData = {
                    ...this.contextData,
                    useMedicalData:data
                }
            } else {
                this.contextData = {
                    ...this.contextData,
                    useMedicalData:null
                }
            } 
        } else {
            this.contextData = {
                ...this.contextData,
                useMedicalData:null
            }
        }
    }

    private handleBloodWorkFetch = async () => {
        const bloodObj = new BloodWork(this.userId);
        await bloodObj.fetchBloodWorkData()
        const response : BloodWorkDoc = bloodObj.getBloodWorkData()
        if (response != null){
            this.contextData = {
                ...this.contextData,
                useBloodWork:response
            }
        } 
    } 

    public loadContextData = async ():Promise <void> => {
        await this.handleAllergiesFetch();
        await this.handleBloodWorkFetch();
    }


    public getContextOptions = () => {
        return this.contextOptions
    }
}