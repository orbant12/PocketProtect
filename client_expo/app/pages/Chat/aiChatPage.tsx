import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { useAuth } from "../../context/UserAuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { PromptResponseFormat } from "./aiChatWelcome";
import { app } from "../../services/firebase";
import { ChatBot_Modal } from "./components/ai_chat/chatModal";
import { ContextToggleType} from "../../utils/types";
import { BottomOptionsModal } from "./components/ai_chat/bottomOptionsModal";
import { DataModal, generateTodayForWidget, selectableDataTypes } from "../Profile/tabs/userSavedPage";
import { BloodWorkCategory } from "../../services/server";
import { useWeather } from "../../context/WeatherContext";
import { ContextPanelData } from "../../models/ContextPanel";




const AiChatPage = ({route,navigation}) => {
    const { currentuser } = useAuth()
    const { weatherData,locationString,locationPermissionGranted } = useWeather()
    const functions = getFunctions(app);
    const [inputText,setInputText] = useState(route.params.preQuestion != undefined ? route.params.preQuestion : "");
    const [chatLog,setChatLog] = useState([...route.params.chatLog]);
    const [questionLoading,setQuestionLoading] = useState(false);    

    const [selectedData, setSelectedData] = useState<null | selectableDataTypes>(null);
    const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>(route.params.ContextOptions)
    const [ContextVisualOptions, setContextVisualOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])
    const contextVisualObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})

    const placeholders = {
        useBloodWork:"[ Blood Work Provided ]",
        useUvIndex:`[ UV Index Provided ]`,
        useMedicalData:"[ Allergies Provided ]",
        useWeatherEffect:"[ Weather Data Provided ]"
    }

    const [ contextToggles , setContextToggles ] = useState<ContextToggleType>(route.params.contextToggles != undefined ? route.params.contextToggles : {
        useBloodWork:false,
        useUvIndex:false,
        useMedicalData:false,
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


      const handlePromptTrigger = ({e,c_t}:{e:string,c_t?:"blood_work" | "uv" | "medical" | "weather"}) => { 
        if (questionLoading == false){
            setQuestionLoading(true)
            //fid the active one 
            const activeContext = Object.keys(contextToggles).find(key => contextToggles[key] === true);
            const keyIndex = ContextOptions.findIndex((e) => e.stateID == activeContext);
            let contextText = c_t == undefined ? ( activeContext != undefined ? {placeholder:placeholders[activeContext],message:ContextOptions[keyIndex].stateName} : {placeholder:"",message:""} ) : generateBYCT(c_t);
            const question =  e;
            let chatLogNew = [...chatLog, {user:`${currentuser.uid}`,message:`${contextText.placeholder + " " + question}`,sent:true,inline_answer: false}];
            setChatLog([...chatLogNew, {user:`gpt`,message:"Loading...",sent:true, inline_answer: false}]);
            //FUNCTION EVENT
            generateTextFromPrompt(question,contextText);
            setInputText("")
          } else {
              alert("Wait for the answer !")
          }
      };

      const generateBYCT = (c_t:"blood_work" | "uv" | "medical" | "weather") => {
        const indexOfBloodWork = ContextOptions.findIndex((e) => e.stateID == "useBloodWork");
        const indexOfUvIndex = ContextOptions.findIndex((e) => e.stateID == "useUvIndex");
        const indexOfMedicalData = ContextOptions.findIndex((e) => e.stateID == "useMedicalData");
        const indexOfWeatherEffect = ContextOptions.findIndex((e) => e.stateID == "useWeatherEffect");
        return ( c_t == "blood_work" ? {placeholder:placeholders.useBloodWork ,message:convertBloodWorkCategoriesToString(ContextOptions[indexOfBloodWork].stateName)} : c_t == "uv" ? {placeholder:placeholders.useUvIndex ,message:ContextOptions[indexOfUvIndex].stateName} : c_t == "medical" ? {placeholder:placeholders.useMedicalData ,message:ContextOptions[indexOfMedicalData].stateName} : {placeholder:placeholders.useWeatherEffect ,message:ContextOptions[indexOfWeatherEffect].stateName} );
      }

      const handleContextDataChange = async (field:selectableDataTypes,data:any[]) => {
        const responseAllergies = await contextVisualObj.setContextOptions(field,data)
        const v_response = contextVisualObj.getContextOptions()
        setContextVisualOptions(v_response)
        setContextOptions(context => context.map((item) => item.stateID === field ? {...item,stateName:responseAllergies} : item))
      }

      const fetchContextDatas = async () => {
        await contextVisualObj.loadContextData()
        const v_response = contextVisualObj.getContextOptions()
        setContextVisualOptions(v_response)
      }


      useEffect(() => {
        if(route.params.preQuestion != undefined){
            const text : {c_t:"blood_work" | "uv" | "medical" | "weather", message:string} = route.params.preQuestion
            handlePromptTrigger({e:text.message,c_t:text.c_t})
        }
        fetchContextDatas()
      },[])

    return(
        <>
            <ChatBot_Modal 
                setInputText={setInputText}
                chatLog={chatLog}
                setChatLog={setChatLog}
                handleKeyboardDismiss={handleKeyboardDismiss}
                inputText={inputText}
                handlePromptTrigger={() => handlePromptTrigger({e:inputText})}
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
                handleStartChat={(e,c_t) => {handlePromptTrigger({e:e,c_t:c_t}),setSelectedType(null)}}
                userContexts={ContextOptions}
                setDataSelected={(e) => {setSelectedData(e);setSelectedType(null)}}
            />
            <DataModal 
                selectedData={selectedData}
                setSelectedData={(e) => {setSelectedData(e);setSelectedType("context")}}
                uviData={
                    {
                        locationString:locationString,
                        weatherData:weatherData,
                        today:generateTodayForWidget(),
                        locationPermissionGranted:locationPermissionGranted
                    }
                }
                userContexts={ContextVisualOptions}
                setUserContexts={(field,data) => handleContextDataChange(field,data)}
                handleAllergiesFetch={fetchContextDatas}
        />
        </>
    )
}

export default AiChatPage;




export function convertBloodWorkCategoriesToString(categories: BloodWorkCategory[]): string {
    return categories.map(category => {
        const dataStrings = category.data.map(item => `${item.type}: ${item.number}`).join(', ');
        return `${category.title}: ${dataStrings}`;
    }).join('\n');
  }