import { View,Text,Image,TouchableOpacity,ScrollView } from "react-native"
import { NavBar_OneOption } from "../Common/navBars"
import { AssistTab } from "../LibaryPage/Melanoma/SingleMole/tabs/assistTab"
import { useAuth } from "../../context/UserAuthContext"
import { SpotData } from "../../utils/types"
import { fetchSingleMoleById } from "../../services/server"
import { useState,useEffect } from "react"

export const AssistantSelectorScreen = ({
    setProgress,
    navigation,
    selectedMoles
}) => {

    const { currentuser } = useAuth()
    const [ bodyPart, setBodyPart ] = useState<SpotData[]>([])

    const fetchBodyPartsById = async () => {
        try {
            const promises = selectedMoles.map(async (id) => {
                const response = await fetchSingleMoleById({
                    userId: currentuser.uid,
                    moleId: id
                });
                if (response != null){
                    return response
                }
            });
            const bodyParts = await Promise.all(promises);
            const filteredBodyParts = bodyParts.filter((part) => part !== undefined);
            setBodyPart(filteredBodyParts);
        } catch (error) {
            console.error('Error fetching body parts:', error);
        }
    };

    useEffect(() => {
        fetchBodyPartsById()
    },[])

    return(
        <>
            <NavBar_OneOption 
                icon_left={{name:"arrow-left",size:30,action:() => setProgress(0)}}
                title={"Select Assistant"}
            />
            <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:"center"}}>
                <AssistTab 
                    bodyPart={bodyPart}
                    navigation={navigation}
                />
            </ScrollView>

        </>
    )
}