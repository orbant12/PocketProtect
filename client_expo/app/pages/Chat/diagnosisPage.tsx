
import { View,ScrollView,Text,Image,TextInput, Pressable, Keyboard, Switch, ActivityIndicator, StyleSheet, Dimensions, Modal } from "react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../services/firebase"
import "react-native-gesture-handler"
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { useState,useRef, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { styles } from "../../styles/chatBot_style";
import { NavBar_TwoOption } from "../../components/Common/navBars";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContextToggleType, UserContextType } from "../../utils/types";
import { BottomOptionsModal } from "./components/ai_chat/bottomOptionsModal";
import { Navigation_Diag_Survey } from "../../navigation/navigation";
import { ContextPanelData } from "../../models/ContextPanel";
import { useWeather } from "../../context/WeatherContext";
import { useAuth } from "../../context/UserAuthContext";
import { DataModal, generateTodayForWidget, selectableDataTypes } from "../Profile/tabs/userSavedPage";


const { width } = Dimensions.get('window');

export type OpenApiResponseType = {
    data: {
        data: {
            choices: {
                message: {
                    content: string;
                };
            }[];
        };
    };
};



function AiDiagnosis({navigation,route}){

    const { currentuser } = useAuth()
    const { weatherData,locationString,locationPermissionGranted } = useWeather()

    const functions = getFunctions(app);
    const [isInfoActive, setIsInfoActive] = useState<boolean>(false)
    const [selectedType, setSelectedType] = useState<null | "context" | "help" | "questions">(null);
    const contextVisualObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})

    const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>(route.params.ContextOptions)
    const [ContextVisualOptions, setContextVisualOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])
    const [selectedData, setSelectedData] = useState<null | selectableDataTypes>(null);

    const [ contextToggles , setContextToggles ] = useState<ContextToggleType>(route.params.contextToggles != undefined ? route.params.contextToggles : {
        useBloodWork:false,
        useUvIndex:false,
        useMedicalData:false,
        useBMI:false,
        useWeatherEffect:false,
    });

    const [sympthomInput, setSympthomInput] = useState('')
    const [addedSymptoms, setAddedSymptoms] = useState<string[]>([])
    const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)
    const addingInput = useRef(null);

    const ensureAnswer = async (surveyData : {type:string,q:string}[]) : Promise < {type:string,q:string}[] | null > => {
        const filtered = surveyData.filter(item => item.q !== undefined)
        const result = filtered.every((item) => {
            return item.type == "feedback" || item.type == "binary";
        });

        if (!result){
            return null
        } 
        return filtered;
    }
    
    const handleAddSympthoms = () => {
        setAddedSymptoms([
        ...addedSymptoms,
        sympthomInput
        ])
        setSympthomInput('')
        addingInput.current.blur()
    }
    
    const handleRemoveSymptom = (symptomToRemove) => {
        const updatedSymptoms = addedSymptoms.filter(symptom => symptom !== symptomToRemove);        
        setAddedSymptoms(updatedSymptoms);
    };
    
    const generateDiagnosisFromPrompt = async (request:string):Promise<string> => {
        const generateTextFunction:Function = httpsCallable(functions, 'openAIHttpFunctionSec');
        try {
            const result : OpenApiResponseType = await generateTextFunction({name: request});    
            return `${result.data.data.choices[0].message.content}`
        } catch (error) {
            console.error('Firebase function invocation failed:', error);
            return error
        }
    };
    
    //——————— FEATURE ENGINEERING - SURVEY ---------

    const ProcessAllPossibleOutcomes = async ():Promise <{possibleOutcomes:string, clientSymptoms:string}> => {
        const type = "causes"
        let symptonScript:string = addedSymptoms.join(", ");
        const sympthomsPrompt = `Sympthoms: ${symptonScript}`;
        const prompt = `${sympthomsPrompt}. Can you give me the most probable causes from the following symphtoms. It is important that your answer must only contain the name of the cause with a , seperating them. Cause can be a diagnosis , lifestyle choice, food / weather / allergy effect or any reasonable cause `;
        const response:string | "qid:too_broad" = await generateDiagnosisFromPrompt(prompt)
        console.log(response)
        return {possibleOutcomes:response, clientSymptoms:symptonScript}
    }

    const ProcessCreateSurvey= async (causes:string):Promise<{ type:string, q: string }[] | false> => {
        try{
            let symptonScript = addedSymptoms.join(", ");
            const sympthomsPrompt:string = `Client reported sympthoms: ${symptonScript}`;
            const causesPrompt:string = `Possible causes: ${causes}`
            const prompt:string = `${causesPrompt}.${sympthomsPrompt}. You are a doctor trying to diagnose your patient, simulate your question stlyes like you are having a conversation with your patient. Create a servey from which you will be able to determine which causes is the most likely one. Servey must only contain forms of these: yes or no (qid:binary), client feedback required (qid:feedback). Your answer must be only contain the survey and each question asked like this:
            binary,Have you ...? \n
            feedback,Please describe ... \n `;
            const response :string= await generateDiagnosisFromPrompt(prompt)
            
            const formattedData = response.split('\n').map(line => {
                const [type, question] = line.split(',');
                return { type, q: question };
            });
            
            return formattedData
        }  catch (error) {
            return false
        }
    }
    const handleStartSurvey = async () => {
        setIsDiagnosisLoading(true)
        const result : {possibleOutcomes:string, clientSymptoms:string} = await ProcessAllPossibleOutcomes()
        if (result.possibleOutcomes != "qid:too_broad"){
            const survey = await ProcessCreateSurvey(result.possibleOutcomes)
            if (survey != false) {
            const filteredSurveyData = await ensureAnswer(survey) 
            if (filteredSurveyData != null){
                Navigation_Diag_Survey({
                    surveyData:survey,
                    result:result,
                    isDone:"Not yet",
                    navigation:navigation
                })
            } else{
                alert("There was a system error please try again !")
            }
            setIsDiagnosisLoading(false)
            }
            } else {
                setIsDiagnosisLoading(false)
            }
    }

    const fetchContextDatas = async () => {
        await contextVisualObj.loadContextData()
        const v_response = contextVisualObj.getContextOptions()
        setContextVisualOptions(v_response)
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

    //<=======>  Componnets <===========>

    function tabBar(){
        return(
        <View style={{backgroundColor:"white",height:50, zIndex:-1  }}></View> 
        )
    }
    
    function header(){
        return(
            <Pressable style={{alignItems:"center",borderWidth:0,zIndex:-1}} onPress={() => Keyboard.dismiss()}>
            <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons 
            name='memory'
            color={"black"}
            size={20}
            style={{opacity:0.3}}
            />
            <TextInput
            ref={addingInput}
            placeholder="Add one concern"
            style={styles.searchInput}
            onChangeText={(e) => setSympthomInput(e)}
            value={sympthomInput}
            onBlur={() => addingInput.current.blur()}
            />
            <TouchableOpacity onPress={handleAddSympthoms} style={[{borderRadius:8,borderWidth:1,backgroundColor:"black",position:"absolute",right:0,top:0,borderTopLeftRadius:0,borderBottomLeftRadius:0},sympthomInput == "" && {backgroundColor:"white"}]}>
            <MaterialCommunityIcons 
                name='plus'
                color={sympthomInput != "" ?  "white" : "black"}
                size={25}
                style={{opacity:1,padding:8}}
            />
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-evenly",alignItems:"center",marginTop:30}}>
                {!(addedSymptoms.length == 0) ?
                <TouchableOpacity onPress={handleStartSurvey} style={{borderRadius:5,borderWidth:2,backgroundColor:"rgba(250,0,250,0.2)",marginTop:15,borderColor:"magenta"}}>
                    <Text style={{color:"black",padding:10,fontWeight:"700",paddingLeft:15,paddingRight:15,opacity:1,fontSize:12}}>Start Diagnosis</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => alert("No concern has been added !")} style={{borderRadius:5,borderWidth:2,backgroundColor:"rgba(250,0,250,0.2)",marginTop:15,borderColor:"magenta",opacity:0.5}}>
                    <Text style={{color:"black",padding:10,fontWeight:"700",paddingLeft:15,paddingRight:15,opacity:1,fontSize:12}}>Start Diagnosis</Text>
                </TouchableOpacity>
                }       
            </View>
        </Pressable>
        )
    }
    

    return(
        <>
        <View style={{ width:"100%",backgroundColor:"white" }}>
                <SafeAreaView style={{backgroundColor:"rgba(255,255,255,0.7)"}}>
                <NavBar_TwoOption 
                    title={"Type in your concerns"}
                    icon_left={{name:"arrow-left",size:25,action:() => navigation.goBack()}}
                    icon_right={{name:"folder-eye-outline",size:30,action:() => setSelectedType("context")}}
                    style={{zIndex:9999}}
                />
                </SafeAreaView>
                <View style={Dstyles.container}>
                        {!isDiagnosisLoading ?
                        <Tabs.Container
                            renderHeader={header}
                            containerStyle={{backgroundColor:"white",zIndex:1}}                                                
                            renderTabBar={tabBar}     
                            headerContainerStyle={{backgroundColor:"white",zIndex:1}}                                                          
                        >                             
                            <Tabs.Tab 
                                name="C"            
                                label={() => <Entypo name={'folder'} size={25} color={"white"} />}
                            >
                                <Tabs.ScrollView>
                                <View style={{width:"100%",height:70,backgroundColor:"rgba(0,0,0,1)",marginTop:0,alignItems:"center",justifyContent:"center",flexDirection:"row",borderBottomWidth:0.3,borderColor:"white"}}>
                                        <View style={{ alignItems:"center"}}>
                                        <View style={{width:"30%",borderWidth:1,borderColor:"white",marginBottom:10}} />
                                    <Text style={{color:"white",fontWeight:"700",fontSize:18}}>Your Sympthoms</Text>
                                        </View>  
                                    <Text style={{color:"white",fontWeight:"700",fontSize:12,right:18,position:"absolute",borderWidth:1,borderColor:"magenta",paddingVertical:6,borderRadius:15,paddingHorizontal:10,opacity:0.7}}>{addedSymptoms.length}</Text>
                                </View>   
                                <ScrollView style={{width:"100%",borderWidth:1,paddingBottom:200,height:"100%",backgroundColor:"rgba(0,0,0,1)"}}>
                                    <View style={{width:"100%",alignItems:"center",padding:10}}>
                                    {addedSymptoms.map((data)=>(
                                    <View style={{borderWidth:0.3,padding:15,marginBottom:20,width:"90%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",borderRadius:5,backgroundColor:"rgba(250,0,250,0.2)",borderColor:"magenta"}}>
                                        <Text style={{fontSize:14,fontWeight:"600",color:"white"}}>{data}</Text>
                                        <MaterialCommunityIcons 
                                        name='close'
                                        color={"red"}
                                        size={15}
                                        style={{opacity:1,padding:5,borderWidth:1,borderRadius:5,borderColor:"red"}}
                                        onPress={() => handleRemoveSymptom(data)}
                                        />
                                    </View>
                                    ))}  
                                    </View>
                                </ScrollView>
                                </Tabs.ScrollView>
                            </Tabs.Tab>      
                        </Tabs.Container>                                                    
                        
                        :
                        <View style={styles.loadingModal}>
                            <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Your diagnosis is in process ...</Text>
                            <ActivityIndicator size="large" color="black" />
                        </View>
                    }                   
                </View>
        </View>
        <BottomOptionsModal 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            contextToggles={contextToggles}
            setContextToggles={setContextToggles}
            handleStartChat={() => {}}
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


const Dstyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        marginTop:0,
        width:'100%',
        alignItems:'center',
        position:"relative",
        height:"100%",
        justifyContent:"center",
        zIndex:-1
  },
  diagnosisPage:{
    alignItems:"center",
    width:"100%",
    height:"100%",
    paddingBottom:40,
  }
});


export default AiDiagnosis;

