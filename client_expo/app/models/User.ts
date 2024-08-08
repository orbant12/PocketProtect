
// models/CurrentUser.ts
import { UserData } from "../utils/types";
import { auth, db } from "../services/firebase";
import { collection, doc, setDoc, } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { DOMAIN } from "../services/server";
import { convertImageToBase64 } from "../utils/imageConvert";

export class User {
  private userData: UserData | null = null;

  constructor(private userId: string) {}

    async fetchUserData(): Promise<void> {
        try {
            const response = await fetch(`${DOMAIN}/client/get/user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId:this.userId }),
            });
            if(response.ok){
                const data = await response.json();
                this.userData = data as UserData;
            } else {
                this.userData = null;
            }
        } catch (error) {
            this.userData = null;
        }
    }

    async registerUser(userFullName: string, regEmail: string): Promise<boolean> {
        try {
            const document = {
                uid: this.userId,
                fullname: userFullName,
                email: regEmail,
                profileUrl: "",
                user_since: new Date().toLocaleDateString(),
                gender: "",
                birth_date: null,
            }
            const response = await fetch(`${DOMAIN}/client/register/user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId:this.userId,data:document }),
            });
            if(response.ok){
                console.log("Document successfully added!");
                await sendEmailVerification(auth.currentUser!);
                return true
            }
            return false
        } catch (error) {
        console.error("Error adding document: ", error);
        return false
        }
    }

    async changeProfileUrl(profileUrl:string):Promise<boolean> {
        const profileBlob = await convertImageToBase64(profileUrl);
        const response = await fetch(`${DOMAIN}/client/update/profile-picture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:this.userId, profileBlob }),
        });
    
        if(response.ok){
            return true;
        } else {
            return false
        }

    }

  getUserData(): UserData | null {
    return this.userData;
  }
}
