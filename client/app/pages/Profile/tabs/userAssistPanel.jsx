import { View, Text, TouchableOpacity, Image, StyleSheet,Modal} from "react-native"
import { AssistPanel_style } from "../../../styles/assistance_style"
import { SessionBar } from "../../../components/Assist/sessionBar"
import { useEffect, useState } from "react"
import { ChatSessionModal } from "../../../components/Assist/chatSessionModal"
import { fetchAssistantSessions } from "../../../services/server"
import { useAuth } from "../../../context/UserAuthContext"



const AssistPanel = ({
    navigation
}) => {

    const [ selectedChat, setSelectedChat] = useState([])
    const {currentuser} = useAuth();
    const [assistSessions, setAssistSessions] = useState([])

    useEffect(() => {
        fetchAllAssistantSession()
    },[selectedChat])

    const fetchAllAssistantSession = async () => {
        const response = await fetchAssistantSessions({
            userId: currentuser.uid
        })
        setAssistSessions(response)
    }

    
    return(
        <View style={AssistPanel_style.container}>
            <Text style={{fontWeight:700,fontSize:25,opacity:0.8,marginVertical:30}}>Your Assistant Sessions</Text>
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




