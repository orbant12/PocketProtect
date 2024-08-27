import { DOMAIN } from "../services/server";

export class Burns {

    private burnsData: {stage:number,slug:string}[] = []
    private userId : string

    constructor(userId:string){
        this.userId = userId
    }

    public fetchBurnsData = async () => {
        const response = await fetch(`${DOMAIN}/client/get/burns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
    
        if(response.ok){
            const data = await response.json()
            this.burnsData = data;
        } else {
            this.burnsData = [];
        }
    }

    public updateBurnData = async (newData:{stage:number,slug:string}[]) => {
        const response = await fetch(`${DOMAIN}/client/update/burns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, newData:newData }),
        });
    
        if(response.ok){
            this.burnsData = newData;
        } else {
            
        }
    }

    public getBurns(): {stage:number,slug:string}[] {
        return this.burnsData
    }
}