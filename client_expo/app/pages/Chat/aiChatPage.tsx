import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { useAuth } from "../../context/UserAuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { PromptResponseFormat } from "./aiChatWelcome";
import { app } from "../../services/firebase";
import { ChatBot_Modal } from "./components/ai_chat/chatModal";
import { ContextToggleType, UserContextType } from "../../utils/types";
import { BottomOptionsModal } from "./components/ai_chat/bottomOptionsModal";


const AiChatPage = ({route,navigation}) => {
    const { currentuser } = useAuth()
    const functions = getFunctions(app);
    const [inputText,setInputText] = useState(route.params.preQuestion != undefined ? route.params.preQuestion : "");
    const [chatLog,setChatLog] = useState([...route.params.chatLog]);
    const [questionLoading,setQuestionLoading] = useState(false);    

    const [userContexts, setUserContexts] = useState<null | UserContextType>(route.params.userContexts != undefined ? route.params.userContexts : {
        useBloodWork:null,
        useUvIndex:null,
        useMedicalData:null,
        useBMI:null,
        useWeatherEffect:null,
    }
    )

    const placeholders = {
        useBloodWork:"*[ Blood Work Provided ]*",
        useUvIndex:"*[ UV Index Provided ]*",
        useMedicalData:"*[ Medical Data Provided ]*",
        useBMI:"*[ BMI Provided ]*",
        useWeatherEffect:"*[ Weather Data Provided ]*"
    }

    const [ contextToggles , setContextToggles ] = useState<ContextToggleType>(route.params.contextToggles != undefined ? route.params.contextToggles : {
        useBloodWork:false,
        useUvIndex:false,
        useMedicalData:false,
        useBMI:false,
        useWeatherEffect:false,
      });


    const chatScrollRef = useRef(null);

    const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);

    const handleKeyboardDismiss = () => {
        Keyboard.dismiss()
      }

      const generateTextFromPrompt = async (request:string,contextText:{placeholder:string,message:string}) => {
        const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
        let chatLogNew = [...chatLog, {user:`${currentuser.uid}`,message:`${contextText.placeholder + " " + request}`,sent:true,inline_answer: false} ]
        try {
            const result = await generateTextFunction({name:  contextText.message + request}) as PromptResponseFormat;
            setChatLog([...chatLogNew, {user:`gpt`,message:`${result.data.data.choices[0].message.content}`, sent:true, inline_answer: false}])
            setQuestionLoading(false)
        } catch (error) {
            console.error('Firebase function invocation failed:', error);
        }
      };

      const handlePromptTrigger = (e:string) => { 
        if (questionLoading == false){
            setQuestionLoading(true)
            //fid the active one 
            const activeContext = Object.keys(contextToggles).find(key => contextToggles[key] === true);
    
            let contextText = {placeholder:placeholders[activeContext],message:userContexts[activeContext]}
            const  question =  e;
            let chatLogNew = [...chatLog, {user:`${currentuser.uid}`,message:`${contextText.placeholder + " " + question}`,sent:true,inline_answer: false}];
            setChatLog([...chatLogNew, {user:`gpt`,message:"Loading...",sent:true, inline_answer: false}]);
            //FUNCTION EVENT
            generateTextFromPrompt(question,contextText);
            setInputText("")
          } else {
              alert("Wait for the answer !")
          }
      };

      useEffect(() => {
        if(route.params.preQuestion != undefined){
            setInputText(route.params.preQuestion)
            handlePromptTrigger(inputText)
        }
      },[])

    return(
        <>
            <ChatBot_Modal 
                setInputText={setInputText}
                chatLog={chatLog}
                setChatLog={setChatLog}
                handleKeyboardDismiss={handleKeyboardDismiss}
                inputText={inputText}
                handlePromptTrigger={() => handlePromptTrigger(inputText)}
                chatScrollRef={chatScrollRef}
                currentuser={currentuser}
                setSelectedType={setSelectedType}
                navigation={navigation}
                contextToggles={contextToggles}
            />
            <BottomOptionsModal 
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                contextToggles={contextToggles}
                setContextToggles={setContextToggles}
                handleStartChat={async(e) => {handlePromptTrigger(e),setSelectedType(null)}}
                userContexts={userContexts}
            />
        </>
    )
}

export default AiChatPage;