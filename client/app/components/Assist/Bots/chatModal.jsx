import { Chat_InputField } from "./chatInputField"
import { ChatLogView } from "../../ChatPage/chatLogView"
import { Modal,View } from "react-native"
import { NavBar_AssistantModal } from "../navbarAssistantModal"
import { useState } from "react"
import robotLogo from "../../../assets/assist/robotAI.png"

export const ChatBot_Modal = ({
    setInputText,
    setChatLog,
    chatLog,
    handleKeyboardDismiss,
    inputText,
    handlePromptTrigger,
    chatScrollRef,
    currentuser,
    handleOpenBottomSheet
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
          <Modal visible={chatLog.length != 0} >
            <View style={{width:"100%",alignItems:"center",height:"100%"}}>
                <NavBar_AssistantModal 
                    goBack={setChatLog}
                    scrollRef={chatScrollRef}
                    bgColor={"black"}
                    title={"Chat Log"}
                    id={"session_10232"}
                    right_icon={{type:"static_image",name:robotLogo}}
                    right_action={() => handleOpenBottomSheet("open")}
                />
                <ChatLogView 
                    chatLog={chatLog}
                    me={currentuser.uid}
                    end={"gpt"}
                    profileUrl={robotLogo}
                    chatScrollRef={chatScrollRef}
                    handleScroll={handleScroll}
                    handleKeyboardDismiss={handleKeyboardDismiss}
                />
                <Chat_InputField 
                    handleSend={handlePromptTrigger}
                    handleOpenBottomSheet={handleOpenBottomSheet}
                    setInputValue={setInputText}
                    inputValue={inputText}
                />
            </View>
        </Modal>
      )
  }