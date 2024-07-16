

await saveTask({
    userId: currentuser.uid,
    data: data,
    date: fullDiagnosis.periodic_assistance == "Weekly" ? dateFormat(7) : fullDiagnosis.periodic_assistance == "Daily" && dateFormat(1) ,
    id: data.id
})


export const saveTask = async ({
    userId,
    data,
    id,
    date
}) => {
    try{
        const ref = doc(db, "users", userId, "Task_Manager", id);
        await setDoc(ref,
            {
                data,
                date,
                id
            }
        );
        return true           
    } catch (error) {
        console.log(error);
        return false
    }
}