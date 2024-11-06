import { View,Text,TouchableOpacity,StyleSheet,TextInput,ActivityIndicator,ScrollView, Pressable, Keyboard } from "react-native"
import React,{useEffect, useState,useRef} from "react"
import ProgressBar from 'react-native-progress/Bar';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from "../../../context/UserAuthContext";
import { saveDiagnosisProgress } from "../../../services/server"
import { getDiagnosisData,getDiagnosis, getReDiagnosis, getSurvey } from "../../../services/prompt"
import { AI_InpitField, Diag_InpitField } from "../../Chat/components/ai_chat/chatInputField";
import { DiagnosisData, DiagnosisResultType, PromptEngineering_Feedback_Type } from "../../../utils/types";
import { Navigation_Diag_Center } from "../../../navigation/navigation";

const SurveyScreeen = ({route,navigation}) => {




  
//<=============> VARIABLE <===============>

    const {currentuser} = useAuth()

    const [progress , setProgress] =useState(0)
    const [dataFixed , setDataFixed] = useState<{type:string,q:string,a?:string}[]>(route.params.surveyData != undefined ? route.params.surveyData : [{q:"",type:"binary"}] )
    const [memoryDiagnosis, setMemoryDiagnosis ] = useState<DiagnosisResultType>({diagnosis:"Not yet"})
    const [memoryDataFixed, setMemoryDataFixed ] = useState<{type:string,q:string,a?:string}[]>([{q:"",type:"binary"}])

    const possibleOutcomes: string = route.params.possibleOutcomes
    const clientSymphtoms: string = route.params.clientSymptoms
    const [ answerInput, setAnswerInput ] = useState("")
    const diagnosisSnapPoints = ["86%"];
    const diagnoseSheetRef = useRef(null);
    const answerEditSheetRef = useRef(null);

    const [ fullDiagnosis, setFullDiagnosis] = useState<DiagnosisResultType | {diagnosis:"Not yet"}>({diagnosis:"Not yet"})
    const [ isDiagnosisDone, setIsDiagnosDone] = useState(false)

    const [ indexToEdit, setIndexToEdit] = useState(0)
    // KEEP TRACK OF EDIT MADE TO THE SURVEY --> Less API call to OpenAi
    const [ editedtTracker , setEditedTracker] = useState(true)

    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)
    const [ saveCardModalActive, setSaveCardModalActive] = useState(false)

    const sessionId = generateHexUID(8)
    const [ session , setSession ] = useState({
        stage:1,
        title:`session#${sessionId}`,
        id:`session#${sessionId}`
    })


//<============> FUNCTIONS <===============>
    
    const handleBinaryAnswer = (index, type) => {
        setDataFixed(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], a: type };
            return newData;
        });
    };
    
    const handleTextAnswer = async (index,text) => {
        setDataFixed(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], a: text };
            return newData;
        });
    };
    
    const handleCloseDiagnosis = () => {
        setSaveCardModalActive(!saveCardModalActive)
    }
    
    const openEditSheet = (index) => {
        answerEditSheetRef.current.present()
        setIndexToEdit(index)
        //For less API call to OpenAI
        setEditedTracker(true)
    }
    
    const handleBack = (permission) => {
        if (progress == 0 || permission == true){
            navigation.goBack()
        } else {
            setProgress(progress - 1)
        }
    }
    
    const handleSaveProgress = async (clientSymphtoms,possibleOutcomes) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;

        const data: DiagnosisData = {
            id: session.id,
            title: session.title,
            diagnosis: fullDiagnosis.diagnosis,
            clientSymphtoms: clientSymphtoms,
            possibleOutcomes: possibleOutcomes,
            stages:{
                stage_one:fullDiagnosis,
                stage_two:null,
            },
            created_at: formattedDate,
        }
        const result = await saveDiagnosisProgress({userId:currentuser.uid,data})
        if (result == true){
            alert("Your progress saved sucessfully !")
            navigation.goBack()
        }
    }
    
    function generateHexUID(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 16).toString(16);
        }
        return result;
    }

    const dateFormat = (days) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + days);  // Add the specified number of days    
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate)
        return formattedDate;
    }
    
    useEffect(() =>{
        setDataFixed(prevData => prevData.filter(item => item.q !== undefined));
        // First Load it must call Openai
        setEditedTracker(true)
        if(route.params.isDone != "Not yet"){
            setProgress(dataFixed.length)
            setFullDiagnosis({
                ...fullDiagnosis,
                diagnosis: route.params.isDone
            })
            handleStartDiagnosis(route.params.isDone)
        }
    },[])


