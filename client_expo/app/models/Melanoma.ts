
// models/CurrentUser.ts
import { CompletedParts, Gender, SpotData, UserData } from "../utils/types";
import { DOMAIN } from "../services/server";
import { numberOfMolesOnSlugs } from "../components/LibaryPage/Melanoma/slugCard";
import { SkinData } from "./SkinData";

export class Melanoma extends SkinData {
    
    private gender: Gender;

    constructor(userId: string,gender: Gender) {
        super(userId); 
        this.gender = gender;
    }

    async fetchAllMelanomaData(): Promise<SpotData[] | []> {
        const response = await fetch(`${DOMAIN}/client/get/all-melanoma`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId:this.userId,
                gender:this.gender
            })
        });

        if(response.ok){
            const data = await response.json();
            return data as SpotData[];
        } else {
            return [];
        }
    }

    async fetchCompletedParts(): Promise <CompletedParts | []> {
        const response = await fetch(`${DOMAIN}/client/get/completed-parts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId }),
        });
        
        if(response.ok && response != undefined){
            const data = await response.json();
            const completedSlugs = data.map(part => part.slug);
            return completedSlugs as CompletedParts;
        } else {
            return [];
        }
    }

    async numberOfMolesOnSlugsArray(): Promise <numberOfMolesOnSlugs | []> {
        const response = await fetch(`${DOMAIN}/client/get/number-of-melanoma-on-slug`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId:this.userId,
                gender:this.gender
            })}
        );
    
        if(response.ok){
            const data = await response.json();
            return [data] as numberOfMolesOnSlugs;
        } else {
            return []
        }
    }

}
