
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import "react-native-gesture-handler"
import { NavBar_AssistantModal } from '../../components/Assist/navbarAssistantModal';
import { useAuth } from '../../context/UserAuthContext';
import { Navigation_Diag_Input } from '../../navigation/navigation';
import { ContextToggleType, UserContextType} from '../../utils/types';
import { BloodWorkCategory, fetchBloodWork } from '../../services/server';
import { BottomOptionsModal } from './components/ai_chat/bottomOptionsModal';
import { DiagWelcomeComponent } from './components/diag/diagWelcomePage';
import { useWeather } from '../../context/WeatherContext';
import { DataModal, generateTodayForWidget, selectableDataTypes } from '../Profile/tabs/userSavedPage';
import { ContextPanelData } from '../../models/ContextPanel';


const DiagWelcomePage = ({navigation}) => {


//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()
const { weatherData,locationString,locationPermissionGranted } = useWeather()

const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);

const contextObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})
const contextVisualObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})

const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])
const [ContextVisualOptions, setContextVisualOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])
const [selectedData, setSelectedData] = useState<null | selectableDataTypes>(null);

//<==================<[ Functions ]>====================>

const [ contextToggles , setContextToggles ] = useState<ContextToggleType>({
  useBloodWork:false,
  useUvIndex:false,
  useMedicalData:false,
  useWeatherEffect:false,
})


const handleStartChat = () => {
    Navigation_Diag_Input({
      navigation:navigation,
      contextToggles:contextToggles,
      ContextOptions:ContextOptions
    })
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
          title={"Suspicious Sympthoms ?"}
          id={"Get quick answers to your concerns?"}
          right_icon={{type:"icon",name:"information"}}
          right_action={() => setSelectedType("help")}
        />
        {/*AI ASSISTANT*/}
        <DiagWelcomeComponent
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

export default DiagWelcomePage;
