
//BASIC IMPORTS
import React, {useEffect, useState,useRef} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image,TextInput,TouchableOpacity,Switch,ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment, { max } from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../firebase"
import ChatMessage from "../components/Assistant/chatLog";
//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';

import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AssistantPage = ({navigation}) => {


//<**********************VARIABLES******************************>

const [isInputActive,setIsInputActive] = useState(false);

const [headerSelect, setHeaderSelect] = useState(false)

const [assistantType, setAssistantType] = useState("")

const [inputText,setInputText] = useState('');

const [chatLog,setChatLog] = useState([]);

const [questionLoading,setQuestionLoading] = useState(false);

const [isAddTriggered, setIsAddTriggered] = useState(false)

const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)

const [sympthomInput, setSympthomInput] = useState('')

const [ contextToggles , setContextToggles ] = useState({
  useBloodWork:false,
  useWeatherEffect:false,
})

const [addedSymptoms, setAddedSymptoms] = useState([])

const ContextOptions = [
  {
    title:"Blood Work",
    stateName:contextToggles.useBloodWork,
    stateID:"useBloodWork"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
]

//Bottom Sheet
const bottomSheetRef = useRef(null);
const chatSheetRef = useRef(null);
const addingInput = useRef(null);
const diagnoseSheetRef = useRef(null);
const snapPoints = ['80%'];
const chatSnapPoints = ["95%"];
const diagnosisSnapPoints = ["80%"];

const functions = getFunctions(app);

const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)
const [ isDiagnosisDone, setIsDiagnosDone] = useState(false)
const [ fullDiagnosis, setFullDiagnosis] = useState({})

//<********************FUNCTIONS************************>

const generateTextFromPrompt = async (request) => {
  const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
  let chatLogNew = [...chatLog, {user: "me", message: `${request}`} ]
  try {
      console.log(request)
      const result = await generateTextFunction({name: request});
      //SETT LOADING FALSE
      setChatLog([...chatLogNew, {user: "gpt", message: `${result.data.data.choices[0].message.content}`}])
      setQuestionLoading(false)
  } catch (error) {
      console.error('Firebase function invocation failed:', error);
  }
};

const generateDiagnosisFromPrompt = async (request) => {
  const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
  try {
      const result = await generateTextFunction({name: request});
      //SETT LOADING FALSE      
      return `${result.data.data.choices[0].message.content}`
  } catch (error) {
      console.error('Firebase function invocation failed:', error);
  }
};

const handlePromptTrigger = (e) => { 
  if (questionLoading == false){
      setIsInputActive(false)
      // Do something when Enter is pressed, e.g., trigger a function or submit a form
      e.preventDefault();
      setQuestionLoading(true)
      chatSheetRef.current.present()
      const  question =  inputText;
      let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
      //Loading GPT
      setChatLog([...chatLogNew, {user: "gpt", message: "Loading..."}]);
      //FUNCTION EVENT
      generateTextFromPrompt(question);
      setInputText("")
    } else {
        alert("Wait for the answer !")
    }
};

const handleSwitch = (name,e) => {
  if ( name == "useBloodWork"){
    setContextToggles({
      ...contextToggles,
      [name]:e
    })
  }  else if ( name == "useWeatherEffect"){
    setContextToggles({
      ...contextToggles,
      [name]:e
    })
  }
}

const handleOpenBottomSheet = (state) => {
  if(state == "open"){
      bottomSheetRef.current.present();
    
  } else if (state == "hide"){
      bottomSheetRef.current.close();
      setProgress(progress + 0.1)
  }
}

const handleAddingSwitch = async () => {
  setIsAddTriggered(!isAddTriggered)
}

useEffect(()=>{
  if(isAddTriggered == true && addingInput.current != null){
    addingInput.current.focus()
  } else if(isAddTriggered == false){
  }
},[isAddTriggered])

const handleAddSympthoms = () => {
  setAddedSymptoms([
    ...addedSymptoms,
    sympthomInput
  ])
  setSympthomInput('')
}

