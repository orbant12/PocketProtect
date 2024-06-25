
import { View,ScrollView,Text,Image,TextInput } from "react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../../services/firebase"
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { useState,useRef,useEffect } from "react";


function AiDiagnosis(){
    const functions = getFunctions(app);
    //DETECTION
    const snapPoints = ['80%'];
    const bottomSheetRef = useRef(null);
    const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)
    const [isAddTriggered, setIsAddTriggered] = useState(false)

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
    const [addedSymptoms, setAddedSymptoms] = useState([])
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
    
    const generateDiagnosisFromPrompt = async (request) => {
        const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
        try {
            const result = await generateTextFunction({name: request});    
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

    const ProcessAllPossibleOutcomes = async () => {
        const type = "causes"
        let symptonScript = addedSymptoms.join(", ");
        const sympthomsPrompt = `Sympthoms: ${symptonScript}`;
        const prompt = `${sympthomsPrompt}. Can you give me the most probable causes from the following symphtoms. It is important that your answer must only contain the name of the cause with a , seperating them. Cause can be a diagnosis , lifestyle choice, food / weather / allergy effect or any reasonable cause `;
        const response = await generateDiagnosisFromPrompt(prompt)
        console.log(response)
        return {possibleOutcomes:response, clientSymptoms:symptonScript}
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
    const result = await ProcessAllPossibleOutcomes()
    if (result.possibleOutcomes != "qid:too_broad"){
        const survey = await ProcessCreateSurvey(result.possibleOutcomes)
        if (survey) {
        navigation.navigate("SurveyScreen", {data: survey, outcomes: result.possibleOutcomes, clientSymptoms: result.clientSymptoms,isDone: "Not yet"})
        setIsDiagnosisLoading(false)
        }
    } else if (possibleOutcomes == "qid:too_broad"){
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
            <Pressable style={{alignItems:"center",borderWidth:0}} onPress={() => Keyboard.dismiss()}>
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
        <GestureHandlerRootView style={{ flex: 1,width:"100%" }}>
            <BottomSheetModalProvider>
                <View style={Dstyles.container}>
                    {isAddTriggered ?
                        !isDiagnosisLoading ?
                        <Tabs.Container
                            renderHeader={header}
                            style={{backgroundColor:"white",color:"magenta"}}
                            containerStyle={{color:"white",backgroundColor:"white"}}                                                
                            renderTabBar={tabBar}                                                               
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
                        : (
                            <ScrollView style={{width:"100%",height:"100%"}}>
                            <View style={{width:"100%",alignItems:"center"}}>   
                                <View style={{width:"100%",borderTopWidth:0}}>                       
                                <PagerView style={{marginTop:0,height:290,width:"100%",borderWidth:0}} onPageScroll={(e) => handleScrollReminder(e)} initialPage={0}>                                  
                                    <View key={1} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%"}}>
                                        <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
                                            <Text style={{borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>1</Text> 
                                            <Text style={{width:"80%",fontSize:15,fontWeight:"800",opacity:"0.7",marginBottom:0,marginLeft:20}}>Type in your concerns and describe how you feel in detail ...</Text>    
                                        </View>         
                                        <Image 
                                            source={tutorial1}
                                            style={{width:380,height:200}}
                                        />             
                                    </View>

                                    <View key={2} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%"}}>
                                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>2</Text>
                                    </View>

                                    <View key={3} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%"}}>
                                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>3</Text>
                                    </View>

                                    <View key={4}  style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%"}}>
                                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>4</Text>
                                    </View>                                
                                </PagerView>                                                              
                                </View>
                                <View style={[styles.IndicatorContainer]}>               
                                        <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />                     
                                        <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />
                                        <View style={[styles.Indicator, { opacity: currentPage === 2 ? 1 : 0.3 }]} />
                                        <View style={[styles.Indicator, { opacity: currentPage === 3 ? 1 : 0.3 }]} />                                
                                    </View>                            
                                <View style={{borderWidth:1,width:"95%",borderRadius:20,alignItems:"center",height:"100%",backgroundColor:"black",marginBottom:230}}>                            
                                    <View style={{width:50, borderWidth:1.5,borderColor:"white", opacity:0.7,marginTop:10}} />
                                    <Text style={{color:"white",fontWeight:"700",fontSize:15,marginTop:10}}>Get Started</Text>
                                    <TouchableOpacity onPress={() => handleAddingSwitch()} style={styles.addInputContainer}>
                                    <MaterialCommunityIcons 
                                        name='plus'
                                        color={"white"}
                                        size={20}
                                        style={{opacity:0.3}}
                                    />
                                    <Text style={{color:"white",fontWeight:"400",marginLeft:20}}>Physical Diagnosis</Text>
                                    </TouchableOpacity >

                                    <TouchableOpacity onPress={() => handleAddingSwitch()} style={styles.addInputContainerMental}>
                                    <MaterialCommunityIcons 
                                        name='plus'
                                        color={"black"}
                                        size={20}
                                        style={{opacity:0.3}}
                                    />
                                    <Text style={{color:"black",fontWeight:"400",marginLeft:20,fontWeight:"600"}}>Mental Diagnosis</Text>
                                    </TouchableOpacity >                            
                                </View> 
                            </View> 
                        </ScrollView>
                        )
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
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
    )
}


const Dstyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        marginTop:100,
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