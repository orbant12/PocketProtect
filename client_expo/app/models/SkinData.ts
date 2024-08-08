import { DOMAIN } from "../services/server";
import { SkinType, SunBurnData } from "../utils/types";


export class SkinData {

    private skinType: string;
    private detectedRelative: string;
    private sunBurn: SunBurnData;

    constructor(protected userId: string){}

    async fetchSkinType():Promise<SkinType> {
        const response = await fetch(`${DOMAIN}/client/get/skin-type`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: this.userId }),
        });
    
        if(response.ok){
            const data = await response.json();
            return data as SkinType;
        } else {
            return 0
        }
    }

    async updateSkinType(newType:SkinType):Promise<void>{
        const response = await fetch(`${DOMAIN}/client/update/skin-type`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId,newType:newType }),
        });
    
        if(response.ok){
            return;
        } else {
            return 
        }
    }

}