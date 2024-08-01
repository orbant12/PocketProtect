import { View,Modal, Text, TouchableOpacity, Linking, Alert } from "react-native"
import { AssistantAdvertBox } from "../../Assistance/assistantAdvert"
import { AssistantBioBox } from "../../Assistance/assistantBio"
import { AssistModal } from "../../../../../pages/Assist/assistantModal"
import { useState,useEffect } from "react"
import { fetchAssistantsByField } from "../../../../../services/server"
import { AssistanceFields, AssistantData, SpotData, UserData } from "../../../../../utils/types"
import { useAuth } from "../../../../../context/UserAuthContext"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { OneOptionBox } from "../../boxes/oneOptionBox"
import { makeRedirectUri } from "expo-auth-session"


export const AssistTab = ({
    bodyPart,
    navigation
}:{
    bodyPart:SpotData[] | null,
    navigation:any
}) => {

    const [ selectedAssistant, setSelectedAssistant] = useState<AssistantData | null>(null)
    const [ properAssistants, setProperAssistants] = useState<AssistantData[]>([])
    const { currentuser } = useAuth()


    const fetchAssistants = async () => {
        const response = await fetchAssistantsByField({
            field:"dermatologist"
        })
        if(response == null){
            console.log("No assistants found")
        } else if(response != null && response != "NoAssistant"){
            setProperAssistants(response)
        } else if (response == "NoAssistant"){
            console.log("No assistants found")
        }
    }


    useEffect(() => {        
        fetchAssistants()
    },[])

    const handlePress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    };

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <AssistantAdvertBox 
                navigation={navigation}
            />
            {properAssistants.length == 0 ? (
                properAssistants.map((data,index) => (
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
                ))
            ):(
                <>
                <View style={{padding:15,width:"70%",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,alignItems:"center",justifyContent:"center",opacity:1,marginTop:60,marginBottom:40}}>
                    <Text style={{fontWeight:"700",fontSize:20}}>Sorry we have no professional yet :(</Text>
                    <View style={{width:"100%",padding:8,flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10}}>
                        <MaterialCommunityIcons 
                            name="information"
                            size={23}
                        />
                        <Text style={{fontWeight:"600",opacity:0.6,fontSize:10,marginLeft:10,width:"82%"}}>We are in the very early stages of development and we have no professional yet on our team ... </Text>
                    </View>
                    
                </View>
                <OneOptionBox
                    textColor="black"
                    subTitle="Follow us on instagram"
                    mainTitle="Stay tuned for updates"
                    buttonTitle="Follow"
                    bgColor="white"
                    image={require('../../../../../assets/logo.png')}
                    stw={200}
                    imageStyle={{width:140,height:140,marginRight:10,borderWidth:1,borderColor:"white",borderRadius:30}}
                    navigation={navigation}
                    tw={140}
                    onClick={() => handlePress("https://www.instagram.com/pocket.protect.app/")} 
                />
            </>
            )
            }
            {selectedAssistant != null &&
            <Modal animationType="slide" visible={selectedAssistant != null}>
                <AssistModal 
                    assistantData={selectedAssistant}
                    setSelectedAssistant={setSelectedAssistant}
                    bodyPart={bodyPart != null ? bodyPart : null}
                    navigation={navigation}
                    userData={currentuser}
                />
            </Modal>
            }
        </View>
    )
}