const handleRemoveSymptom = (symptomToRemove) => {
  // Filter out the symptom to remove
  const updatedSymptoms = addedSymptoms.filter(symptom => symptom !== symptomToRemove);
  
  // Update the state with the filtered array
  setAddedSymptoms(updatedSymptoms);
};

const ProcessSingleDiagnosis = async () => {
  const type = "diagnosis"
  let symptonScript = addedSymptoms.join(", ");
  const sympthomsPrompt = `Sympthoms: ${symptonScript}`;
  const prompt = `${sympthomsPrompt}. Can you give me the most probable diagnosis from the following symphtoms. It is important that your answer must be one word and that word must be the diases name which you find most probable`;
  const response = await generateDiagnosisFromPrompt(prompt)
  setFullDiagnosis(prevState => ({
    ...prevState,
    [type]: response
  }));
  return response
}

const ProcessHelpForDiagnosis = async (diagnosis) => {
  const type = "help"
  const prompt = `I have ${diagnosis}. Can you offer me help advice for solution like: lifestyle choices, medication extc. Be straight forward and you must focus only stating your advice and solutions`;
  const response = await generateDiagnosisFromPrompt(prompt)
  const lines = response.split('\n');
  const formating = lines.map(line => {
    const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
    return { numbering, content };
  });
  setFullDiagnosis(prevState => ({
    ...prevState,
    [type]: formating
  }));
}

const ProcessDiagnosisDescription= async (diagnosis) => {
  const type = "description"
  const prompt = `Can you make a short description about ${diagnosis}. Try to explain it under 50 words and as efficently as possible.`;
  const response = await generateDiagnosisFromPrompt(prompt)
  setFullDiagnosis(prevState => ({
    ...prevState,
    [type]: response
  }));
}

const ProcessDiagnosisSymphtoms = async (diagnosis) => {
  const type = "symphtoms"
  const prompt = `Can list out all common symphtoms of ${diagnosis}. Be straight forward and you must only state th symphtoms by ascending numbered order.`;
  const response = await generateDiagnosisFromPrompt(prompt)
  const lines = response.split('\n');
  const formating = lines.map(line => {
    const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
    return { numbering, content };
  });
  setFullDiagnosis(prevState => ({
    ...prevState,
    [type]: formating
  }));
}

const ProcessDiagnosisRecovery= async (diagnosis) => {
  const type = "recovery"
  const prompt = `You are a doctor. I am your patient and I have ${diagnosis}. List out all of the professional medication used in medicine for recovering from ${diagnosis}. Be straight forward and you must only state your solutions by ascending numbered order.`;
  const response = await generateDiagnosisFromPrompt(prompt)
  const lines = response.split('\n');
  const formating = lines.map(line => {
    const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
    return { numbering, content };
  });
  setFullDiagnosis(prevState => ({
    ...prevState,
    [type]: formating
  }));
}

const handleStartDiagnosis = async () => {
  setIsDiagnosisLoading(true)
  diagnoseSheetRef.current.present()
  try{
    const diagnosis = await ProcessSingleDiagnosis()
    await ProcessHelpForDiagnosis(diagnosis)
    await ProcessDiagnosisDescription(diagnosis)
    await ProcessDiagnosisSymphtoms(diagnosis)
    await ProcessDiagnosisRecovery(diagnosis)
  }
  catch (error) {
    alert(`Something went wrong ${error}`)
  }
  setIsDiagnosDone(true)
}

const handleAccurateDiagnosis = () => {

}


