import { BloodWorkData, BloodWorkDoc, DOMAIN } from "../services/server";
import { BloodWorkData_Default } from "../utils/initialValues";

export class BloodWork {

    private bloodData: BloodWorkDoc = null;
    private userId : string;

    constructor(userId: string){
        this.userId = userId;
    } 

    //UPDATE BLOOD DATA TO ITS LATEST STATE IN THE DATABASE
    public fetchBloodWorkData = async (): Promise <void> => {
        const response = await fetch(`${DOMAIN}/client/get/blood`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: this.userId })
        })

        if(response.ok){
            const data = await response.json()
            this.bloodData = data as BloodWorkDoc;
            console.log("Blood Data: ", this.bloodData)
        } else {
            console.log("Error: ", response)
            this.bloodData = null;
        }
    }
    

    public updateBloodWorkData = async (newData: 
        {
            higherRisk: boolean,
            data: BloodWorkData,
            Create_Date: string,
            id: string
        }
    ): Promise <boolean> => {

        const response = await fetch(`${DOMAIN}/client/upload/blood`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId:this.userId,
                higherRisk: newData.higherRisk,
                data: newData.data,
                createDate: newData.Create_Date,
                id: newData.id
            }),
        });

        if(response.ok){
            return true;
        } else {
            console.log("Error: ", response)
            return false;
        }
    }

    public getBloodWorkData = (): BloodWorkDoc | null => {
        return this.bloodData;
    }
}