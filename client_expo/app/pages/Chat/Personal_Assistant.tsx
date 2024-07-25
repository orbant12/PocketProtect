
import React, {useEffect, useState,useRef} from 'react';
import {Text,View, Pressable,Keyboard, TouchableOpacity, Image,ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../services/firebase"
import "react-native-gesture-handler"
import { NavBar_AssistantModal } from '../../components/Assist/navbarAssistantModal';
import { PagerComponent } from '../../components/Common/pagerComponent';
import { useAuth } from '../../context/UserAuthContext';
import { ChatBot_Modal } from '../../components/Assist/Bots/chatModal';
import { styles } from '../../styles/chatBot_style';
import { Chat_InputField } from '../../components/Assist/Bots/chatInputField';
import { ContextPanel, ContextSheet } from '../../components/Assist/contextSheet';
import { styles_shadow } from '../../styles/shadow_styles';
import { Modal } from 'react-native';

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

const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);

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

const handleKeyboardDismiss = () => {
  Keyboard.dismiss()
}

const handleStartChat = () => {
  const f_q = {user:"gpt",message:"Hello, how can I help you today ?",sent:true, inline_answer: false}
  setChatLog([f_q])
}


//<==================<[ Main Return ]>====================>

return (
  <>
    <View style={{ flex: 1,width:"100%",backgroundColor:"white",height:"100%",justifyContent:"space-between",marginBottom:20}}>
        {/*HEADER*/}
        <NavBar_AssistantModal
          goBack={() => navigation.goBack()}
          title={"Ask Anything"}
          id={"Are you having suspicious sympthoms ?"}
          right_icon={{type:"icon",name:"comment-eye"}}
          right_action={() => setSelectedType("questions")}
        />
        {/*AI ASSISTANT*/}
        <AiAssistant 
          setSelectedType={setSelectedType}
          handleStartChat={handleStartChat}
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
          setSelectedType={setSelectedType}
        />
        <BottomOptionsModal 
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </View>
  </>
)}

export default AssistantPage


//<==================<[ Coponents ]>====================>

