
import { View, ScrollView,Pressable, Keyboard,TouchableOpacity } from "react-native"
import { NavBar_AssistantModal } from "./navbarAssistantModal"
import { useRef, useState,useEffect } from "react"
import { ChatLogView } from "../../ChatPage/chatLogView"
import { ChatInput } from "../../ChatPage/chatLogView"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../../../context/UserAuthContext"
import { realTimeUpdateChat } from "../../../services/server"
import { messageStateChange } from "../../../utils/assist/messageStateChanger"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { styles_shadow } from "../../../styles/shadow_styles"


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
    const [isAtBottom, setIsAtBottom] = useState(true);

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

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;
        setIsAtBottom(isBottom);
      };
    

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
                    bgColor={"black"}
                    title={selectedChat.length != 0 ? selectedChat.purchase.type : ""}
                    profileUrl={selectedChat.length != 0 ? selectedChat.assistantData.profileUrl : ""}
                    id={selectedChat.length != 0 ? selectedChat.id : ""}
                />
                
                <ChatLogView 
                    chatLog={chatLog}
                    me={currentuser.uid}
                    handleKeyboardDismiss={handleKeyboardDismiss}
                    end={selectedChat.length != 0 ? selectedChat.assistantData.id : ""}
                    profileUrl={selectedChat.length != 0 ? selectedChat.assistantData.profileUrl : ""}
                    chatScrollRef={chatScrollRef}
                    handleScroll={handleScroll}
                />
                
                <ChatInput 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSend={handleSend}
                />
                {!isAtBottom &&
                    <TouchableOpacity onPress={() => scrollToBottom()} style={[{position:"absolute",zIndex:100,padding:5,backgroundColor:"white",borderRadius:100,borderWidth:0,bottom:90,right:15,alignItems:"center",opacity:0.9},styles_shadow.hightShadowContainer]} >
                        <MaterialCommunityIcons 
                            name="chevron-down"
                            size={35}
                        />
                    </TouchableOpacity>
                }
        </View>
    </GestureHandlerRootView>
    )
}