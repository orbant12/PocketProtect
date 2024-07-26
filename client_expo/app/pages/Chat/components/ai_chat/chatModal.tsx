import { AI_InpitField} from "./chatInputField"
import { ChatLogView } from "../../../../components/ChatPage/chatLogView"
import { Modal,View } from "react-native"
import { NavBar_AssistantModal } from "../../../../components/Assist/navbarAssistantModal"
import { useState } from "react"
import robotLogo from "../../../../assets/assist/robotAI.png"
import { ContextToggleType } from "../../../../utils/types"

export const ChatBot_Modal = ({
    setInputText,
    setChatLog,
    chatLog,
    handleKeyboardDismiss,
    inputText,
    handlePromptTrigger,
    chatScrollRef,
    currentuser,
    setSelectedType,
    navigation,
    contextToggles
  }:{
    setInputText: (arg:string) => void,
    setChatLog: ({}) => void,
    chatLog: any[],
    handleKeyboardDismiss: any,
    inputText: string,
    handlePromptTrigger: any,
    chatScrollRef: any,
    currentuser: any,
    setSelectedType: (arg: "context" | "help" | "questions") => void,
    navigation: any,
    contextToggles:ContextToggleType
  }) => {
      //<========<[ Variables ]>==========>

        const [isAtBottom, setIsAtBottom] = useState(true);

        const handleScroll = (event) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;
            setIsAtBottom(isBottom);
        };
        

      //<===========<[ Main ]>===========>
      return(
            <View style={{width:"100%",alignItems:"center",height:"100%"}}>
                <NavBar_AssistantModal 
                    goBack={() => navigation.goBack()}
                    bgColor={"black"}
                    title={"Chat Log"}
                    id={"session_10232"}
                    right_icon={{type:"icon",name:"comment-question"}}
                    right_action={() => setSelectedType("questions")}
                />
                <View style={{justifyContent:"space-between",marginTop:"0%",width:"100%",height:"88%",borderWidth:3}}>
                    <ChatLogView 
                        chatLog={chatLog}
                        me={currentuser.uid}
                        end={"gpt"}
                        profileUrl={robotLogo}
                        chatScrollRef={chatScrollRef}
                        handleScroll={handleScroll}
                        handleKeyboardDismiss={handleKeyboardDismiss}
                    />
                    <AI_InpitField
                        handleSend={handlePromptTrigger}
                        setInputValue={setInputText}
                        inputValue={inputText}
                        setSelectedType={setSelectedType}
                        contextToggles={contextToggles}
                    />
                </View>
            </View>
      )
  }