//<===========> STAGES <===========>
    
    const handleStartDiagnosis = async (potentialDiagnosis:any | "Not yet") => {
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
        if (editedtTracker == true){
            try{
                if(potentialDiagnosis != "Not yet"){                  
                    const diagnosis = potentialDiagnosis                    
                    const diagnosisData = await getDiagnosisData({
                        diagnosis:diagnosis,
                        stage:1
                    })
                    if ( diagnosisData != false ){
                        diagnosisData.map((data:any) => {
                            setFullDiagnosis(prevState => ({
                                ...prevState,
                                ...data
                                }));
                        })                                    
                    }                                
                } else {
                    const diagnosis = await getDiagnosis({possibleOutcomes,dataFixed})                        
                    const diagnosisData = await getDiagnosisData({
                        diagnosis:diagnosis,
                        stage:1
                    })
                    if ( diagnosisData != false ){
                        diagnosisData.map((data:any) => {
                            setFullDiagnosis(prevState => ({
                                ...prevState,
                                ...data
                                }));
                        })   
                        setFullDiagnosis(prevState => ({
                            ...prevState,
                            diagnosis:diagnosis
                            }));                             
                    }   
                }                
                setEditedTracker(false)
                }
            catch (error) {
                alert(`Something went wrong ${error}`)
            }
        } else if (editedtTracker == false){

        }  
        setIsDiagnosDone(true)
    }

    const handleStartRediagnosis = async () => {
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
    
            try{
                const preDiagnosis = fullDiagnosis.diagnosis
                const diagnosis = await getReDiagnosis({possibleOutcomes,dataFixed,preDiagnosis})
                const diagnosisData = await getDiagnosisData({diagnosis:diagnosis,stage:1}) 
                if ( diagnosisData != false ){
                    diagnosisData.map((data:any) => {
                        setFullDiagnosis(prevState => ({
                            ...prevState,
                            ...data
                            }));
                        setFullDiagnosis(prevState => ({
                            ...prevState,
                            diagnosis:diagnosis
                            }));
                    })                                    
                }                 
                // If data is not edited it stays only --> openEditSheet() can change it
                setEditedTracker(false)
                }
            catch (error) {
                alert(`Something went wrong ${error}`)
            }
        setIsDiagnosDone(true)
    }

    const handleNextStage = async(clientSymphtoms,possibleOutcomes) => {
        setSession({
            ...session,
            stage:2
        })
        setIsDiagnosDone(false)
        const createdAt = dateFormat(0)
        const data: DiagnosisData = {
            id: session.id,
            title: session.title,
            diagnosis: fullDiagnosis.diagnosis,
            clientSymphtoms: clientSymphtoms,
            possibleOutcomes: possibleOutcomes,
            stages:{
                stage_one:fullDiagnosis,
                stage_two:null, 
            },
            created_at: createdAt,
        }
        await saveDiagnosisProgress({
            userId:currentuser.uid,
            data
        })
        const survey = await getSurvey({dataFixed,fullDiagnosis})        
        if (survey != null) {
            setMemoryDataFixed(dataFixed)
            setMemoryDiagnosis(fullDiagnosis)
            setDataFixed(survey)    
            setEditedTracker(true)    
            setIsDiagnosDone(true)
            setProgress(0)
            setEditedTracker(true)
            diagnoseSheetRef.current.close()
        } else{
            alert("Something went wrong")
            setIsDiagnosDone(true)
        }
    }
    
    //<------> Stage 2 <------->     
    const handleStartDiagnosis2 = async (potentialDiagnosis) => {
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
        if (editedtTracker == true){
            try{
                if(potentialDiagnosis != "Not yet"){                  
                    const diagnosis = potentialDiagnosis
                    const stage2_diagnosisData = await getDiagnosisData({diagnosis,dataFixed,memoryDataFixed,stage:2})
                    if ( stage2_diagnosisData != false ){
                        stage2_diagnosisData.map((data:any) => {
                            setFullDiagnosis(prevState => ({
                                ...prevState,
                                ...data
                                }));                         
                            })      
                            setIsDiagnosDone(true)                                
                    }                 
                    
                } else {
                    const diagnosis = fullDiagnosis.diagnosis
                    const stage2_diagnosisData = await getDiagnosisData({diagnosis,dataFixed,memoryDataFixed,stage:2})
                    if ( stage2_diagnosisData != false ){
                        stage2_diagnosisData.map((data:any) => {
                            setFullDiagnosis(prevState => ({
                                ...prevState,
                                ...data
                                }));                         
                            })       
                        setIsDiagnosDone(true)                               
                    }      
                    

                }
                // If data is not edited it stays only --> openEditSheet() can change it
                setEditedTracker(false)
                }
            catch (error) {
                alert(`Something went wrong ${error}`)
                setIsDiagnosDone(true)
            }
        } else if (editedtTracker == false){
            setIsDiagnosDone(true)
        }  
       
    }
    
    //<------> Stage 3 <------->     
    const handleNextStageThree = async(clientSymphtoms,possibleOutcomes) => {
        setSession({
            ...session,
            stage:3
        })
        setIsDiagnosDone(false)
        const formattedDate = await dateFormat(0)
        if (fullDiagnosis.diagnosis != "Not yet"){
            const data:DiagnosisData = {
                id: session.id,
                title: session.title,
                diagnosis: fullDiagnosis.diagnosis,
                clientSymphtoms: clientSymphtoms,
                possibleOutcomes: possibleOutcomes,         
                stages:{
                    stage_one:memoryDiagnosis,
                    stage_two:fullDiagnosis,
                },
                created_at: formattedDate,
            }
            await saveDiagnosisProgress({
                userId:currentuser.uid,
                data
            })
            setIsDiagnosDone(true)
            Navigation_Diag_Center({diagnosisData:data,navigationType:"from_diagn",navigation:navigation})
        }
    }
    


