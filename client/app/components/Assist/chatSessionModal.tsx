
import { View, ScrollView,Pressable, Keyboard,TouchableOpacity } from "react-native"
import { NavBar_AssistantModal } from "./navbarAssistantModal"
import { useRef, useState,useEffect } from "react"
import { ChatLogView } from "../ChatPage/chatLogView"
import { ChatInput } from "../ChatPage/chatLogView"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../../context/UserAuthContext"
import { fetchChat, realTimeUpdateChat } from "../../services/server"
import { messageStateChange } from "../../utils/assist/messageStateChanger"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { styles_shadow } from "../../styles/shadow_styles"
import { Success_Purchase_Client_Checkout_Data } from "../../utils/types"

type ChatLogType = {
    user:string,
    message:string,
    sent:boolean,
    date: Date
    inline_answer:boolean
}



export const ChatSessionModal = ({
    selectedChat,
    setSelectedChat
}:{
    selectedChat:Success_Purchase_Client_Checkout_Data | null,
    setSelectedChat:(arg:Success_Purchase_Client_Checkout_Data | null ) => void;
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

    const fetchSessionChat = async (sessionId:string) => {
        const response = await fetchChat({
            clientId:currentuser.uid,
            sessionId:sessionId
        })
        setChatLog(response)
        console.log("1")
    }

    useEffect(() => {
        fetchSessionChat(selectedChat.id)
    },[])

    //WEB SOCKET
    useEffect(() => {
        if( selectedChat.id != ""){
            fetchSessionChat(selectedChat.id);
        }

        if( selectedChat.id != ""){
            // Set up interval to fetch data every 5 seconds
            const intervalId = setInterval(() => fetchSessionChat(selectedChat.id), 4000);
            return () => clearInterval(intervalId);
        }
    }, [selectedChat])


    return(
    <GestureHandlerRootView>
        <View ref={scrollRef} style={{marginTop:0,height:"100%"}}> 
                <NavBar_AssistantModal 
                    goBack={() => setSelectedChat(null)}
                    bgColor={"black"}
                    title={selectedChat != null ? selectedChat.purchase.type : ""}
                    id={selectedChat != null ? selectedChat.id : ""}
                    right_icon={{type:"image",name:selectedChat != null ? selectedChat.assistantData.profileUrl : ""}}
                />
                
                <ChatLogView 
                    chatLog={chatLog}
                    me={currentuser.uid}
                    handleKeyboardDismiss={handleKeyboardDismiss}
                    end={selectedChat != null ? selectedChat.assistantData.id : ""}
                    profileUrl={selectedChat != null ? selectedChat.assistantData.profileUrl : ""}
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