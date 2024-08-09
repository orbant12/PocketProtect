
// models/CurrentUser.ts
import { CompletedParts, Gender, MolePerSlugNumber, Slug, SpotData, UserData } from "../utils/types";
import { DOMAIN } from "../services/server";
import { SkinData } from "./SkinData";
import { convertImageToBase64 } from "../utils/imageConvert";
import { MolePerSlugNumber_Default } from "../utils/initialValues";

export class Melanoma extends SkinData {
    
    private gender: Gender;
    private allMelanomaData: SpotData[] = [];

    constructor(userId: string,gender: Gender) {
        super(userId); 
        this.gender = gender;
    }

    public async fetchAllMelanomaData(): Promise<void> {
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
            console.log("ok")
            const data = await response.json();
            this.allMelanomaData = data as SpotData[];
        } else {
            console.log("nah")
            this.allMelanomaData = [];
        }
    }

    public async numberOfMolesOnSlugsArray(): Promise <MolePerSlugNumber> {
        try {
            const slugValues: string[] = [];
        
            for (const doc of this.allMelanomaData) {
                const spotData: SpotData = doc as SpotData;
        
                if (spotData.melanomaDoc.spot.slug !== "" && spotData.gender === this.gender) {
                    slugValues.push(spotData.melanomaDoc.spot.slug);
                }
            }
        
            const slugCount: Record<string, number> = {};
        
            for (const slug of slugValues) {
                if (slugCount[slug]) {
                    slugCount[slug]++;
                } else {
                    slugCount[slug] = 1;
                }
            }
            console.log(slugCount)
            return slugCount as MolePerSlugNumber;
        
        } catch (err) {
        console.error(err);
            return MolePerSlugNumber_Default as MolePerSlugNumber;
        }
        
        // const response = await fetch(`${DOMAIN}/client/get/number-of-melanoma-on-slug`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         userId:this.userId,
        //         gender:this.gender
        //     })}
        // );
    
        // if(response.ok){
        //     const data = await response.json();
        //     return [data] as numberOfMolesOnSlugs;
        // } else {
        //     return []
        // }
    }



    //SPOT
    
    public async updateLatestMole({newData,melanomaBlob}:{newData:SpotData,melanomaBlob:string}): Promise<boolean> {
        const response = await fetch(`${DOMAIN}/client/update/melanoma-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId:this.userId,
                spotId: newData.melanomaId,
                newData: newData,
                melanomaBlob:melanomaBlob
            }),
        });

  
    
        if(response.ok){
            this.handleSwitchCurrentToNewLatest({newData:newData});

            return true;
        } else {
            return false
        }
    }

    public async fetchMoleHistoryById(melanomaId: string): Promise<SpotData[] | "NoHistory"> {
        const response = await fetch(`${DOMAIN}/client/get/melanoma-history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, spotId:melanomaId }),
        });
    
        if(response.ok){
            const data:SpotData[] = await response.json();
            if (data != null){
                return data;
            } else {
                return "NoHistory";
            }
        } else {
            return "NoHistory";
        }
    }  

    public async deleteSpotWithHistoryReset({melanomaId,deleteType,storage_name,newLatest}:{melanomaId: string,deleteType:"latest" | "history",storage_name:string,newLatest:SpotData}): Promise<{firestore:{success:boolean,message:string},storage:{success:boolean,message:string}}> {
        const response = await fetch(`${DOMAIN}/client/delete/melanoma-with-history-reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, spotId:melanomaId, deleteType:deleteType, storage_name:storage_name }),
        });

    
    
        if(response.ok){
            if(newLatest == null){
                await this.deleteMoleByIdFromArray(melanomaId);
            } else if (newLatest != null){
                this.handleSwitchCurrentToNewLatest({newData:newLatest});
            }
            const data:{firestore:{message:string,success:boolean},storage:{message:string, success:boolean}} = await response.json();
            return { firestore: data.firestore, storage: data.storage };
        } else {
            return { firestore: { success: false, message: "Firestore deletion failed" }, storage: { success: false, message: "Storage deletion failed" } };
        }
    }

    public async updateSpotRisk({spotId,riskToUpdate}:{spotId:string,riskToUpdate:{risk:number}}): Promise<boolean> {
        const response = await fetch(`${DOMAIN}/client/update/melanoma-risk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: this.userId,
                spotId: spotId,
                risk: riskToUpdate.risk,
            }),
        });

    
        if(response.ok){
            this.handleChangeSpotField({
                field:"risk",
                spotId:spotId,
                newData:riskToUpdate.risk
            })
            return true;
        } else {
            return false
        }
    }

    public async updateSpotPicture({spotId,pictureToUpdate}:{spotId:string,pictureToUpdate:string}): Promise<void> {
        const pictureBase64 = await convertImageToBase64(pictureToUpdate);
        const response = await fetch(`${DOMAIN}/client/change/melanoma-picture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, melanomaBlob:pictureBase64, spotId:spotId }),
        });
    
        
        this.handleChangeSpotField({
            field:"melanomaPictureUrl",
            spotId:spotId,
            newData:pictureToUpdate
        })
  
    }

    //PRIVATE METHODS
    
    private handleSwitchCurrentToNewLatest({newData}:{newData:SpotData}): void {
        for (let index = 0; index < this.allMelanomaData.length; index++){
            if(this.allMelanomaData[index].melanomaId == newData.melanomaId){
                this.allMelanomaData[index] = newData;
            }
        }
    }

    private async deleteMoleByIdFromArray(id:string){
        for (let index = 0; index < this.allMelanomaData.length; index++){
            if(this.allMelanomaData[index].melanomaId == id){
                this.allMelanomaData.splice(index,1);
                return;
            }
        }
    }

    private handleChangeSpotField = ({ field, spotId, newData }: { field: "risk" | "melanomaPictureUrl", spotId: string, newData: any }): void => {
        for (let index = 0; index < this.allMelanomaData.length; index++) {
            if (this.allMelanomaData[index].melanomaId === spotId) {

                (this.allMelanomaData[index] as any)[field] = newData;
                break;
            }
        }
    };

    //GETTERS

    public getAllMelanomaData():SpotData[] {
        return this.allMelanomaData;
    }

    public getMelanomaDataBySlug(slug: Slug): SpotData[] {
        const filteredData = this.allMelanomaData.filter(data => data.melanomaDoc.spot.slug === slug);
        return filteredData;
    }

    public getMelanomaDataById(id:string): SpotData | null {
        
        for (let index = 0; index < this.allMelanomaData.length; index++){
            if(this.allMelanomaData[index].melanomaId == id){
                
                return this.allMelanomaData[index]
            }
        }
        return null
    }

    public getSpecialMoles(): {risky:SpotData[],outdated:SpotData[],unfinished:SpotData[]} {
        let risky:SpotData[] = [];
        let outdated:SpotData[] = [];
        let unfinished:SpotData[] = [];
        
        this.allMelanomaData.forEach(data => {
            if(data.risk > 0.5){
                risky.push(data);
            } 
            //180 days is outdated
      

            if(data.risk == null){
                unfinished.push(data);
            }
        });
        

        return {risky:risky,outdated:outdated,unfinished:unfinished};
    }

}
