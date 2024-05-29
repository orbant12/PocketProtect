import { View,Text,TouchableOpacity,StyleSheet,TextInput,ActivityIndicator,ScrollView, Pressable, Keyboard } from "react-native"
import React,{useEffect, useState,useRef} from "react"
import ProgressBar from 'react-native-progress/Bar';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "../../../context/UserAuthContext";
import { saveDiagnosisProgress } from "../../../server"
import {app} from "../../../firebase"

const SurveyScreeen = ({route,navigation}) => {

//<=============> VARIABLE <===============>

    const functions = getFunctions(app);
    const {currentuser} = useAuth()

    const [progress , setProgress] =useState(0)
    const [dataFixed , setDataFixed] = useState(route.params.data != undefined ? route.params.data : [{q:"",type:"binary"}] )
    const [memoryDataFixed, setMemoryDataFixed ] = useState([])
    const possibleOutcomes = route.params.outcomes
    const clientSymphtoms = route.params.clientSymptoms
    const [ answerInput, setAnswerInput ] = useState("")
    const diagnosisSnapPoints = ["86%"];
    const diagnoseSheetRef = useRef(null);
    const answerEditSheetRef = useRef(null);

    const [ fullDiagnosis, setFullDiagnosis] = useState({diagnosis:"Not yet"})
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
    
    const  generateDiagnosisFromPrompt = async (request) => {
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
    
    const handleBinaryAnswer = (index, type) => {
        setDataFixed(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], a: type };
            return newData;
        });
    };
    
    const handleTextAnswer = async (index) => {
        setDataFixed(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], a: answerInput };
            return newData;
        });
        setProgress(progress + 1)
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

        const data = {
            id: session.id,
            title: session.title,
            diagnosis: fullDiagnosis.diagnosis,
            clientSymphtoms: clientSymphtoms,
            possibleOutcomes: possibleOutcomes,
            stages:{
                stage_one:dataFixed,
                stage_two:null,
                stage_three:null,
                stage_four:null, 
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


//<===========> Feature Engineering <===========>
    
    //<-----> Stage 1 <---------->
    const ProcessSingleDiagnosis = async () => {
        const type = "diagnosis"
        const sympthomsPrompt = `Possible causes: ${possibleOutcomes}`;
        const binaryFeedback = dataFixed.map(item => {
                return item.q + ", " + item.a + '\n';
        });
        console.log(binaryFeedback)
        const prompt = `Recently I'v asked you to create a survey from which you can confidently decide which of these causes is the most likely. ${sympthomsPrompt}.This is the survey: ${binaryFeedback} . Please choose from the Possible Causes, your answer MUST only contain that one likely cause as a word.`;
        const response = await generateDiagnosisFromPrompt(prompt)
        setFullDiagnosis(prevState => ({
        ...prevState,
        [type]: response
        }));
        return response
    }

    const ProcessRediagnosis = async () => {
        const type = "diagnosis"
        const sympthomsPrompt = `Possible causes: ${possibleOutcomes}`;
        const binaryFeedback = dataFixed.map(item => {
                return item.q + ", " + item.a + '\n';
        });
        console.log(binaryFeedback)
        const prompt = `Recently I'v asked you to create a survey from which you can confidently decide which of these causes is the most likely. ${sympthomsPrompt}.This is the survey: ${binaryFeedback} . Please choose from the Possible Causes, you cannot choose ${fullDiagnosis.diagnosis}, your answer MUST only contain that one likely cause as a word.`;
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
        const prompt = `Can list out all common symphtoms of ${diagnosis}. Be straight forward and you MUST only state the symphtoms by ascending numbered order.`;
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
    
    const handleStartDiagnosis = async (potentialDiagnosis) => {
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
        if (editedtTracker == true){
            try{
                if(potentialDiagnosis != "Not yet"){                  
                    const diagnosis = potentialDiagnosis                    
                    await ProcessDiagnosisDescription(diagnosis)
                    await ProcessDiagnosisSymphtoms(diagnosis)  
                    await ProcessDiagnosisRecovery(diagnosis)                  
                } else {
                    const diagnosis = await ProcessSingleDiagnosis()                    
                    await ProcessDiagnosisDescription(diagnosis)
                    await ProcessDiagnosisSymphtoms(diagnosis) 
                    await ProcessDiagnosisRecovery(diagnosis)                   
                }
                // If data is not edited it stays only --> openEditSheet() can change it
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
                const diagnosis = await ProcessRediagnosis()
                await ProcessHelpForDiagnosis(diagnosis)
                await ProcessDiagnosisDescription(diagnosis)
                await ProcessDiagnosisSymphtoms(diagnosis)
                await ProcessDiagnosisRecovery(diagnosis)                
                // If data is not edited it stays only --> openEditSheet() can change it
                setEditedTracker(false)
                }
            catch (error) {
                alert(`Something went wrong ${error}`)
            }
        setIsDiagnosDone(true)
    }
    
    //<------> Stage 2 <------->     
    const handleNextStage = async(clientSymphtoms,possibleOutcomes) => {
        setSession({
            ...session,
            stage:2
        })
        setIsDiagnosDone(false)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        const data = {
            id: session.id,
            title: session.title,
            diagnosis: fullDiagnosis.diagnosis,
            clientSymphtoms: clientSymphtoms,
            possibleOutcomes: possibleOutcomes,
            stages:{
                stage_one:dataFixed,
                stage_two:null,
                stage_three:null,
                stage_four:null, 
            },
            created_at: formattedDate,
        }
        await saveDiagnosisProgress({
            userId:currentuser.uid,
            data
        })
        handleStartSurvey()
    }
    
    const ProcessCreateSurvey= async (causes) => {    
    const binaryFeedback = dataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const sympthomsPrompt = `Previous client answers: ${binaryFeedback}`;
    const diagnosisScript = `Diagnosis we want to determine wether probable or not: ${fullDiagnosis.diagnosis}`;    
    const prompt = `${sympthomsPrompt}.${diagnosisScript}. You are a doctor trying to evaluate the hypothesis that your patient has ${fullDiagnosis.diagnosis}. Create a survey with questions that is formed to actively test the possibility of this hipothesys and evaluate it's chance dont include questions that have been asked. Servey must only contain forms of these: yes or no (qid:binary), client feedback required (qid:feedback). Your answer must be only contain the survey and each question asked like this:
    binary,Have you ...? \n
    feedback,Please describe ... \n `;
    const response = await generateDiagnosisFromPrompt(prompt)

    const formattedData = response.split('\n').map(line => {
        const [type, question] = line.split(',');    
        return { type, q: question };
    });    

    const filtered = await formattedData.filter(item => item.q !== undefined);

    return filtered
    }
    //<------> Stage 2 <------->     
    const handleNextStageThree = async(clientSymphtoms,possibleOutcomes) => {
        setSession({
            ...session,
            stage:3
        })
        setIsDiagnosDone(false)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        const data = {
            id: session.id,
            title: session.title,
            diagnosis: fullDiagnosis.diagnosis,
            clientSymphtoms: clientSymphtoms,
            possibleOutcomes: possibleOutcomes,    
            stages:{
                stage_one:memoryDataFixed,
                stage_two:{survey:dataFixed,chance:fullDiagnosis.chance},
                stage_three:{assistance_frequency:fullDiagnosis.periodic_assistance},
                stage_four:null, 
            },
            created_at: formattedDate,
        }
        await saveDiagnosisProgress({
            userId:currentuser.uid,
            data
        })
        setIsDiagnosDone(true)
        navigation.navigate("DiagnosisCenter",{diagnosisData:data})
    }

    const ProcessChanceOfDiagnosis = async (diagnosis) => {
        const type = "chance"
        const binaryFeedback = memoryDataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
        });
        const binaryFeedback2 = dataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
        });
        const sympthomsPrompt = `Previous client answers: Stage 1:${binaryFeedback}, Stage 2: ${binaryFeedback2}`;
        const diagnosisScript = `Diagnosis we want to evaluate the chance of: ${fullDiagnosis.diagnosis}`;    
        const prompt = `You are a prediction device predicting chance of diases being present by client feed back. Your client has ${fullDiagnosis.diagnosis}.${sympthomsPrompt}.${diagnosisScript}. Your answer MUST be a percentage only !`;
        const response = await generateDiagnosisFromPrompt(prompt)
        setFullDiagnosis(prevState => ({
        ...prevState,
        [type]: response
        }));
        return response
    }

    const ProcessFutureAssistanceDiagnosis = async (diagnosis) => {   
        const type = "periodic_assistance"
        const binaryFeedback = memoryDataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
        });
        const binaryFeedback2 = dataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
        });
        const sympthomsPrompt = `Previous client answers: Stage 1:${binaryFeedback}, Stage 2: ${binaryFeedback2}`;
        const diagnosisScript = `Diagnosis of the client: ${fullDiagnosis.diagnosis}`;    
        const prompt = `${diagnosisScript}.${sympthomsPrompt}. If you could gather information from this patient what frequency of interogation sessions be valuable from a data gathering to medicate this patient stand point: DAILY or if < WEEKLY or if < EVERY X DAYS or if < MONTHLY is enough. Your answers MUST only be either "Daily" if you thing daily sessions recommended or "Weekly" if weekly enough or "Every x days" if its more then weekly but less then monthly or "Monthly" if monthly is enough !`;
        const response = await generateDiagnosisFromPrompt(prompt)
        setFullDiagnosis(prevState => ({
        ...prevState,
        [type]: response
        }));
        return response
    }
    
    const handleStartSurvey = async () => {    
        const survey = await ProcessCreateSurvey()
        if (survey) {
            setMemoryDataFixed(dataFixed)
            setDataFixed(survey)        
            setIsDiagnosDone(true)
            setProgress(0)
            setEditedTracker(true)
            diagnoseSheetRef.current.close()
        }
    }

    const handleStartDiagnosis2 = async (potentialDiagnosis) => {
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
        if (editedtTracker == true){
            try{
                if(potentialDiagnosis != "Not yet"){                  
                    const diagnosis = potentialDiagnosis
                    await ProcessHelpForDiagnosis(diagnosis)
                    await ProcessFutureAssistanceDiagnosis(diagnosis)
                    await ProcessDiagnosisDescription(diagnosis)
                    await ProcessDiagnosisSymphtoms(diagnosis)
                    await ProcessDiagnosisRecovery(diagnosis)
                } else {
                    const diagnosis = fullDiagnosis.diagnosis
                    await ProcessChanceOfDiagnosis(diagnosis)
                    await ProcessFutureAssistanceDiagnosis(diagnosis)
                    await ProcessHelpForDiagnosis(diagnosis)
                    await ProcessDiagnosisDescription(diagnosis)
                    await ProcessDiagnosisSymphtoms(diagnosis)
                    await ProcessDiagnosisRecovery(diagnosis)
                }
                // If data is not edited it stays only --> openEditSheet() can change it
                setEditedTracker(false)
                }
            catch (error) {
                alert(`Something went wrong ${error}`)
            }
        } else if (editedtTracker == false){

        }  
        setIsDiagnosDone(true)
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
                            {/* <TextInput
                                style={{width:"80%",borderWidth:0.3,padding:10,alignItems:"center",textAlign:"center",borderRadius:30}}
                                onChangeText={(e) => setSession({
                                    ...session,
                                    title: e
                                })}
                                value={session.title}
                            />      */}
                        </View> 
                        <ScrollView style={{width:"100%"}}>                                       
                                <Text style={{fontWeight:"600",marginTop:20}}>Diagnosis: <Text style={{opacity:0.6}}>{fullDiagnosis.diagnosis}</Text></Text>
                                <Text style={{fontWeight:"600",marginTop:20}}>Potential causes: <Text style={{opacity:0.6}}>{possibleOutcomes}</Text></Text>
                                <Text style={{fontWeight:"600",marginTop:20}}>Client Report: <Text style={{opacity:0.6}}>{clientSymphtoms}</Text></Text>
                                <View style={{width:"100%",alignItems:"center",borderTopWidth:5,marginTop:20}}>
                                    <Text style={{fontWeight:"700",fontSize:18,marginTop:15}}>Progress</Text>
                                {dataFixed.map((data)=>(
                                    <View style={{width:"90%",borderWidth:1,marginTop:15,padding:20,height:150,justifyContent:"center",borderRadius:10}}>        
                                        <Text style={{fontWeight:"700"}}>Question: <Text style={{fontWeight:"700",opacity:0.6}}>{data.q}</Text></Text>                        
                                        <Text style={{fontWeight:"700",marginTop:20}}>Your Answer: <Text style={{fontWeight:"700",opacity:0.6}}>{data.a == undefined ? "None" : data.a}</Text></Text>
                                    </View>
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
            fullDiagnosis.description &&            
            <ScrollView style={{width:"100%",height:"100%"}} showsVerticalScrollIndicator={false}>
            <View style={Dstyles.diagnosisPage}>

                <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
                <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.diagnosis}</Text>
                <View style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",marginTop:10,borderLeftWidth:2,borderColor:"black"}}>
                    <Text style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",paddingLeft:10}}>{fullDiagnosis.description}</Text>
                </View>
                </View>              
                <View style={{width:"100%",marginTop:0,borderWidth:0,paddingBottom:30,alignItems:"center"}}>
                <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:17,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
                <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
                {fullDiagnosis.symphtoms.map((data)=>(
                    <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                    <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                    <Text style={{padding:0,fontWeight:600,marginTop:20,textAlign:"center"}}>{data.content}</Text>
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
                    <Text style={{padding:0,fontWeight:600,marginTop:20,textAlign:"center"}}>{data.content}</Text>
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
            </ScrollView>}

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
                    <Text style={[{fontSize:16,fontWeight:700},{color:"black",opacity:0.8}]}>Chance</Text>
                </View>

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
                                <Text style={{fontWeight:"700",fontSize:"20",width:"100%",textAlign:"center"}}>{dataFixed[progress].q}</Text>
                            </View>                         
                            {dataFixed[progress].type == "binary" ?
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
                                <TextInput
                                    onChangeText={(e) => setAnswerInput(e)}
                                    placeholder="Type your answer here"
                                    value={answerInput}
                                    style={{width:"80%",borderWidth:1,padding:12,borderRadius:10,marginBottom:30,height:60}}
                                />
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => {handleTextAnswer(progress);setProgress(progress + 1);setAnswerInput("")}}>
                                    <Text style={{color:"black",fontWeight:"600"}}>Done</Text>
                                </TouchableOpacity>
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
                        <Text style={{fontSize:20,fontWeight:"800",marginBottom:50,marginTop:80}}>Nice ! We are all done and ready to create your diagnosis ...</Text>
                        <TouchableOpacity onPress={() => {session.stage == 1 ? handleStartDiagnosis(route.params.isDone) : handleStartDiagnosis2(route.params.isDone)}} style={{borderRadius:10,borderWidth:1,padding:10,width:150,alignItems:"center",backgroundColor:"black"}}>
                            <Text style={{color:"white",fontWeight:"600"}}>Start Diagnosis</Text>
                        </TouchableOpacity>
                        <View style={{width:"100%",height:100,backgroundColor:"black",alignItems:"center",justifyContent:"center",marginTop:40}}>
                            <Text style={{color:"white",opacity:0.4,fontWeight:"500",fontSize:13}}>Feel free to edit them !</Text>
                            <Text style={{color:"white",opacity:0.8,fontWeight:"700",fontSize:18}}>Your Answers</Text>
                        </View>
                        {dataFixed.map((data,index) => (
                            <View style={{width:"90%",borderWidth:1,marginTop:30,padding:20,height:150,justifyContent:"center",borderRadius:10}}>
                                <MaterialCommunityIcons 
                                    name="pencil"
                                    size={20}
                                    onPress={() => openEditSheet(index)}
                                    style={{position:"absolute",right:0,bottom:0,padding:8,borderWidth:0.3,borderRadius:8}}
                                />
                                <Text style={{fontWeight:"700"}}>Question: <Text style={{fontWeight:"700",opacity:0.6}}>{data.q}</Text></Text>                        
                                <Text style={{fontWeight:"700",marginTop:20}}>Your Answer: <Text style={{fontWeight:"700",opacity:0.6}}>{data.a}</Text></Text>
                            </View>
                        ))}               
                    </View>
                    </ScrollView>
                    }
                    <BottomSheetModal
                        ref={answerEditSheetRef}
                        snapPoints={diagnosisSnapPoints}
                        enablePanDownToClose={true}                    
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
                            onPress={() => answerEditSheetRef.current.close()}
                            />
                        </View>
                    }
                    >
                    <View style={styles.container}>
                    <Text style={{fontWeight:"700",fontSize:"20",marginTop:100,width:"90%",textAlign:"center"}}>{dataFixed[indexToEdit].q}</Text>
                            {dataFixed[indexToEdit].type == "binary" ?
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
                                    style={{width:"60%",borderWidth:1,padding:12,borderRadius:10,marginBottom:30}}
                                />
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => handleTextAnswer(indexToEdit)}>
                                    <Text style={{color:"black",fontWeight:"600"}}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            }
                            <Text style={{marginTop:50,fontWeight:"600"}}>Your Current Answer: {dataFixed[indexToEdit].a}</Text>
                    </View>
                    </BottomSheetModal>
                    
                    <BottomSheetModal
                        ref={diagnoseSheetRef}
                        snapPoints={diagnosisSnapPoints}
                        enablePanDownToClose={true}
                        onDismiss={() => {handleCloseDiagnosis}}
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
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