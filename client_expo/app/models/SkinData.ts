import { DOMAIN } from "../services/server";
import { CompletedParts, DetectableRealatives, SkinType, Slug, SunBurnData } from "../utils/types";


export class SkinData {

    private skinType: SkinType = 0;
    private detectedRelative: DetectableRealatives;
    private sunBurn: SunBurnData;
    private completedParts: CompletedParts;

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

    async fetchCompletedParts():Promise<void> {
        const response = await fetch(`${DOMAIN}/client/get/completed-parts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
        
        if(response.ok && response != undefined){
            const data = await response.json();
            const completedSlugs = data ? data.map(part => part.slug) : [];
            this.completedParts = completedSlugs as CompletedParts;
        } else {
            this.completedParts = [];
        }
    }

    async getSunBurn():Promise<SunBurnData> {
        const response = await fetch(`${DOMAIN}/client/get/sunburn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
    
        if(response.ok){
            const data = await response.json();
            return data as SunBurnData;
        } else {
            return [{stage:0,slug:""}]
        }
    }
    
    async getDetectedRelative():Promise<DetectableRealatives> {
        const response = await fetch(`${DOMAIN}/client/get/detected-relative`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
    
        if(response.ok){
            const data = await response.json();
            return data as DetectableRealatives;
        } else {
            return []
        }
    }

    async updateCompletedParts(completedArray:{slug: Slug}[]):Promise<void>{
        const response = await fetch(`${DOMAIN}/client/update/completed-parts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, completedArray:completedArray }),
        });
    
        if(response.ok){
            this.completedParts = completedArray.map(part => part.slug) as CompletedParts;
        } else {
            alert("Failed to update completed parts on the databse")
        }
    }

    async updateDetectedRelative(newRelative:DetectableRealatives):Promise<void>{
        const response = await fetch(`${DOMAIN}/client/update/detected-relative`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId,detected_relative:newRelative }),
        });
    
        if(response.ok){
            return;
        } else {
            return
        }
    }

    async updateSunBurn(newSunBurn:SunBurnData):Promise<void>{
        const response = await fetch(`${DOMAIN}/client/update/sunburn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId,sunburn:newSunBurn }),
        });
    
        if(response.ok){
            return;
        } else {
            return
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

    getSkinType():SkinType{ return this.skinType; }

    getCompletedParts():CompletedParts{ return this.completedParts; }

}