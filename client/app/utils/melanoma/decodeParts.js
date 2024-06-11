export const decodeParts = (parts) => {        
    let updatedSessionMemory = []        

    parts.forEach((doc) => {
        updatedSessionMemory.push({ slug: doc });
    })

    return updatedSessionMemory        
}