import { Slug } from "../types";

export const decodeParts = (parts:Slug[]) => {        
    let updatedSessionMemory:{slug:Slug}[] = []        

    parts.forEach((doc) => {
        updatedSessionMemory.push({ slug: doc });
    })

    return updatedSessionMemory        
}