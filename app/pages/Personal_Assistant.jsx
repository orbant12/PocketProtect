
//BASIC IMPORTS
import React, {useEffect, useState,useRef} from 'react';
import { ScrollView,StyleSheet,Text,View, Pressable,TextInput,TouchableOpacity,Switch,ActivityIndicator } from 'react-native';


//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../firebase"
import ChatMessage from "../components/Assistant/chatLog";

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

const snapPoints = ['80%'];
const chatSnapPoints = ["95%"];

const functions = getFunctions(app);

const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)


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
      return error
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




const ProcessAllPossibleOutcomes = async () => {
  const type = "causes"
  let symptonScript = addedSymptoms.join(", ");
  const sympthomsPrompt = `Sympthoms: ${symptonScript}`;
  const prompt = `${sympthomsPrompt}. Can you give me the most probable causes from the following symphtoms. It is important that your answer must only contain the name of the cause with a , seperating them. Cause can be a diagnosis , lifestyle choice, food / weather / allergy effect or any reasonable cause `;
  const response = await generateDiagnosisFromPrompt(prompt)
  console.log(response)
  return response
}

const ProcessCreateSurvey= async (causes) => {
  let symptonScript = addedSymptoms.join(", ");
  const sympthomsPrompt = `Client reported sympthoms: ${symptonScript}`;
  const causesPrompt = `Possible causes: ${causes}`
  const prompt = `${causesPrompt}.${sympthomsPrompt}. You are a doctor trying to diagnose your patient, simulate your question stlyes like you are having a conversation with your patient. Create a servey from which you will be able to determine which causes is the most likely one. Servey must only contain forms of these: yes or no (qid:binary), client feedback required (qid:feedback). Your answer must be only contain the survey and each question asked like this:
  binary,Have you ...? \n
  feedback,Please describe ... \n `;
  const response = await generateDiagnosisFromPrompt(prompt)

  const formattedData = response.split('\n').map(line => {
    const [type, question] = line.split(',');
    return { type, q: question };
  });

  return formattedData
}

const handleStartSurvey = async () => {
  setIsDiagnosisLoading(true)
  const possibleOutcomes = await ProcessAllPossibleOutcomes()
  if (possibleOutcomes != "qid:too_broad"){
    const survey = await ProcessCreateSurvey(possibleOutcomes)
    if (survey) {
      navigation.navigate("SurveyScreen", {data: survey, outcomes: possibleOutcomes})
    }
  } else if (possibleOutcomes == "qid:too_broad"){
    alert("too broad")
  }
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



  function AiDiagnosis({sympthomInput}){
    return(
      <View style={Dstyles.container}>
            {isAddTriggered ?
              !isDiagnosisLoading ?                    
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
                    <TouchableOpacity onPress={handleStartSurvey} style={{borderRadius:10,borderWidth:2,backgroundColor:"white",marginTop:15}}>
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
                :
                <View style={styles.loadingModal}>
                  <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Your diagnosis is in process ...</Text>
                  <ActivityIndicator size="large" color="black" />
                </View>
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
                      <View>
                        <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>Done in a moment !</Text>
                        <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Diagnosis in process ...</Text>
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