//<===========> Child Components <===========>
    
    const ExitModal = ({isSaveModalActive}) => {
        return(
            <>
            {isSaveModalActive &&
                <View style={styles.modal}>
                    <View style={styles.modalCard}>
                        <Text style={{fontWeight:"700",fontSize:17,borderWidth:0,paddingTop:30}}>Your diagnosis progression is going to be lost. Do you want to save it ?</Text>
                        <View style={{width:"100%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                            <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => setIsSaveModalActive(!isSaveModalActive)}>
                                <Text style={{color:"white",fontWeight:"500"}}>Back to diagnosis</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() => {setSaveCardModalActive(!saveCardModalActive);setIsSaveModalActive(!isSaveModalActive)}}>
                                <Text style={{color:"black",fontWeight:"500"}}>Save</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity style={{backgroundColor:"red",padding:10,borderRadius:10,alignItems:"center",}} onPress={() => handleBack(true)}>
                                <Text style={{color:"white",fontWeight:"600"}}>Exit</Text>
                            </TouchableOpacity>                      
                        </View> 
                    </View>
                </View>
            }
            </>
        )
    }
    
    const SaveModal = ({dataFixed,session,saveCardModalActive}) => {
        return(
            <>
            {saveCardModalActive &&
                <View style={styles.modal}>
                    <View style={styles.modalSaveCard}>
                        <Text style={{fontWeight:"600",fontSize:13,position:"absolute",right:10,borderWidth:0,paddingTop:30,bottom:90,opacity:0.3}}>{session.id}</Text>
                        <View style={{width:"100%",alignItems:"center"}}>
                            <Text style={{fontWeight:"700",fontSize:20,marginBottom:10}}>Your Report</Text>
                        </View> 
                        <ScrollView style={{width:"100%"}}>                                       
                                <Text style={{fontWeight:"600",marginTop:20}}>Diagnosis: <Text style={{opacity:0.6}}>{fullDiagnosis.diagnosis}</Text></Text>
                                <Text style={{fontWeight:"600",marginTop:20}}>Potential causes: <Text style={{opacity:0.6}}>{possibleOutcomes}</Text></Text>
                                <Text style={{fontWeight:"600",marginTop:20}}>Client Report: <Text style={{opacity:0.6}}>{clientSymphtoms}</Text></Text>
                                <View style={{width:"100%",alignItems:"center",borderTopWidth:5,marginTop:20}}>
                                    <Text style={{fontWeight:"700",fontSize:18,marginTop:15}}>Progress</Text>
                                {dataFixed.map((data)=>(
                                    (data !== undefined) ? (
                                    <View style={{width:"90%",borderWidth:1,marginTop:15,padding:20,height:150,justifyContent:"center",borderRadius:10}}>        
                                        <Text style={{fontWeight:"700"}}>Question: <Text style={{fontWeight:"700",opacity:0.6}}>{data.q}</Text></Text>                        
                                        <Text style={{fontWeight:"700",marginTop:20}}>Your Answer: <Text style={{fontWeight:"700",opacity:0.6}}>{data.a == undefined ? "None" : data.a}</Text></Text>
                                    </View>
                                    ):(
                                        <></>
                                    )
                                ))}
                                </View>                                                
                        </ScrollView>
                        <View style={{width:"100%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                            <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => {setSaveCardModalActive(!saveCardModalActive)}}>
                                <Text style={{color:"white",fontWeight:"500"}}>Back to diagnos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() =>  handleSaveProgress(clientSymphtoms,possibleOutcomes)}>
                                <Text style={{color:"black",fontWeight:"500"}}>Save</Text>
                            </TouchableOpacity>                                    
                        </View> 
                    </View>
                </View>
            }
            </>
        )
    }
    
    const DiagnosisSheet = ({isDiagnosisDone,fullDiagnosis}) => {
        return(
            <>
            {!isDiagnosisDone ?
                <View style={styles.loadingModal}>
                    <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Processing your answers ...</Text>
                    <ActivityIndicator size="large" color="black" />
                </View>
            :
                    
            <ScrollView style={{width:"100%",height:"100%"}} showsVerticalScrollIndicator={false}>
            <View style={Dstyles.diagnosisPage}>

                <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
                <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.diagnosis}</Text>
                <View style={{marginTop:10,borderLeftWidth:2,borderColor:"black"}}>
                    <Text style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",paddingLeft:10}}>{fullDiagnosis.description}</Text>
                </View>
                </View>              
                <View style={{width:"100%",marginTop:0,borderWidth:0,paddingBottom:30,alignItems:"center"}}>
                <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:17,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
                <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
                {fullDiagnosis.symphtoms.map((data)=>(
                    <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                    <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                    <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
                    </View>
                ))}
                </ScrollView>
                </View>     

                <View style={{width:"100%",marginTop:2,borderTopWidth:3,paddingBottom:30,alignItems:"center",borderBottomWidth:0.3}}>
                <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:17,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
                <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
                {fullDiagnosis.symphtoms.map((data)=>(
                    <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                    <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                    <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
                    </View>
                ))}
                </ScrollView>
                </View>    

                <TouchableOpacity onPress={() => handleNextStage(clientSymphtoms,possibleOutcomes)} style={{width:"80%",height:50,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"black",marginTop:40}}>
                <Text style={{fontSize:15,fontWeight:"600",color:"white"}}>Next [ Stage 2 - Chance ]</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleStartRediagnosis()} style={{width:"80%",height:50,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"white",marginTop:20}}>
                <Text style={{fontSize:15,fontWeight:"500",color:"black"}}>Not possible [ Rediagnose ]</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSaveModalActive(!saveCardModalActive)} style={{width:"80%",height:50,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"red",marginTop:20}}>
                <Text style={{fontSize:15,fontWeight:"500",color:"white"}}>Close</Text>
                </TouchableOpacity>

            </View>
            </ScrollView>
            }
            </>
        )
    }
    
    const DiagnosisSheet2 = ({isDiagnosisDone,fullDiagnosis}) => {
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

                <View style={styles.scoreCircle}>
                    <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.chance}</Text>     
                    <Text style={[{fontSize:16,fontWeight:"700"},{color:"black",opacity:0.8}]}>Chance</Text>
                </View>

                <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
                <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.diagnosis}</Text>
                <View style={{marginTop:10,borderLeftWidth:2,borderColor:"black"}}>
                    <Text style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",paddingLeft:10}}>{fullDiagnosis.description}</Text>
                </View>
                </View> 

                <View style={{width:"100%",marginTop:0,borderWidth:2,paddingBottom:30,alignItems:"center"}}>
                <Text style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:20,padding:20}}>Advice</Text>
                <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
                {fullDiagnosis.help.map((data)=>(
                    <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                        <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                        <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
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
                    <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
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
                    <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
                    </View>
                ))}
                </ScrollView>
                </View>

                <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
                <Text style={{color:"back",fontSize:20,fontWeight:"800",textAlign:"center"}}><Text style={{fontSize:20, fontWeight:"500"}}>Recommended Assistance: </Text>{fullDiagnosis.periodic_assistance}</Text>       
                </View> 

                <TouchableOpacity onPress={() => handleNextStageThree(clientSymphtoms,possibleOutcomes)} style={{width:"80%",height:50,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"black",marginTop:40}}>
                <Text style={{fontSize:15,fontWeight:"500",color:"white"}}>Next ! [ Stage 3 - {fullDiagnosis.periodic_assistance}  ]</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsSaveModalActive(!isSaveModalActive)} style={{width:200,height:40,borderWidth:1,padding:10,marginLeft:"auto",marginRight:"auto",alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"red",marginTop:20}}>
                <Text style={{fontSize:15,fontWeight:"500",color:"white"}}>Close</Text>
                </TouchableOpacity>

            </View>
            </ScrollView>}

            </>
        )
    }


