import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { FontAwesome6 } from '@expo/vector-icons';
import React, {useEffect, useState, useRef} from 'react';
import { ScrollView,StyleSheet,Text,View, Pressable,TextInput,TouchableOpacity,Switch,ActivityIndicator,Keyboard,Dimensions ,Image} from 'react-native';
import tutorial1 from "../../assets/diagnosis/first.png"
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../services/firebase"
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import PagerView from 'react-native-pager-view';
import { Horizontal_Navbar } from '../../components/LibaryPage/mainNav';
import { ExploreView } from '../../components/AddPage/exploreView';

const AddDetection = ({navigation}) => {

//<==================<[ Variable ]>====================>  

//NAV
const [headerSelect, setHeaderSelect] = useState("melanoma")
//DIAGNOSIS
const [sympthomInput, setSympthomInput] = useState('')
const [addedSymptoms, setAddedSymptoms] = useState([])
const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)
const [isAddTriggered, setIsAddTriggered] = useState(false)
//CONTEXT
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
const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)
//BOTTOM SHEET
const bottomSheetRef = useRef(null);
const addingInput = useRef(null);
const snapPoints = ['80%'];
//GOOGLE FIREBASE FUNCTIONS
const functions = getFunctions(app);
//H-SWIPE
const { width } = Dimensions.get('window');
const [currentPage, setCurrentPage] = useState(0);
//DETECTION
const CancerDetectionData = [
    {   
        id: "melanoma",
        title: "Melanoma Monitoring",
        desc: "Scan all of your birthmark and let us keep you protected 24/7",
        state: "ready",
        icon: "magnifying-glass-location"
    },
    {
        id: "skin_cancer",
        title: "Skin Cancer",
        desc: "Coming early 2025 ! - Not Avalible Yet",
        state: "soon",
        icon: "magnifying-glass-location"
    },

]
const OverallHealthData = [
    {
        id: "blood_work",
        title: "Blood Work Analasis",
        desc: "Coming early 2025 ! - Not Avalible Yet",
        state: "ready",
        icon: "magnifying-glass-location"
    }
]


//<==================<[ Functions ]>====================>  

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

const handleOpenBottomSheet = (state) => {
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

function handleNavigation(id){
    if (id == "melanoma"){
        navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})
    }
}

const handleScrollReminder = (e) => {
    const page = Math.round(e.nativeEvent.position);
    setCurrentPage(page);
}

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


//<==================<[ Child Components ]>====================> 

    function tabBar(){
        return(
        <View style={{backgroundColor:"white",height:50, zIndex:-1  }}></View> 
        )
    }

    //——————— DETECTION PROCESSES ---------

    function CancerSection(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
                <View style={styles.FlatTitleStyle}>
                    <Text style={styles.FlatTitleStyleText}>AI Vision</Text>
                </View>
                <View style={styles.FlatlistStyle}>
                    {CancerDetectionData.map((data) => (
                        <DetectionBox item={data} />
                    ))}
                </View>
            </View>
        )
    }

    function OverallHealthSection(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
                <View style={styles.FlatTitleStyle}>
                    <Text style={styles.FlatTitleStyleText}>Overall Health</Text>
                </View>
                <View style={styles.FlatlistStyle}>
                    {OverallHealthData.map((data) => (
                        <DetectionBox item={data} />
                    ))}
                </View>
            </View>
        )
    }

    function DetectionBox({
        item
    }){
        return(
            <Pressable onPress={() => handleNavigation(item.id)} key={item.id} style={item.state == "soon" ? styles.DetBoxSoon : styles.DetBox }>
                <View    style={{padding:10,borderWidth:0,borderRadius:25,backgroundColor:"white"}}>
                    <FontAwesome6 name={item.icon} size={24} color="black" />
                </View>
                <View>
                    <Text style={{marginLeft:10,fontWeight:600}} >{item.title}</Text>
                    <Text style={{marginLeft:10,fontWeight:300,fontSize:10,maxWidth:"90%",marginTop:3}} >{item.desc}</Text>
                </View>
            </Pressable> 
        )
    }

    //——————— DIAGNOSIS ---------

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


//<==================<[ Parent Components ]>====================> 

    function AiDiagnosis({sympthomInput}){
        return(
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


//<==================<[ Main Return ]>====================> 

    return(
        <View style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1,width:"100%" }}>
                <BottomSheetModalProvider>
                    <Horizontal_Navbar
                        setIsSelected={setHeaderSelect}
                        isSelected={headerSelect}
                        absolute={true}
                        options={[
                            {
                                title:"Melanoma Monitor",
                                value:"melanoma",
                            },
                            {
                                title:"Blood Work",
                                value:"blood_work",
                            },
                        ]}
                    />       
                    {/* {headerSelect == "melanoma" ? 
                        <ScrollView style={{width:"100%",backgroundColor:"white",height:"100%",paddingBottom:100,marginTop:100}}>
                            <View style={{width:"100%",backgroundColor:"white",height:"100%",paddingBottom:50}} >
                                {OverallHealthSection()}
                                {CancerSection()}
                            </View>                 
                        </ScrollView>
                        :
                        AiDiagnosis({sympthomInput})
                    } */}
                    <ExploreView 
                        navigation={navigation}
                    />

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

                </BottomSheetModalProvider>
            </GestureHandlerRootView >
        </View>
    )}


//<==================<[  Styles ]>====================> 

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        width:"100%",     
        alignItems:"center"
    },
    FlatlistStyle:{
        width:"100%",
        alignItems:"center"
    },
    FlatTitleStyle:{
        width:"100%",
        margin:10
    },
    FlatTitleStyleText:{
        fontWeight:"600",
        fontSize:20,
        margin:5,
        marginTop:20,
        marginLeft:20
    },  
    DetBox:{
        borderWidth:1,
        width:"90%",
        flexDirection:"row",
        alignItems:"center",
        margin:6,
        padding:10,
        borderRadius:10,
        backgroundColor:"lightgray",
        borderColor:"gray"
    },
    DetBoxSoon:{
        opacity:0.3,
        borderWidth:1,
        width:"90%",
        flexDirection:"row",
        alignItems:"center",
        margin:6,
        padding:10,
        borderRadius:10,
        backgroundColor:"lightgray",
        borderColor:"gray"
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
        marginTop:70,
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
        width:"80%",
        marginTop:30,
        borderRadius:50,
        padding:12,
        backgroundColor:"black",
        justifyContent:"center",
        borderColor:"white"
    },
    addInputContainerMental:{
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1,
        width:"80%",
        marginTop:20,
        borderRadius:50,
        padding:12,
        backgroundColor:"white",
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
    IndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        backgroundColor:"rgba(0,0,0,1)",
        padding:15,    
        borderRadius:50,        
        marginTop:0,
        marginBottom:30
    },
    Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'white',
        borderRadius: 3,
        marginHorizontal: 5,
    },
});

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

export default AddDetection;