const BottomOptionsModal = ({selectedType, setSelectedType}:{
  selectedType: null | "context" | "help" | "questions";
  setSelectedType:(e:null | "context" | "help" | "questions") => void;
}) => {
  return(
    <Modal visible={selectedType != null} presentationStyle="formSheet" animationType='slide'>
      <TouchableOpacity onPress={() => setSelectedType(null)} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.86)",borderWidth:2,borderColor:"gray",paddingVertical:10,borderRadius:10,width:"100%",alignSelf:"center",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
        <MaterialCommunityIcons 
          name='close'
          size={25}
          color={"white"}
        />
        <Text style={{color:"white",fontWeight:"800",fontSize:16,marginLeft:10,marginRight:10}}>Close</Text>
      </TouchableOpacity>

      {selectedType == "context" &&
        <ContextPanel />
      }
      {selectedType == "help" &&
      <View style={{width:"100%"}}>
        <PagerComponent 
                indicator_position={{backgroundColor:"black",padding:15}}
                dotColor={"white"}
                pagerStyle={{height:"80%",borderWidth:3,width:"90%",marginTop:"10%",alignSelf:"center",borderRadius:10}}
                pages={[
                    {pageComponent:() =>
                        <Image
                            source={{uri: maleDefault}}
                            style={{width:"100%",height:"100%",objectFit:"contain"}}
                        />
                    },
                    {pageComponent:() =>
                    <Image
                        source={{uri: maleDefault}}
                        style={{width:"100%",height:"100%",objectFit:"contain"}}
                    />
                    }
                ]}
              /> 
      </View>
      }
      {selectedType == "questions" &&
        <QuestionsSheet />
      }
    </Modal>
  )
}

  const AiAssistant = ({
      setSelectedType ,
       handleStartChat
  }:{
    setSelectedType:(e:null | "context" | "help") => void;
     handleStartChat:() => void;
  }) => {
    return(
        <>
          <View style={[styles.container,{height:"90%",justifyContent:"space-between",backgroundColor:"white",}]}>    
            <WelcomeAiCompontent 
              setSelectedType={setSelectedType}
            />
            <WelcomeBottom 
              handleStartChat={handleStartChat}
            />
          </View>
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

  const maleDefault = Image.resolveAssetSource(require("../../assets/male.png")).uri;
  const WelcomeAiCompontent = ({setSelectedType}) => {
    return(
      <View  style={[{width:"100%",flexDirection:"column",alignItems:"center",height:"55%",justifyContent:"center"},styles_shadow.shadowContainer]}>
        <View>
          <Text style={{fontWeight:"600",opacity:1}}><Text style={{fontWeight:"600",opacity:0.5}}>Hi Admin</Text> 👋</Text>
          <Text style={{marginTop:8,fontWeight:"800",fontSize:25}}>Your AI Medic</Text>
        </View>
        <View style={{width:"100%",alignItems:"center",marginTop:20,opacity:0.8}}>
          <TouchableOpacity onPress={() => setSelectedType("help")} style={{width:"60%",paddingHorizontal:10,paddingVertical:15,backgroundColor:"rgba(0,0,0,0.3)",borderRadius:10,justifyContent:"center",alignItems:"center",marginVertical:10,borderWidth:2}}>
            <Text style={{color:"white",fontWeight:"700"}}>How it works ?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedType("context")} style={{width:"60%",paddingHorizontal:10,paddingVertical:15,backgroundColor:"rgba(0,0,0,0.7)",borderRadius:10,justifyContent:"center",alignItems:"center",marginVertical:10,borderWidth:2}}>
            <Text style={{color:"white",fontWeight:"700"}}>Context Sheet</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  const WelcomeBottom = ({
     handleStartChat
  }) => {
    return(
      <View style={[{alignItems:"center",width:"100%",marginBottom:20,height:"40%",justifyContent:"space-between"},styles_shadow.shadowContainer]}>
        <View style={{alignItems:"center",width:"100%"}}>
          <Text style={{fontWeight:"800",opacity:1,fontSize:20,marginBottom:20}}>Welcome to AI Assistant</Text>
          <View style={{width:"80%",padding:10,backgroundColor:"rgba(0,0,0,0.9)",alignItems:"center",borderRadius:10}}>
            <View style={{width:"100%",padding:10,backgroundColor:"rgba(255,255,255,0.1)",borderRadius:5,marginBottom:10,flexDirection:"row",alignItems:"center"}}>
              <MaterialCommunityIcons 
                name='doctor'
                size={25}
                color={"white"}
              />
              <Text style={{fontWeight:"700",opacity:0.9,fontSize:11,textAlign:"left",color:"white",width:"90%",marginLeft:"5%"}}>Get quick and accurate advice and insight to your concerns and sympthoms</Text>
            </View>
          
            <View style={{width:"100%",padding:10,backgroundColor:"rgba(255,255,255,0.1)",borderRadius:5,marginBottom:0,flexDirection:"row",alignItems:"center"}}>
              <MaterialCommunityIcons 
                name='doctor'
                size={25}
                color={"white"}
              />
              <Text style={{fontWeight:"700",opacity:0.9,fontSize:11,textAlign:"left",color:"white",width:"90%",marginLeft:"5%"}}>AI can see your Medical Data like: Blood Work, BMI or additional vital medical information you've provided ...</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleStartChat} style={{width:"60%",paddingHorizontal:20,paddingVertical:18,backgroundColor:"magenta",borderRadius:100,justifyContent:"center",alignItems:"center",marginVertical:10}}>
          <Text style={{color:"white",fontWeight:"700"}}>Get Started</Text>
        </TouchableOpacity>
      </View>
    )
  }


  const QuestionsSheet = () => {
    return(
      <View style={{width:"100%",flexDirection:"column",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",height:"100%"}}>
        <Text style={{fontWeight:"700",fontSize:20,padding:10,alignSelf:"flex-start",marginTop:10,color:"white"}}>Let's Explore</Text>
        <View style={{flexWrap:"wrap",width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          <QuestionBox 
            title={"Blood Work Insight"}
            q={"Can you give me insight on my blood work ?"}
            icon={"water"}
          />
          <QuestionBox 
            title={"Symptoms"}
            q={"Ask about sympthoms sdésl ld, sol,dol "}
            icon={"doctor"}
          />
        </View>
      </View>
    )
  }

  const QuestionBox = ({
    title,
    q,
    icon
  }:{ 
    title:string;
    q:string;
    icon:string;
  }) => {
    return(
      <View style={{width:170,height:170,borderWidth:0.5,borderRadius:10,margin:5,backgroundColor:"rgba(0,0,0,1)",flexDirection:"column",padding:10,justifyContent:"space-between",borderColor:"white"}}>
        <MaterialCommunityIcons 
          name={icon}
          size={30}
          color={"white"}
          style={{padding:5}}
        />
        <View style={{width:"100%",marginTop:15}}>
          <Text style={{color:"white",fontWeight:"700",fontSize:16}}>{title}</Text>
          <Text style={{color:"white",fontWeight:"600",fontSize:12,opacity:0.8,marginTop:5}}>{q}</Text>
        </View>
        <TouchableOpacity style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:5,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:10,height:30}]}>
          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
          <MaterialCommunityIcons 
            name='arrow-right'
            color={"magenta"}
            size={15}
          />
        </TouchableOpacity>
      </View>
    )
  }