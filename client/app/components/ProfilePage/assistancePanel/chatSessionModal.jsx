
import { View, ScrollView,Pressable, Keyboard } from "react-native"
import { NavBar_AssistantModal } from "./navbarAssistantModal"
import { useRef, useState } from "react"
import { ChatLogView } from "../../ChatPage/chatLogView"
import { ChatInput } from "../../ChatPage/chatLogView"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../../../context/UserAuthContext"
import { realTimeUpdateChat } from "../../../services/server"



export const ChatSessionModal = ({
    selectedChat,
    setSelectedChat
}) => {

    const scrollRef = useRef(null);
    const { currentuser } = useAuth();

    const [chatLog,setChatLog] = useState([]);
    const [isInputActive, setIsInputActive] = useState(false);
    const [ inputValue, setInputValue] = useState("")

    const handleKeyboardDismiss = () => {
        setIsInputActive(false)
        Keyboard.dismiss()
    }

    const updateChatLog = async (chatState) => {
        const response = await realTimeUpdateChat({
            userId: currentuser.uid,
            sessionId: selectedChat.id,
            chat:chatState
        })
        console.log(response)
        return response
    }

    const handleSend = async (content) => {
        const message = {user:`${currentuser.uid}`,message:content,sent:false};
        const chatState = [...chatLog,message]
        setChatLog(chatState)
        setInputValue(null)
        try {
            const response = await updateChatLog(chatState);
            if (response === true) {
                const updatedChatState = chatState.map((msg, index) => 
                    index === chatState.length - 1 ? { ...msg, sent: true } : msg
                );
                setChatLog(updatedChatState);
            } else {
                console.error('Failed to update chat log');
            }
        } catch (error) {
            console.error('Error updating chat log:', error);
        }
    }

    return(
    <GestureHandlerRootView>
        <View ref={scrollRef} style={{marginTop:0,height:"100%"}}> 
                <NavBar_AssistantModal 
                    goBack={setSelectedChat}
                    scrollRef={scrollRef}
                />
                <View style={{borderWidth:1,height:"85%",paddingTop:150}}>
                    <ChatLogView 
                        chatLog={chatLog}
                        me={currentuser.uid}
                        handleKeyboardDismiss={handleKeyboardDismiss}
                        end={selectedChat.length != 0 ? selectedChat.assistantData.id : ""}
                    />
                </View>
                <ChatInput 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSend={handleSend}
                />
        </View>
    </GestureHandlerRootView>
    )
}