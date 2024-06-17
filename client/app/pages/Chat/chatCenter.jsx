import { View,Text,TouchableOpacity,Image,SafeAreaView,Modal } from "react-native"
import { SessionBar } from "../../components/ProfilePage/assistancePanel/sessionBar"
import { AssistPanel_style } from "../../styles/assistance_style"
import { ChatSessionModal } from "../../components/ProfilePage/assistancePanel/chatSessionModal"
import { useAuth } from "../../context/UserAuthContext"
import { useState, useEffect } from "react"
import { fetchAssistantSessions } from "../../services/server"


const ChatCenter = () => {

    const [ selectedChat, setSelectedChat] = useState([])
    const {currentuser} = useAuth();
    const [assistSessions, setAssistSessions] = useState([])

    const fetchAllAssistantSession = async () => {
        const response = await fetchAssistantSessions({
            userId: currentuser.uid
        })
        setAssistSessions(response)
    }


    useEffect(() => {
        fetchAllAssistantSession()
    },[selectedChat])

    return(
        <View style={AssistPanel_style.container}>
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

export default ChatCenter


