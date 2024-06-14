
import { View, ScrollView,Pressable, Keyboard } from "react-native"
import { NavBar_AssistantModal } from "./navbarAssistantModal"
import { useRef, useState } from "react"
import { ChatLogView } from "../../ChatPage/chatLogView"
import { ChatInput } from "../../ChatPage/chatLogView"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../../../context/UserAuthContext"
import { realTimeUpdateChat } from "../../../services/server"
import { messageStateChange } from "../../../utils/assist/messageStateChanger"


export const ChatSessionModal = ({
    selectedChat,
    setSelectedChat
}) => {

    const scrollRef = useRef(null);
    const chatScrollRef = useRef(null);
    const { currentuser } = useAuth();

    const [chatLog,setChatLog] = useState(selectedChat.chat);
    const [isInputActive, setIsInputActive] = useState(false);
    const [ inputValue, setInputValue] = useState("")

    const handleKeyboardDismiss = () => {
        setIsInputActive(false)
        Keyboard.dismiss()
    }

    const updateChatLog = async (chatState) => {
        const updatedChatState = await messageStateChange(chatState)
        const response = await realTimeUpdateChat({
            userId: currentuser.uid,
            sessionId: selectedChat.id,
            chat: updatedChatState
        })
        console.log(response)
        return response
    }

    const scrollToBottom = () => {
        chatScrollRef.current.scrollToEnd({ animated: true });
    };

    const handleSend = async (content) => {
        const message = {user:`${currentuser.uid}`,message:content,sent:false,date: new Date(),inline_answer: chatLog[chatLog.length -1 ].user == currentuser.uid};
        const chatState = [...chatLog,message]
        setChatLog(chatState)
        scrollToBottom()
        setInputValue(null)
        try {
            const response = await updateChatLog(chatState);
            if (response === true) {
                const updatedChatState = await messageStateChange(chatState)
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
                    title={selectedChat.length != 0 ? selectedChat.purchase.type : ""}
                    profileUrl={selectedChat.length != 0 ? selectedChat.assistantData.profileUrl : ""}
                    id={selectedChat.length != 0 ? selectedChat.id : ""}
                />
                <View style={{borderWidth:1,height:"73%",marginTop:115,backgroundColor:"rgba(0,0,0,0.1)"}}>
                    <ChatLogView 
                        chatLog={chatLog}
                        me={currentuser.uid}
                        handleKeyboardDismiss={handleKeyboardDismiss}
                        end={selectedChat.length != 0 ? selectedChat.assistantData.id : ""}
                        profileUrl={selectedChat.length != 0 ? selectedChat.assistantData.profileUrl : ""}
                        chatScrollRef={chatScrollRef}
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