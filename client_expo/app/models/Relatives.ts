import { DOMAIN } from "../services/server";


export class Relatives {

    private relativeData: string[] = []
    private userId : string

    constructor(userId:string){
        this.userId = userId;
    }

    public fetchRelativeData = async (): Promise <void> => {
        const response = await fetch(`${DOMAIN}/client/get/relatives`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
    
        if(response.ok){
            const data = await response.json()
            this.relativeData = data;
        } else {
            this.relativeData = [];
        }
    }

    public updateRelativeData = async (newData: string[]) : Promise <void> => {
        const response = await fetch(`${DOMAIN}/client/update/relatives`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, newData:newData }),
        });
    
        if(response.ok){
            this.relativeData = newData;
        } else {
            
        }
    }

    public getRelativeData() : string[] {
        return this.relativeData
    }






}