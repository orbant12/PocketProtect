import { View,Modal } from "react-native"
import { AssistantAdvertBox } from "../../Assistance/assistantAdvert"
import { AssistantBioBox } from "../../Assistance/assistantBio"
import { AssistModal } from "../../../../../pages/Assist/assistantModal"
import { useState,useEffect } from "react"
import { fetchAssistantsByField } from "../../../../../services/server"

export const AssistTab = ({
    bodyPart,
    navigation
}) => {

    const [ selectedAssistant, setSelectedAssistant] = useState([])
    const [ properAssistants, setProperAssistants] = useState([])


    const fetchAssistants = async () => {
        const response = await fetchAssistantsByField({
            field:"dermotology"
        })
        setProperAssistants(response)
    }

    useEffect(() => {        
        fetchAssistants()
    },[])

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <AssistantAdvertBox />
            {properAssistants.map((data,index) => (
                <AssistantBioBox
                    index={index}
                    assistantData={{
                        profileUrl:data.profileUrl,
                        fullname:data.Fullname,
                        id:data.id
                    }}
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
            <Modal animationType="slide" visible={selectedAssistant.length != 0}>
                <AssistModal 
                    assistantData={selectedAssistant}
                    setSelectedAssistant={setSelectedAssistant}
                    bodyPart={bodyPart}
                    navigation={navigation}
                />
            </Modal>
        </View>
    )
}








