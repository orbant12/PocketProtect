
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import "react-native-gesture-handler"
import { NavBar_AssistantModal } from '../../components/Assist/navbarAssistantModal';
import { useAuth } from '../../context/UserAuthContext';
import { Navigation_AI_Chat } from '../../navigation/navigation';
import { ContextToggleType, UserContextType } from '../../utils/types';
import { BloodWorkCategory, fetchBloodWork } from '../../services/server';
import { BottomOptionsModal } from './components/ai_chat/bottomOptionsModal';
import { AiAssistant } from './components/ai_chat/aiWelcomePage';
import { useWeather } from '../../context/WeatherContext';
import { convertWeatherDataToString } from '../../utils/melanoma/weatherToStringConvert';



export type PromptResponseFormat = {data:{data:{choices:{message:{content:string}}[]}}}

const AssistantPage = ({navigation}) => {


//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()
const { weatherData } = useWeather()

const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);

const [userContexts, setUserContexts] = useState<null | UserContextType>({
  useBloodWork:null,
  useUvIndex:weatherData != null ? `UV Index: ${weatherData.uvi}` : null,
  useMedicalData:null,
  useBMI:null,
  useWeatherEffect:weatherData != null ? convertWeatherDataToString(weatherData) : null,
})

//<==================<[ Functions ]>====================>

const [ contextToggles , setContextToggles ] = useState<ContextToggleType>({
  useBloodWork:false,
  useUvIndex:false,
  useMedicalData:false,
  useBMI:false,
  useWeatherEffect:false,
})

const placeholders = {
  useBloodWork:"[ Blood Work Provided ]",
  useUvIndex:`[ UV Index of ${userContexts.useUvIndex} Provided ]`,
  useMedicalData:"[ Medical Data Provided ]",
  useBMI:"[ BMI Provided ]",
  useWeatherEffect:"[ Weather Data Provided ]"
}

const handleStartChat = (e:"get_started" | string,c_t:"blood_work" | "uv" | "medical" | "bmi" | "weather") => {
  const f_q = {user:"gpt",message:"Hello, how can I help you today ?",sent:true, inline_answer: false}

  const q_w_context = {c_t:c_t,message:e}

  if (e == "get_started"){
    Navigation_AI_Chat({
      navigation:navigation,
      chatLog:[f_q],
      contextToggles:contextToggles,
      userContexts:userContexts
    })
  } else {
    Navigation_AI_Chat({
      navigation:navigation,
      chatLog:[f_q],
      contextToggles:contextToggles,
      preQuestion: q_w_context,
      userContexts:userContexts
    })
  }
  setSelectedType(null)
}

function convertBloodWorkCategoriesToString(categories: BloodWorkCategory[]): string {
  return categories.map(category => {
      const dataStrings = category.data.map(item => `${item.type}: ${item.number}`).join(', ');
      return `${category.title}: ${dataStrings}`;
  }).join('\n');
}

const fetchContextDatas = async () => {
  const response = await fetchBloodWork({
    userId: currentuser.uid
  })
  if (response != null){
    setUserContexts({
      ...userContexts,
      useBloodWork:convertBloodWorkCategoriesToString(response.data)
    })
  } 
}

const generateBYCT = (c_t:"blood_work" | "uv" | "medical" | "bmi" | "weather") => {
  return ( c_t == "blood_work" ? {placeholder:placeholders.useBloodWork ,message:userContexts.useBloodWork} : c_t == "uv" ? {placeholder:placeholders.useUvIndex ,message:userContexts.useUvIndex} : c_t == "medical" ? {placeholder:placeholders.useMedicalData ,message:userContexts.useMedicalData} : c_t == "bmi" ? {placeholder:placeholders.useBMI ,message:userContexts.useBMI} : {placeholder:placeholders.useWeatherEffect ,message:userContexts.useWeatherEffect});
}

useEffect(() => {
  fetchContextDatas()
},[])




//<==================<[ Main Return ]>====================>

return (
  <>
    <View style={{ flex: 1,width:"100%",backgroundColor:"white",height:"100%",justifyContent:"space-between",marginBottom:20}}>
        {/*HEADER*/}
        <NavBar_AssistantModal
          goBack={() => navigation.goBack()}
          title={"Ask Anything"}
          id={"Are you having suspicious sympthoms ?"}
          right_icon={{type:"icon",name:"information"}}
          right_action={() => setSelectedType("help")}
        />
        {/*AI ASSISTANT*/}
        <AiAssistant 
          setSelectedType={setSelectedType}
          handleStartChat={handleStartChat}
          userData={currentuser}
          />      
        <BottomOptionsModal 
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          contextToggles={contextToggles}
          setContextToggles={setContextToggles}
          handleStartChat={handleStartChat}
          userContexts={userContexts}
        />
      </View>
  </>
)}

export default AssistantPage
