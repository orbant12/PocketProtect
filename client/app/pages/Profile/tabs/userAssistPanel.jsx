import { View, Text, TouchableOpacity, Image, StyleSheet,Modal} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import medic from "../../../assets/assist/assistant.png"
import { AssistPanel_style } from "../../../styles/assistance_style"
import { SessionBar } from "../../../components/ProfilePage/assistancePanel/sessionBar"
import { useEffect, useState } from "react"
import { fetchAssistantSessions } from "../../../services/server"
import { useAuth } from "../../../context/UserAuthContext"
import { ChatSessionModal } from "../../../components/ProfilePage/assistancePanel/chatSessionModal"

const AssistPanel = ({
    navigation
}) => {

    const { currentuser } = useAuth()

    const [assistSessions, setAssistSessions] = useState([])
    const [ selectedChat, setSelectedChat] = useState([])

    const fetchAllAssistantSession = async () => {
        const response = await fetchAssistantSessions({
            userId: currentuser.uid
        })
        setAssistSessions(response)
    }

    useEffect(() =>{
        fetchAllAssistantSession()
    },[])

    return(
        <View style={AssistPanel_style.container}>
            <Text style={{fontWeight:"700",fontSize:25,opacity:0.8,marginVertical:30}}>Your Assistant Sessions</Text>
            {assistSessions.map((data,index) => (
                <SessionBar 
                    data={data}
                    index={index}
                    setSelectedChat={setSelectedChat}
                />
            ))}
            <Modal animationType="slide" visible={selectedChat.length != 0} >
                <ChatSessionModal 
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />    
            </Modal>            
        </View>
    )
}

export default AssistPanel;




