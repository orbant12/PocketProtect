
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


const DiagWelcomePage = ({navigation}) => {


//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()
const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);

const [userContexts, setUserContexts] = useState<null | UserContextType>({
  useBloodWork:null,
  useUvIndex:"",
  useMedicalData:null,
  useBMI:null,
  useWeatherEffect:"",
})

//<==================<[ Functions ]>====================>

const [ contextToggles , setContextToggles ] = useState<ContextToggleType>({
  useBloodWork:false,
  useUvIndex:false,
  useMedicalData:false,
  useBMI:false,
  useWeatherEffect:false,
})


const handleStartChat = () => {
    Navigation_Diag_Input({
      navigation:navigation,
      contextToggles:contextToggles,
      userContexts:userContexts
    })
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
          userContexts={userContexts}
        />
      </View>
  </>
)}

export default DiagWelcomePage;
