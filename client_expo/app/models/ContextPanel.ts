import { useWeather } from "../context/WeatherContext"
import { selectableDataTypes } from "../pages/Profile/tabs/userSavedPage"
import { BloodWorkDoc, DOMAIN } from "../services/server"
import { convertWeatherDataToString } from "../utils/melanoma/weatherToStringConvert"
import { BloodWork } from "./BloodWork"



export class ContextPanelData {

    // private contextData = {
    //     useBloodWork:null,
    //     useUvIndex:locationPermissionGranted ? (weatherData != null ? `UV Index: ${weatherData.uvi}` : null) : null,
    //     useMedicalData:null,
    //     useWeatherEffect:weatherData != null ? convertWeatherDataToString(weatherData) : null,
    // }
    

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

    private handleAllergiesFetch = async () => {
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
    }

    private handleBloodWorkFetch = async () => {
        const bloodObj = new BloodWork(this.userId);
        await bloodObj.fetchBloodWorkData()
        const response : BloodWorkDoc = bloodObj.getBloodWorkData()
        if (response != null){
            const index = this.contextOptions.findIndex(
                (option) => option.stateID === "useBloodWork"
            );
            this.contextOptions[index].stateName = response;
        } 
    } 

    private handleUvIndexFetch = async () => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === "useUvIndex"
        );
        this.contextOptions[index].stateName = this.weatherContext.locationPermissionGranted ? (this.weatherContext.weatherData != null ? `UV Index: ${this.weatherContext.weatherData.uvi}` : null) : null;
    }

    private handleWeatherFetch = async () => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === "useWeatherEffect"
        );
        this.contextOptions[index].stateName = this.weatherContext.weatherData != null ? convertWeatherDataToString(this.weatherContext.weatherData) : null;
    }


    public loadContextData = async ():Promise <void> => {
        await this.handleAllergiesFetch();
        await this.handleBloodWorkFetch();
        await this.handleWeatherFetch();
        await this.handleUvIndexFetch();
    }

    public setContextOptions = async (field:selectableDataTypes,data:any) => {
        const index = this.contextOptions.findIndex(
            (option) => option.stateID === field
        );
        this.contextOptions[index].stateName = {allergiesArray:data};
    }

    public getContextOptions = () => {
        return this.contextOptions
    }
}