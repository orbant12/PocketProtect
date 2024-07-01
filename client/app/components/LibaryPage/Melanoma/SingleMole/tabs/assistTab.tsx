import { View,Modal } from "react-native"
import { AssistantAdvertBox } from "../../Assistance/assistantAdvert"
import { AssistantBioBox } from "../../Assistance/assistantBio"
import { AssistModal } from "../../../../../pages/Assist/assistantModal"
import { useState,useEffect } from "react"
import { fetchAssistantsByField, fetchUserData } from "../../../../../services/server"
import { AssistanceFields, AssistantData, SpotData, UserData } from "../../../../../utils/types"
import { useAuth } from "../../../../../context/UserAuthContext"



export const AssistTab = ({
    bodyPart,
    navigation
}:{
    bodyPart:SpotData[] | null,
    navigation:any
}) => {

    const [ selectedAssistant, setSelectedAssistant] = useState<AssistantData | null>(null)
    const [ userData, setUserData] = useState<UserData | null>(null)
    const [ properAssistants, setProperAssistants] = useState([])
    const { currentuser } = useAuth()


    const fetchAssistants = async () => {
        const response = await fetchAssistantsByField({
            field:"dermatologist"
        })
        setProperAssistants(response)
    }

    const fetchAllUserData = async () => {
        const userData = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(userData)
    }

    useEffect(() => {        
        fetchAssistants()
        fetchAllUserData()
    },[])

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <AssistantAdvertBox 
                navigation={navigation}
            />
            {properAssistants.map((data,index) => (
                <AssistantBioBox
                    index={index}
                    assistantData={data}
                    labels={[
                        {text:"Masters in Dermotology",icon_name:"information"},
                        {text:"10+ years of experience",icon_name:"brain"},            
                        {text:"100% satisfaction",icon_name:"brain"},
                        {text:"Age: 30",icon_name:"calendar"},
                        {text:"Fast and accurate work",icon_name:"calendar"},
                    ]}
                    setSelectedAssistant={setSelectedAssistant}
                    key={index}
                />
            ))}
            {selectedAssistant != null &&
            <Modal animationType="slide" visible={selectedAssistant != null}>
                <AssistModal 
                    assistantData={selectedAssistant}
                    setSelectedAssistant={setSelectedAssistant}
                    bodyPart={bodyPart != null ? bodyPart : null}
                    navigation={navigation}
                    userData={userData}
                />
            </Modal>
            }
        </View>
    )
}








