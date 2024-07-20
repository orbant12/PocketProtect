
import { View,ScrollView,Text,Image,TextInput, Pressable, Keyboard, Switch, ActivityIndicator, StyleSheet, Dimensions, Modal } from "react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../services/firebase"
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { useState,useRef,useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { styles } from "../../styles/chatBot_style";
import { PagerComponent } from "../../components/Common/pagerComponent";
import tutorial1 from "../../assets/diagnosis/first.png"
import { NavBar_TwoOption } from "../../components/Common/navBars";
import { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const { width } = Dimensions.get('window');

type OpenApiResponseType = {
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



function AiDiagnosis({navigation}){
    const functions = getFunctions(app);
    //DETECTION
    const snapPoints = ['80%'];
    const bottomSheetRef = useRef(null);
    const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)
    const [isAddTriggered, setIsAddTriggered] = useState(false)
    const [isInfoActive, setIsInfoActive] = useState<boolean>(false)

    const [ contextToggles , setContextToggles ] = useState({
        useBloodWork:false,
        useWeatherEffect:false,
    })
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
    const [sympthomInput, setSympthomInput] = useState('')
    const [addedSymptoms, setAddedSymptoms] = useState<string[]>([])
    const [progress, setProgress] = useState(0)
    const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)
    const addingInput = useRef(null);

    const handleAddingSwitch = async () => {
        setIsAddTriggered(!isAddTriggered)
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
    
    const handleOpenBottomSheet = (state:"open" | "hide") => {
        if(state == "open"){
            bottomSheetRef.current.present();      
        } else if (state == "hide"){
            bottomSheetRef.current.close();
            setProgress(progress + 0.1)
        }
    }
    
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

    useEffect(()=>{
        if(isAddTriggered == true && addingInput.current != null){
        addingInput.current.focus()
        } else if(isAddTriggered == false){
        }
    },[isAddTriggered])
    

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
    const ProcessCreateSurvey= async (causes:string):Promise<{ type:string, q: string }[]> => {
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
    }
    const handleStartSurvey = async () => {
    setIsDiagnosisLoading(true)
    const result : {possibleOutcomes:string, clientSymptoms:string} = await ProcessAllPossibleOutcomes()
    if (result.possibleOutcomes != "qid:too_broad"){
        const survey = await ProcessCreateSurvey(result.possibleOutcomes)
        if (survey) {
        navigation.navigate("SurveyScreen", {data: survey, outcomes: result.possibleOutcomes, clientSymptoms: result.clientSymptoms,isDone: "Not yet"})
        setIsDiagnosisLoading(false)
        }
    } else if (result.possibleOutcomes == "qid:too_broad"){
        alert("too broad")
    }
    }

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
    
                <TouchableOpacity onPress={() => handleOpenBottomSheet("open")} style={{borderRadius:10,borderWidth:1,backgroundColor:"black",marginTop:15}}>
                    <Text style={{color:"white",padding:10,fontWeight:"700",paddingLeft:10,paddingRight:10,opacity:1,fontSize:12}}>Context Panel</Text>
                </TouchableOpacity>
    
                {!(addedSymptoms.length == 0) &&
                <TouchableOpacity onPress={handleStartSurvey} style={{borderRadius:10,borderWidth:2,backgroundColor:"white",marginTop:15}}>
                    <Text style={{color:"black",padding:10,fontWeight:"700",paddingLeft:10,paddingRight:10,opacity:1,fontSize:12}}>Start Diagnosis</Text>
                </TouchableOpacity>
                }       
            </View>
        </Pressable>
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


    return(
        <>
        <GestureHandlerRootView style={{ width:"100%",backgroundColor:"white" }}>
            <BottomSheetModalProvider>
                <SafeAreaView style={{backgroundColor:"rgba(255,255,255,0.7)"}}>
                <NavBar_TwoOption 
                    title={"Type in your concerns"}
                    icon_left={{name:"arrow-left",size:25,action:() => navigation.goBack()}}
                    icon_right={{name:"information",size:25,action:() => setIsInfoActive(!isInfoActive)}}
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
                                <View style={{width:"100%",height:60,backgroundColor:"black",marginTop:0,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                        <View style={{ alignItems:"center"}}>
                                        <View style={{width:"30%",borderWidth:1,borderColor:"white",marginBottom:10}} />
                                    <Text style={{color:"white",fontWeight:"700",fontSize:18}}>Your Sympthoms</Text>
                                        </View>  
                                    <Text style={{color:"white",fontWeight:"700",fontSize:12,right:18,position:"absolute",borderWidth:1,borderColor:"magenta",paddingVertical:6,borderRadius:15,paddingHorizontal:10,opacity:0.7}}>{addedSymptoms.length}</Text>
                                </View>   
                                <ScrollView style={{width:"100%",borderWidth:1,paddingBottom:200,height:"100%"}}>
                                    <View style={{width:"100%",alignItems:"center",padding:10}}>
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
                                </Tabs.ScrollView>
                            </Tabs.Tab>      
                        </Tabs.Container>                                                    
                        
                        :
                        <View style={styles.loadingModal}>
                            <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Your diagnosis is in process ...</Text>
                            <ActivityIndicator size="large" color="black" />
                        </View>
                    }
                    <BottomSheetModal
                        ref={bottomSheetRef}
                        snapPoints={snapPoints}
                        onChange={() => setIsContextPanelOpen(!isContextPanelOpen)}
                        enablePanDownToClose={true}
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30}}
                        handleIndicatorStyle={{backgroundColor:"white"}}
                    >
                        {ContextPanel()}
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
        <InfoModal 
            isInfoActive={isInfoActive}
            setIsInfoActive={setIsInfoActive}
        />
        </>
    )
}


const InfoModal = ({
    isInfoActive,
    setIsInfoActive
}:{
    isInfoActive:boolean,
    setIsInfoActive:Function
}) => {
    return(
        <Modal visible={isInfoActive} animationType="slide" presentationStyle="formSheet" style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
        <View style={{width:"100%",alignItems:"center",height:"90%",justifyContent:"space-between",marginTop:"10%"}}>  
            
                <View style={{width:"100%"}} >  
                <PagerComponent
                    pages={[
                        {pageComponent:() => 
                            <TutorialPage
                                image={tutorial1}
                                title={"Type in your concerns and describe how you feel in detail ..."}
                                index={1}
                            />
                        },
                        {pageComponent:() => 
                            <TutorialPage
                                image={tutorial1}
                                title={"Type in your concerns and describe how you feel in detail ..."}
                                index={2}
                            />
                        },
                    ]}
                    pagerStyle={{height:"70%",borderWidth:1,marginTop:10}}
                    indicator_position={{backgroundColor:"black",padding:12}}
                    dotColor={"white"}
                />                                                       
                </View>  
            
               
            <View style={{borderWidth:1,width:"95%",borderRadius:20,alignItems:"center",backgroundColor:"black",marginTop:-50,padding:0,paddingBottom:25}}>                            
                <View style={{width:50, borderWidth:1.5,borderColor:"white", opacity:0.7,marginTop:10}} />
                <Text style={{color:"white",fontWeight:"700",fontSize:15,marginTop:10}}>Get Started</Text>
                
                <TouchableOpacity onPress={() => setIsInfoActive(!isInfoActive)} style={{flexDirection:"row",
                    alignItems:"center",
                    borderWidth:1,
                    width:"80%",
                    marginTop:20,
                    borderRadius:50,
                    padding:12,
                    backgroundColor:"white",
                    justifyContent:"center"
                }}>
                    <MaterialCommunityIcons 
                        name={"check"}
                        color={"black"}
                        size={20}
                        style={{opacity:0.5}}
                    />
                    <Text style={{color:"black",marginLeft:20,fontWeight:"600"}}>Understand</Text>
                </TouchableOpacity >                            
            </View> 
        </View> 
        </Modal>
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


export default AiDiagnosis;



const TutorialPage = ({
    index,
    image,
    title
}) => {
    return(
        <View key={index} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%",padding:10}}>
        <View style={{flexDirection:"row",alignItems:"center",marginBottom:10,marginTop:0}}>
            <Text style={{borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>{index}</Text> 
            <Text style={{width:"80%",fontSize:15,fontWeight:"800",opacity:0.7,marginBottom:0,marginLeft:20}}>{title}</Text>    
        </View>         
        <Image 
            source={image}
            style={{width:width,height:"65%",borderWidth:0,marginBottom:0}}
        />             
    </View>
    )
}