//<******************** CHild Components ************************>

  const AiAssistant = ({setInputText,inputText}) => {
    return(
      <>
          <View style={styles.container}>      
              <ScrollView horizontal style={{width:"100%",borderWidth:3,paddingTop:30,paddingBottom:30}} >
                  <View  style={styles.assistantQuestionsContainer}>

                    <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                      <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                      <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                          <MaterialCommunityIcons 
                            name='arrow-right'
                            color={"magenta"}
                            size={15}
                          />
                        </Pressable>
                    </View>
          
            
                    <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                      <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                      <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                          <MaterialCommunityIcons 
                            name='arrow-right'
                            color={"magenta"}
                            size={15}
                          />
                        </Pressable>
                    </View>

              
                    <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                      <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                      <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                          <MaterialCommunityIcons 
                            name='arrow-right'
                            color={"magenta"}
                            size={15}
                          />
                        </Pressable>
                    </View>
                    
                
                    <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                      <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                      <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                          <MaterialCommunityIcons 
                            name='arrow-right'
                            color={"magenta"}
                            size={15}
                          />
                        </Pressable>
                    </View>

                  </View> 

                  <View  style={styles.assistantQuestionsContainer}>

                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>

                  </View> 

                  <View  style={[styles.assistantQuestionsContainer,{marginRight:-280}]}>

                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>


                  <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                    <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                    <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                        <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                        <MaterialCommunityIcons 
                          name='arrow-right'
                          color={"magenta"}
                          size={15}
                        />
                      </Pressable>
                  </View>

                  </View> 

              </ScrollView> 
              <Pressable onPress={() => handleOpenBottomSheet("open")} style={styles.horizontalQuBox}>
                  <Text style={{padding:10,fontSize:12,fontWeight:"600",color:"white"}}>Open Context Panel</Text>
              </Pressable>  
          </View>

            <View style={[!isInputActive ? styles.inputContainerNotActive : styles.inputContainerActive,{zIndex:0}]}>
              <TextInput 
                placeholder='Type here ...' 
                style={styles.inputField} 
                onChangeText={(e) => setInputText(e)} 
                onFocus={() => setIsInputActive(true)} 
                onSubmitEditing={handlePromptTrigger} 
                value={inputText}
              />
              <Pressable onPress={handlePromptTrigger} style={{backgroundColor:"#CFFFFE",marginLeft:20,borderWidth:0.3,borderRadius:5,width:50,height:50,justifyContent:"center",alignItems:"center"}}>
                <MaterialCommunityIcons 
                  name="send"
                  size={25}
                  color="black"
                />
              </Pressable>
            </View>
            </>
    )
  }

  const DiagnosisSheet = ({isDiagnosisDone,fullDiagnosis}) => {
    return(
      <>
      {!isDiagnosisDone ?
      <View style={styles.loadingModal}>
        <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Your diagnosis is in process ...</Text>
        <ActivityIndicator size="large" color="black" />
      </View>
      :
      fullDiagnosis.help &&
      <ScrollView style={{width:"100%",height:"100%"}} showsVerticalScrollIndicator={false}>
      <View style={Dstyles.diagnosisPage}>

          <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
            <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.diagnosis}</Text>
            <View style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",marginTop:10,borderLeftWidth:2,borderColor:"black"}}>
              <Text style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",paddingLeft:10}}>{fullDiagnosis.description}</Text>
            </View>
          </View> 
        
          <View style={{width:"100%",marginTop:0,borderWidth:2,paddingBottom:30,alignItems:"center"}}>
            <Text style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:20,padding:20}}>Advice</Text>
            <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
            {fullDiagnosis.help.map((data)=>(
              <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                  <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                  <Text style={{padding:0,fontWeight:600,marginTop:20,textAlign:"center"}}>{data.content}</Text>
              </View>
            ))}
            </ScrollView>
          </View>    

          <View style={{width:"100%",marginTop:50,borderWidth:2,paddingBottom:30,alignItems:"center"}}>
            <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:15,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
            <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
            {fullDiagnosis.symphtoms.map((data)=>(
              <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                <Text style={{padding:0,fontWeight:600,marginTop:20,textAlign:"center"}}>{data.content}</Text>
              </View>
            ))}
            </ScrollView>
          </View>

          <View style={{width:"100%",marginTop:50,borderWidth:2,paddingBottom:30,alignItems:"center"}}>
            <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:20,padding:20}}>Medication</Text>
            <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
            {fullDiagnosis.recovery.map((data)=>(
              <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                <Text style={{padding:0,fontWeight:600,marginTop:20,textAlign:"center"}}>{data.content}</Text>
              </View>
            ))}
            </ScrollView>
          </View>

          <TouchableOpacity onPress={handleAccurateDiagnosis} style={{width:200,height:40,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"black",marginTop:40}}>
            <Text style={{fontSize:15,fontWeight:"500",color:"white"}}>It seems accurate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{width:200,height:40,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"white",marginTop:20}}>
            <Text style={{fontSize:15,fontWeight:"500",color:"black"}}>Rediagnose</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{width:200,height:40,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"red",marginTop:20}}>
            <Text style={{fontSize:15,fontWeight:"500",color:"white"}}>Close</Text>
          </TouchableOpacity>

      </View>
      </ScrollView>}

      </>
    )
  }

  function AiDiagnosis({sympthomInput}){
    return(
      <View style={Dstyles.container}>
            {isAddTriggered ?                        
                <>
                <View style={styles.searchInputContainer}>
                    <MaterialCommunityIcons 
                    name='memory'
                    color={"black"}
                    size={20}
                    style={{opacity:0.3}}
                  />
                  <TextInput
                    ref={addingInput}
                    placeholder="Type in your symphtom"
                    style={styles.searchInput}
                    onChangeText={(e) => setSympthomInput(e)}
                    value={sympthomInput}
                  />
                  <TouchableOpacity onPress={handleAddSympthoms} style={{borderRadius:8,borderWidth:1,backgroundColor:"black",position:"absolute",right:0,top:0,borderTopLeftRadius:0,borderBottomLeftRadius:0}}>
                    <MaterialCommunityIcons 
                      name='plus'
                      color={"white"}
                      size={25}
                      style={{opacity:1,padding:8}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-evenly",alignItems:"center",marginTop:5}}>

                    <TouchableOpacity onPress={() => handleOpenBottomSheet("open")} style={{borderRadius:10,borderWidth:1,backgroundColor:"black",marginTop:15}}>
                      <Text style={{color:"white",padding:10,fontWeight:"700",paddingLeft:10,paddingRight:10,opacity:1,fontSize:12}}>Context Panel</Text>
                    </TouchableOpacity>

                  {!addedSymptoms.length == 0 &&
                    <TouchableOpacity onPress={handleStartDiagnosis} style={{borderRadius:10,borderWidth:2,backgroundColor:"white",marginTop:15}}>
                      <Text style={{color:"black",padding:10,fontWeight:"700",paddingLeft:10,paddingRight:10,opacity:1,fontSize:12}}>Start Diagnosis</Text>
                    </TouchableOpacity>
                  }       
                </View>
                

                <TouchableOpacity onPress={() => setIsAddTriggered(!isAddTriggered)} style={{borderRadius:30,borderWidth:0,position:"absolute",right:5,top:0,backgroundColor:"red",marginTop:10,opacity:0.5}}>
                  <MaterialCommunityIcons 
                    name='close'
                    color={"white"}
                    size={13}
                    style={{opacity:1,padding:5}}
                  />
                </TouchableOpacity>

                <View style={{width:"100%",height:50,backgroundColor:"black",marginTop:30,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                  <Text style={{color:"white",fontWeight:"700",fontSize:18}}>Your Sympthoms</Text>
                  <Text style={{color:"white",fontWeight:"700",fontSize:12,right:18,position:"absolute",borderWidth:1,borderColor:"magenta",paddingVertical:6,borderRadius:15,paddingHorizontal:10,opacity:0.7}}>{addedSymptoms.length}</Text>
                </View>
                {addedSymptoms.length == 0 ?
                <View style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.05)",height:200,marginBottom:190}}>
                  <Text style={{padding:40,fontWeight:"700",fontSize:18,textAlign:"center"}}>This is where your added symphtoms will go ...</Text>
                </View>
                :
                <ScrollView style={{width:"100%",borderWidth:1,marginBottom:100}}>
                  <View style={{width:"100%",height:300,alignItems:"center",padding:10}}>
                  {addedSymptoms.map((data)=>(
                    <View style={{borderWidth:0.3,padding:10,marginBottom:20,width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",borderRadius:10}}>
                      <Text>{data}</Text>
                      <MaterialCommunityIcons 
                        name='close'
                        color={"red"}
                        size={13}
                        style={{opacity:1,padding:5}}
                        onPress={() => handleRemoveSymptom(data)}
                      />
                    </View>
                  ))}  
                  </View>
                </ScrollView>
                }
                </>    
              : (
                <View style={{width:"100%",height:"100%",alignItems:"center"}}>   
                  <View style={{width:"100%",borderWidth:1,paddingBottom:20}}>
                    <Text style={{fontWeight:"700",fontSize:20,margin:20}}>How it works ?</Text>
                    <View style={{flexDirection:"row",maxWidth:"100%",width:"100%",flexWrap:'wrap',justifyContent:"space-around"}}>
                      <View style={{height:100,width:130,margin:5,justifyContent:"center",alignItems:"center"}}>
                        <Text style={{position:"absolute",left:0,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>1</Text>
                        <Text>Type in what you are feeling</Text>
                      </View>

                      <View style={{height:100,width:130,margin:5}}>
                        <Text style={{position:"absolute",left:0,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>2</Text>
                      </View>

                      <View style={{borderWidth:0,height:100,width:130,margin:5}}>
                        <Text style={{position:"absolute",left:0,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>3</Text>
                      </View>

                      <View style={{borderWidth:0,height:100,width:130,margin:5}}>
                        <Text style={{position:"absolute",left:0,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>4</Text>
                      </View>
                    </View>
      

                  </View>               
                  <TouchableOpacity onPress={() => handleAddingSwitch()} style={styles.addInputContainer}>
                    <MaterialCommunityIcons 
                      name='plus'
                      color={"white"}
                      size={20}
                      style={{opacity:0.3}}
                    />
                    <Text style={{color:"white",fontWeight:"400",marginLeft:20}}>Add Symthoms</Text>
                  </TouchableOpacity >
                </View> 
              )
            }
      </View>
    )
  }

  function ContextPanel(){
    return(
      
      <View style={Cstyles.container}>
        <ScrollView style={{width:"100%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",height:"100%",paddingTop:0}} showsVerticalScrollIndicator={false}>
          <View style={{width:"100%",alignItems:"center"}}>
          {ContextOptions.map((data,index)=>(
              <View key={index} style={[styles.contextBox, !data.stateName ? {backgroundColor:"magenta"} : {backgroundColor:"lightgreen"}]}>
              <View style={[styles.cardRight, !data.stateName && {}]}>
                <View>
                  {!data.stateName ? 
                    <Text style={{color:"magenta",fontWeight:"500",fontSize:10}}>Not Active</Text>
                  :
                    <Text style={{color:"lightgreen",fontWeight:"500",fontSize:10}}>Active  </Text>
                  }
            
                  <Text style={{color:"white",fontWeight:"700",fontSize:20}}>
                    {data.title}
                </Text>
                </View>

                <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:20,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
                    <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>See Data</Text>
                    <MaterialCommunityIcons 
                      name='arrow-right'
                      color={!data.stateName? "magenta" : "lightgreen"}
                      size={15}
                    />
                </Pressable>
              </View>
              <View style={[styles.cardLeft,  !data.stateName && {}]}>
                <Switch value={data.stateName} onValueChange={(e) => handleSwitch(data.stateID,e)} thumbColor={"white"} trackColor={"magenta"} ios_backgroundColor={"magenta"} />
              </View>
              </View>
          ))
          }     
          </View>
        </ScrollView>
     
      </View>
   
    )
  }


return (
  <>
    <GestureHandlerRootView style={{ flex: 1,width:"100%" }}>
      <BottomSheetModalProvider>
        <View style={[{width:"100%",backgroundColor:"rgba(0,0,0,1)",padding:10,textAlign:"center",position:"relative",height:120,justifyContent:"center",alignItems:"center",paddingTop:30},]}>
              {!isContextPanelOpen ?
                headerSelect ? (
                      <View>
                        <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>Are you having suspicious sympthoms ?</Text>
                        <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Ask anything</Text>
                      </View>
                ):(
                isAddTriggered ?
                  !isDiagnosisLoading ?
                    <View>
                      <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>One by one !</Text>
                      <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Type in your symphtoms</Text>
                    </View>
                    :
                    !isDiagnosisDone ?
                      <View>
                        <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>Done in a moment !</Text>
                        <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Diagnosis in process ...</Text>
                      </View>
                      :
                      <View>
                        <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>{fullDiagnosis.diagnosis}</Text>
                        <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Here is your diagnosis</Text>
                      </View>
                    :
                    <View>
                      <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>Are you having suspicious sympthoms ?</Text>
                      <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Get a diagnosis</Text>
                    </View>
                )
                :
                <Text style={{fontWeight:"700",fontSize:20,width:"100%",color:"white",textAlign:"center",position:"relative"}}>
                  <Text style={{color:"gray",fontWeight:"800",}}> Pick the data </Text>
                  you want <Text style={{color:"gray",fontWeight:"800"}}>Ai</Text> to see during your assistance
                </Text> 
                
              }
        </View> 

        <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",width:"100%",zIndex:0, position:"relative",backgroundColor:"rgba(0,0,0,0.9)",height:50}}>
          <TouchableOpacity onPress={() => setHeaderSelect(true)} style={headerSelect ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
            <Text style={headerSelect?{fontWeight:"600",color:"white"}:{opacity:0.4,fontWeight:600,color:"white"}}>AI Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHeaderSelect(false)} style={!headerSelect ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
            <Text style={headerSelect?{opacity:0.4,fontWeight:600,color:"white"}:{fontWeight:"600",color:"white"}}>Diagnosis</Text>
          </TouchableOpacity>
        </View>        
        {headerSelect ? 
          AiAssistant({setInputText,inputText})
          :
          AiDiagnosis({sympthomInput})
        }

        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={() => setIsContextPanelOpen(!isContextPanelOpen)}
          enablePanDownToClose={true}
          handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
          handleIndicatorStyle={{backgroundColor:"white"}}

        >
          {ContextPanel()}
        </BottomSheetModal>

        <BottomSheetModal
          ref={diagnoseSheetRef}
          snapPoints={diagnosisSnapPoints}
          enablePanDownToClose={true}
          onDismiss={() => {setIsAddTriggered(false);setFullDiagnosis({});setIsDiagnosDone(!isDiagnosisDone);setAddedSymptoms([])}}
          handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
          handleIndicatorStyle={{backgroundColor:"white"}}
          handleComponent={() => 
            <View style={{width:"100%",height:50,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
              <View style={{borderWidth:1,borderColor:"white",width:30}} />        
              <MaterialCommunityIcons 
                name='close'
                color={"white"}
                size={20}
                style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
                onPress={() => {setIsAddTriggered(false);setFullDiagnosis({});setIsDiagnosDone(!isDiagnosisDone);setAddedSymptoms([]);diagnoseSheetRef.current.close()}}
              />
            </View>
          }

        >
          {DiagnosisSheet({
            isDiagnosisDone,fullDiagnosis
          })}
        </BottomSheetModal>

        <BottomSheetModal
          ref={chatSheetRef}
          snapPoints={chatSnapPoints}
          enablePanDownToClose={true}
          onDismiss={() => {setQuestionLoading(false);setChatLog([]);setInputText("")}}
          handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
          handleIndicatorStyle={{backgroundColor:"white"}}
          handleComponent={() => 
            <View style={{width:"100%",height:60,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
              <View style={{borderWidth:1,borderColor:"white",width:30}} />
              <Text style={{color:"white",marginTop:10,fontWeight:"700",fontSize:15}}>AI Chat Log</Text>
              <MaterialCommunityIcons 
                name='close'
                color={"white"}
                size={20}
                style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
                onPress={() => {chatSheetRef.current.close();setQuestionLoading(false);setChatLog([])}}
              />
            </View>
          }
        >

            <ScrollView style={{width:"100%",marginBottom:90,borderWidth:1}}>
              {chatLog.map((message,index) => (
                  <ChatMessage message={message} key={index} />
              ))}
            </ScrollView>
    
              <View style={[!isInputActive ? styles.inputContainerNotActive : styles.inputContainerActive]}>
                <TextInput 
                  placeholder='Type here ...' 
                  style={styles.inputField} 
                  onChangeText={(e) => setInputText(e)} 
                  onFocus={() => setIsInputActive(true)} 
                  onSubmitEditing={handlePromptTrigger}
                  value={inputText}
                />
                <Pressable onPress={handlePromptTrigger} style={{backgroundColor:"#CFFFFE",marginLeft:20,borderWidth:0.3,borderRadius:5,width:50,height:50,justifyContent:"center",alignItems:"center"}}>
                  <MaterialCommunityIcons 
                    name="send"
                    size={25}
                    color="black"
                  />
                </Pressable>
              </View>
        </BottomSheetModal>

      </BottomSheetModalProvider>
    </GestureHandlerRootView >
  </>
)}

const styles = StyleSheet.create({

  container: {
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:0,
      width:'100%',
      alignItems:'center',
      position:"relative",
  },
  assistantTitle:{
    flexDirection:'column',
    justifyContent:'center',
    padding:20,
    width:'100%',
    borderWidth:0,
  },
  assistantQuestionsContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    width:'100%',
    maxWidth:'100%',
    marginTop:0,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:0,
  },
  assistantQuestionBox:{
    width:150,
    height:0,
    borderWidth:1,
    margin:10,
    borderRadius:1,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    opacity:0.6,
  },
  inputContainerNotActive:{
    width:'100%',
    flexDirection:'row',
    padding:20,
    borderWidth:0,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:0,
    zIndex:5,
  },
  inputContainerActive:{
    width:'100%',
    padding:20,
    borderWidth:1,
    alignItems:'flex-start',
    justifyContent:'center',
    position:'absolute',
    bottom:0,
    backgroundColor:'white',
    flexDirection:'row',
    height:"60%"
  },
  inputField:{
    width:'80%',
    height:50,
    borderWidth:1,
    borderRadius:5,
    padding:10,
    zIndex:5,
  },
  horizontalQuBox:{
    backgroundColor:'black',
    borderRadius:5,
    height:60,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    marginTop:30,
    marginBottom:10,
    opacity:1,
    width:"80%"
  },
  contextBox:{
    height:160,
    width:"90%",
    marginTop:40,
    borderRadius:20,
    flexDirection:"row",
    alignItems:"flex-end",
    justifyContent:"center"
  },
  cardRight:{
    width:"72%",
    height:"90%",
    borderRightWidth:10,
    backgroundColor:"black",
    borderRadius:10,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
    borderBottomRightRadius:0,
    padding:20,
    justifyContent:"space-between"
  },
  cardLeft:{
    padding:8,
    alignItems:"center",
    width:"28%",
    height:"100%",
    borderTopLeftRadius:20,
    borderTopRightRadius:15,
    borderBottomRightRadius:10,
    backgroundColor:"black"
  },
  searchInputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:2,
    width:"80%",
    marginTop:50,
    borderRadius:10,
    padding:10,
    justifyContent:"center",
  },
  searchInput:{
    borderWidth:0,
    width:"70%",
    marginLeft:20,
  },
  addInputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    width:"50%",
    marginTop:40,
    borderRadius:50,
    padding:12,
    backgroundColor:"black",
    justifyContent:"center"
  },
  loadingModal:{
    alignItems:"center",
    justifyContent:"center",
    position:"absolute",
    width:"100%",
    height:"100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingBottom:200
},
});

const Cstyles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:0,
      width:'100%',
      alignItems:'center',
      position:"relative",
      height:"100%"
  },
});

const Dstyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingTop:0,
    width:'100%',
    alignItems:'center',
    position:"relative",
    height:"100%",
    justifyContent:"center"
},
diagnosisPage:{
  alignItems:"center",
  width:"100%",
  height:"100%",
  paddingBottom:40,
}
});

export default AssistantPage