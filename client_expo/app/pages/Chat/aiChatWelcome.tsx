
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import "react-native-gesture-handler"
import { NavBar_AssistantModal } from '../../components/Assist/navbarAssistantModal';
import { useAuth } from '../../context/UserAuthContext';
import { Navigation_AI_Chat } from '../../navigation/navigation';
import { ContextToggleType } from '../../utils/types';
import { BottomOptionsModal } from './components/ai_chat/bottomOptionsModal';
import { AiAssistant } from './components/ai_chat/aiWelcomePage';
import { useWeather } from '../../context/WeatherContext';
import { DataModal, generateTodayForWidget, selectableDataTypes } from '../Profile/tabs/userSavedPage';
import { ContextPanelData } from '../../models/ContextPanel';



export type PromptResponseFormat = {data:{data:{choices:{message:{content:string}}[]}}}

const AssistantPage = ({navigation}) => {

//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()
const { weatherData,locationString,locationPermissionGranted } = useWeather()

const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);
const [selectedData, setSelectedData] = useState<null | selectableDataTypes>(null);
const contextObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})
const contextVisualObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})
const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])
const [ContextVisualOptions, setContextVisualOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])

//<==================<[ Functions ]>====================>

const [ contextToggles , setContextToggles ] = useState<ContextToggleType>({
  useBloodWork:false,
  useUvIndex:false,
  useMedicalData:false,
  useWeatherEffect:false,
})


const handleStartChat = (e:"get_started" | string,c_t:"blood_work" | "uv" | "medical" | "weather") => {
  const f_q = {user:"gpt",message:"Hello, how can I help you today ?",sent:true, inline_answer: false}

  const q_w_context = {c_t:c_t,message:e}

  if (e == "get_started"){
    Navigation_AI_Chat({
      navigation:navigation,
      chatLog:[f_q],
      contextToggles:contextToggles,
      ContextOptions:ContextOptions,
    })
  } else {
    Navigation_AI_Chat({
      navigation:navigation,
      chatLog:[f_q],
      contextToggles:contextToggles,
      preQuestion: q_w_context,
      ContextOptions:ContextOptions,
    })
  }
  setSelectedType(null)
}


const fetchContextDatas = async () => {
  await contextObj.loadContextDataForString()
  await contextVisualObj.loadContextData()
  const v_response = contextVisualObj.getContextOptions()
  const response = contextObj.getContextOptions()
  setContextVisualOptions(v_response)
  setContextOptions(response)
}

const handleContextDataChange = async (field:selectableDataTypes,data:any[]) => {
  const responseAllergies = await contextVisualObj.setContextOptions(field,data)
  const v_response = contextVisualObj.getContextOptions()
  setContextVisualOptions(v_response)
  setContextOptions(context => context.map((item) => item.stateID === field ? {...item,stateName:responseAllergies} : item))
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
      </View>
  </>
)}

export default AssistantPage
