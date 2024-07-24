
import React, {useEffect, useState,useRef} from 'react';
import {Text,View, Pressable,Keyboard } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../services/firebase"
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavBar_AssistantModal } from '../../components/Assist/navbarAssistantModal';
import { PagerComponent } from '../../components/Common/pagerComponent';
import { useAuth } from '../../context/UserAuthContext';
import { ChatBot_Modal } from '../../components/Assist/Bots/chatModal';
import { styles } from '../../styles/chatBot_style';
import { Chat_InputField } from '../../components/Assist/Bots/chatInputField';
import { ContextSheet } from '../../components/Assist/contextSheet';

export type PromptResponseFormat = {data:{data:{choices:{message:{content:string}}[]}}}



const AssistantPage = ({navigation}) => {


//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()

const [inputText,setInputText] = useState('');

const [chatLog,setChatLog] = useState([]);

const [questionLoading,setQuestionLoading] = useState(false);

const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)

const contextSheet = useRef(null);
const chatScrollRef = useRef(null);
const functions = getFunctions(app);


//<==================<[ Functions ]>====================>

const generateTextFromPrompt = async (request:string) => {
  const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
  let chatLogNew = [...chatLog, {user:`${currentuser.uid}`,message:`${request}`,sent:true,inline_answer: false} ]
  try {
      const result = await generateTextFunction({name: request}) as PromptResponseFormat;
      setChatLog([...chatLogNew, {user:`gpt`,message:`${result.data.data.choices[0].message.content}`, sent:true, inline_answer: false}])
      setQuestionLoading(false)
  } catch (error) {
      console.error('Firebase function invocation failed:', error);
  }
};

const handlePromptTrigger = () => { 
  if (questionLoading == false){
      setQuestionLoading(true)
      const  question =  inputText;
      let chatLogNew = [...chatLog, {user:`${currentuser.uid}`,message:`${question}`,sent:true,inline_answer: false}];
      setChatLog([...chatLogNew, {user:`gpt`,message:"Loading...",sent:true, inline_answer: false}]);
      //FUNCTION EVENT
      generateTextFromPrompt(question);
      setInputText("")
    } else {
        alert("Wait for the answer !")
    }
};

const handleOpenBottomSheet = (state:"open" | "hide") => {
  if(state == "open"){
      contextSheet.current.present();
    
  } else if (state == "hide"){
      contextSheet.current.close();
  }
}

const handleKeyboardDismiss = () => {
  Keyboard.dismiss()
}


//<==================<[ Main Return ]>====================>

return (
  <>
    <GestureHandlerRootView style={{ flex: 1,width:"100%",backgroundColor:"white",height:"100%",justifyContent:"space-between",marginBottom:20}}>
      <BottomSheetModalProvider>
        {/*HEADER*/}
        {!isContextPanelOpen ? 
        <NavBar_AssistantModal
          goBack={() => navigation.goBack()}
          title={"Ask Anything"}
          id={"Are you having suspicious sympthoms ?"}
          right_icon={{type:"icon",name:"comment-eye"}}
          right_action={() => handleOpenBottomSheet("open")}
        />
        :
        <Pressable onPress={() => {handleKeyboardDismiss()}} style={[{width:"100%",backgroundColor:"rgba(0,0,0,1)",padding:10,position:"relative",height:"20%",justifyContent:"center",alignItems:"center",paddingTop:30},]}>
        <View style={{paddingTop:30, width:"100%"}}>
          <Text style={{fontWeight:"700",fontSize:20,width:"100%",color:"white",textAlign:"center",position:"relative"}}>
            <Text style={{color:"gray",fontWeight:"800",}}> Pick the data </Text>
            you want <Text style={{color:"gray",fontWeight:"800"}}>Ai</Text> to see during your assistance
          </Text> 
        </View>
        </Pressable>
        }
        {/*AI ASSISTANT*/}
        <AiAssistant 
          setInputText={setInputText}
          inputText={inputText}                    
          handleKeyboardDismiss={handleKeyboardDismiss}
          handlePromptTrigger={handlePromptTrigger}
          handleOpenBottomSheet={handleOpenBottomSheet}
          />      
        <ChatBot_Modal 
          setInputText={setInputText}
          chatLog={chatLog}
          setChatLog={setChatLog}
          handleKeyboardDismiss={handleKeyboardDismiss}
          inputText={inputText}
          handlePromptTrigger={handlePromptTrigger}
          chatScrollRef={chatScrollRef}
          currentuser={currentuser}
          handleOpenBottomSheet={handleOpenBottomSheet}
        />
        {/*CONTEXT*/}
        <ContextSheet
          contextSheet={contextSheet}
          isContextPanelOpen={isContextPanelOpen}
          setIsContextPanelOpen={setIsContextPanelOpen}          
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView >
  </>
)}

export default AssistantPage


//<==================<[ Coponents ]>====================>

  const AiAssistant = ({
      setInputText,
      inputText,
      handleKeyboardDismiss,
      handlePromptTrigger,
      handleOpenBottomSheet
  }:{
    setInputText:(e:string) => void;
    inputText:string;
    handleKeyboardDismiss:(e:any) => void;
    handlePromptTrigger:() => void;
    handleOpenBottomSheet:(state:"open" | "hide") => void;
  }) => {
    return(
      <>
          <Pressable style={[styles.container,{}]}>    
            <PagerComponent 
              indicator_position={{backgroundColor:"black",padding:15}}
              dotColor={"white"}
              pagerStyle={{height:"60%",borderWidth:1}}
              pages={[
                {pageComponent:() =>
                  <PreWritten_Container 
                    handleKeyboardDismiss={handleKeyboardDismiss}
                  />,
                },
                {pageComponent:() =>
                  <PreWritten_Container 
                    handleKeyboardDismiss={handleKeyboardDismiss}
                  />,
                }
              ]}
            />
          </Pressable>
            <Chat_InputField 
              handleSend={handlePromptTrigger}
              setInputValue={setInputText}
              inputValue={inputText}
              handleOpenBottomSheet={handleOpenBottomSheet}
            />
            </>
    )
  }

  const PreWritten_Container = ({
    handleKeyboardDismiss
  }) => {
    return(
      <Pressable onPress={handleKeyboardDismiss}  style={[styles.assistantQuestionsContainer,{marginLeft:30}]}>
        <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
          <PreWritten_Box />

          <PreWritten_Box />
        </View>    

        <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
          <PreWritten_Box />

          <PreWritten_Box />
        </View> 
    </Pressable> 
    )
  }

  const PreWritten_Box = ({
    
  }:{
    
  }) => {
    return(
      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
      <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
      <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
          <MaterialCommunityIcons 
            name='arrow-right'
            color={"magenta"}
            size={15}
          />
      </Pressable>
    </View>
    )
  }