//<===========> Main Return <===========>
    
    return(
        <>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <View style={{width:"100%",height:"14%",justifyContent:"center",backgroundColor:"black",padding:20,alignItems:"center"}}>
                        <View style={{justifyContent:"center",borderWidth:0,borderColor:"white"}}>
                            <Text style={{fontWeight:"600",color:"white",fontSize:15,opacity:0.6,marginBottom:5,paddingTop:30}}>
                                {session.stage == 1 ? "Stage 1" : "Stage 2"}
                            </Text>

                            <Text style={{fontWeight:"700",color:"white",fontSize:20}}>
                            {session.stage == 1 ? "Most likely hypothesis" : "Chance evaluation"}
                            </Text>
                        </View>                                            
                    </View>
                    {ExitModal({isSaveModalActive})}
                    {SaveModal({saveCardModalActive,session,dataFixed})}
                    {progress != dataFixed.length ?        
                    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
                        <View style={styles.ProgressBar}>
                            <TouchableOpacity onPress={handleBack} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="arrow-left"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
        
                            <ProgressBar progress={progress / dataFixed.length} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                            <TouchableOpacity onPress={() => setIsSaveModalActive(!isSaveModalActive)} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="close"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
                        </View>
                            <Text style={{paddingVertical:10,paddingHorizontal:15,borderWidth:1,borderRadius:10,position:"absolute",right:10,top:65,opacity:0.3}}>{progress + 1} / {dataFixed.length}</Text>
                            <View style={{width:"90%",alignItems:"center",backgroundColor:"white",justifyContent:"center",marginTop:150,padding:20,borderRadius:20}}>
                                <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{dataFixed[progress] !== undefined ? dataFixed[progress].q : ""}</Text>
                            </View>                         
                            {(dataFixed[progress] !== undefined) && dataFixed[progress].type == "binary" ?
                            <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row"}}> 
                                <TouchableOpacity style={styles.btn}  onPress={() => {handleBinaryAnswer(progress,"yes");setProgress(progress + 1)}}>
                                    <Text style={{color:"white",fontWeight:"600",fontSize:17}}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => {handleBinaryAnswer(progress,"no");setProgress(progress + 1)}}>
                                    <Text style={{color:"black",fontWeight:"600",fontSize:17}}>No</Text>
                                </TouchableOpacity>
                            </View>
                            : 
                            <View style={{width:"100%",alignItems:"center"}}>
                                <Text style={{marginBottom:50,fontWeight:"600"}}>Your answer: <Text style={{fontWeight:"400"}}>{answerInput}</Text></Text>
                                <Diag_InpitField
                                    setInputValue={setAnswerInput}
                                    inputValue={answerInput}
                                    handleSend={() => {handleTextAnswer(progress);setProgress(progress + 1);setAnswerInput("")}}
                                />
                            </View>
                            }

                    </Pressable>
                    :
                    <ScrollView style={{width:"100%",height:"100%"}}>
                    <View style={styles.container}>                         
                    <View style={styles.ProgressBar}>
                            <TouchableOpacity onPress={handleBack} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="arrow-left"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
        
                            <ProgressBar progress={progress / dataFixed.length} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                            <TouchableOpacity onPress={() => setIsSaveModalActive(!isSaveModalActive)} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="close"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{padding:15,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,marginTop:80,marginBottom:50,width:"90%"}}>
                            <Text style={{fontSize:18,fontWeight:"700"}}>Nice ! We are all done and ready to create your diagnosis ...</Text>
                        </View>
                        <TouchableOpacity onPress={() => {session.stage == 1 ? handleStartDiagnosis(route.params.isDone) : handleStartDiagnosis2(route.params.isDone)}} style={{borderRadius:8,borderWidth:2,padding:20,width:"80%",alignItems:"center",backgroundColor:"black",borderColor:"magenta"}}>
                            <Text style={{fontWeight:"700",color:"white"}}>Start Diagnosis</Text>
                        </TouchableOpacity>
                        <View style={{width:"100%",height:80,backgroundColor:"black",alignItems:"center",justifyContent:"center",marginTop:40,borderBottomWidth:0.3,borderColor:"white"}}>
                            <Text style={{color:"white",opacity:0.4,fontWeight:"500",fontSize:13}}>Feel free to edit them !</Text>
                            <Text style={{color:"white",opacity:0.8,fontWeight:"700",fontSize:18}}>Your Answers</Text>
                        </View>
                        <View style={{backgroundColor:"black",width:"100%",alignItems:"center",paddingBottom:100}}>
                        {dataFixed.map((data,index) => (
                            (data !== undefined) ? (
                            <View style={{width:"90%",borderWidth:1,marginTop:30,padding:20,height:150,justifyContent:"center",borderRadius:10,borderColor:"magenta",backgroundColor:"rgba(250,0,250,0.3)"}}>
                                <MaterialCommunityIcons 
                                    name="pencil"
                                    size={20}
                                    onPress={() => openEditSheet(index)}
                                    color={"white"}
                                    style={{position:"absolute",right:0,bottom:0,padding:8,borderWidth:0.3,borderRadius:8,borderColor:"white"}}
                                />
                                <Text style={{fontWeight:"700",color:"white"}}>Question: <Text style={{fontWeight:"700",opacity:0.6,color:"white"}}>{data.q}</Text></Text>                        
                                <Text style={{fontWeight:"700",marginTop:20,color:"white"}}>Your Answer: <Text style={{fontWeight:"700",opacity:0.6,color:"white"}}>{data.a}</Text></Text>
                            </View>
                            ):(<></>)
                        ))}    
                        </View>           
                    </View>
                    </ScrollView>
                    }
                    <BottomSheetModal
                        ref={answerEditSheetRef}
                        snapPoints={diagnosisSnapPoints}
                        enablePanDownToClose={true}                    
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30}}
                        handleIndicatorStyle={{backgroundColor:"white"}}
                        handleComponent={() => 
                        <View style={{width:"100%",height:50,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
                            <View style={{borderWidth:1,borderColor:"white",width:30}} />        
                            <MaterialCommunityIcons 
                            name='close'
                            color={"white"}
                            size={20}
                            style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
                            onPress={() => answerEditSheetRef.current.close()}
                            />
                        </View>
                    }
                    >
                    <View style={styles.container}>
                        <View style={{marginTop:"20%",width:"90%",backgroundColor:"rgba(0,0,0,0.1)",padding:20,borderRadius:10}}>
                            <Text style={{fontWeight:"700",fontSize:20,textAlign:"center"}}>{dataFixed[indexToEdit] !== undefined ? dataFixed[indexToEdit].q : ""}</Text>
                        </View>
                    
                            {(dataFixed[indexToEdit] !== undefined) && dataFixed[indexToEdit].type == "binary" ?
                            <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row"}}> 
                                <TouchableOpacity style={styles.btn}  onPress={() => handleBinaryAnswer(indexToEdit,"yes")}>
                                    <Text style={{color:"white",fontWeight:"600"}}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => handleBinaryAnswer(indexToEdit,"no")}>
                                    <Text style={{color:"black",fontWeight:"600"}}>No</Text>
                                </TouchableOpacity>
                            </View>
                            : 
                            <View style={{width:"100%",alignItems:"center"}}>
                                <Text style={{marginBottom:50,fontWeight:"600"}}>Your answer: <Text style={{fontWeight:"400"}}>{answerInput}</Text></Text>
                                <TextInput
                                    onChangeText={(e) => setAnswerInput(e)}
                                    placeholder="Type your answer here"
                                    value={answerInput}
                                    placeholderTextColor={"white"}
                                    style={{width:"80%",borderWidth:3,padding:18,borderRadius:5,marginBottom:30,backgroundColor:"black",color:"white",borderColor:"magenta"}}
                                />
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"black",borderWidth:2,borderColor:"magenta"}]} onPress={() => handleTextAnswer(indexToEdit,answerInput)}>
                                    <Text style={{color:"white",fontWeight:"600"}}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            }
                            <View style={{padding:13,backgroundColor:"black",marginTop:50,borderRadius:10,paddingHorizontal:20,opacity:0.9}}>
                                <Text style={{fontWeight:"600",color:"white"}}>Your Current Answer: <Text style={{color:"magenta"}}>{dataFixed[indexToEdit].a}</Text></Text>
                            </View>
                            
                    </View>
                    </BottomSheetModal>
                    
                    <BottomSheetModal
                        ref={diagnoseSheetRef}
                        snapPoints={diagnosisSnapPoints}
                        enablePanDownToClose={true}
                        onDismiss={() => {handleCloseDiagnosis}}
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30}}
                        handleIndicatorStyle={{backgroundColor:"white"}}
                        handleComponent={() => 
                        <View style={{width:"100%",height:50,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
                            <View style={{borderWidth:1,borderColor:"white",width:30}} />   
                            <Text style={{color:"white",opacity:0.5,fontWeight:"600",marginTop:8,fontSize:13}}>Swipe down to edit</Text>     
                            <MaterialCommunityIcons 
                            name='close'
                            color={"white"}
                            size={20}
                            style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
                            onPress={() => {setIsSaveModalActive(!isSaveModalActive)}}
                            />
                        </View>
                    }
                    >
                    {session.stage == 1 ?
                    DiagnosisSheet({
                        isDiagnosisDone,fullDiagnosis
                    })
                    :
                    DiagnosisSheet2({
                        isDiagnosisDone,fullDiagnosis
                    })
                    }
                    </BottomSheetModal>
                </BottomSheetModalProvider>
            </GestureHandlerRootView >
        </>
    )
}


//<===========> Style Sheet <==============>

const styles = StyleSheet.create({
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    container:{
        alignItems:"center",
        width:"100%",
        height:"80%",
        justifyContent:"space-between",
    },
    btn:{
        padding:10,
        borderWidth:1,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:150,
        height:50,    
        alignItems:"center"
    },
    loadingModal:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0)",
        paddingBottom:10
    },
    modal:{
        width:"100%",
        height:"100%",
        zIndex:10
,        backgroundColor:"rgba(0,0,0,0.85)",
        justifyContent:"center",
        alignItems:"center",
        position:"absolute"
    },
    modalCard:{
        width:330,
        height:200,
        backgroundColor:"white",
        marginBottom:50,
        borderRadius:20,
        justifyContent:"space-between",
        alignItems:"center",
        padding:15
    },
    modalSaveCard:{
        width:330,
        height:"80%",
        backgroundColor:"white",
        marginBottom:50,
        borderRadius:20,
        justifyContent:"space-between",
        alignItems:"center",
        padding:15
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'black',
        marginTop: 20,
        borderStyle: 'dashed',
    },
})

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


export default SurveyScreeen