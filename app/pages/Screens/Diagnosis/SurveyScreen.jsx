import { View,Text,TouchableOpacity,StyleSheet,TextInput,ActivityIndicator,ScrollView } from "react-native"
import React,{useEffect, useState,useRef} from "react"
import ProgressBar from 'react-native-progress/Bar';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../../firebase"

const SurveyScreeen = ({route,navigation}) => {

    const functions = getFunctions(app);

    const [progress , setProgress] =useState(0)
    const [dataFixed , setDataFixed] = useState(route.params.data)
    const numberOfQuestions = dataFixed.length
    const possibleOutcomes = route.params.outcomes
    const [ answerInput, setAnswerInput ] = useState("")
    const diagnosisSnapPoints = ["100%"];
    const diagnoseSheetRef = useRef(null);
    const answerEditSheetRef = useRef(null);

    const [ fullDiagnosis, setFullDiagnosis] = useState({})
    const [ isDiagnosisDone, setIsDiagnosDone] = useState(false)

    const [ indexToEdit, setIndexToEdit] = useState(0)
    // KEEP TRACK OF EDIT MADE TO THE SURVEY --> Less API call to OpenAi
    const [ editedtTracker , setEditedTracker] = useState(false)

    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)


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

    useEffect(() =>{
        setDataFixed(prevData => prevData.filter(item => item.q !== undefined));
        // First Load it must call Openai
        setEditedTracker(true)
    },[])


    //<=======> Feature Engineering <=======>

    const ProcessSingleDiagnosis = async () => {
        const type = "diagnosis"
        const sympthomsPrompt = `Possible causes: ${possibleOutcomes}`;
        const binaryFeedback = dataFixed.map(item => {
                return item.q + ", " + item.a + '\n';
        });
        console.log(binaryFeedback)
        const prompt = `Recently I'v asked you to create a survey from which you can confidently decide which of these causes is the most likely. ${sympthomsPrompt}.This is the survey: ${binaryFeedback} . Please choose from the Possible Causes, your answer must only contain that one likely cause.`;
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
        diagnoseSheetRef.current.present()
        setIsDiagnosDone(false)
        if (editedtTracker == true){
            try{
                const diagnosis = await ProcessSingleDiagnosis()
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
        } else if (editedtTracker == false){

        }
  
        setIsDiagnosDone(true)
    }

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
    

    const handleAccurateDiagnosis = () => {

    }

    const handleCloseDiagnosis = () => {

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
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() => setIsSaveModalActive(!isSaveModalActive)}>
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

    return(
        <>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    {ExitModal({isSaveModalActive})}
                    {progress != numberOfQuestions ?
                    <View style={styles.container}>
                        <View style={styles.ProgressBar}>
                            <TouchableOpacity onPress={handleBack} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="arrow-left"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
        
                            <ProgressBar progress={progress / numberOfQuestions} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                            <TouchableOpacity onPress={() => setIsSaveModalActive(!isSaveModalActive)} style={{backgroundColor:"white",borderRadius:30}}>
                                <MaterialCommunityIcons 
                                    name="close"
                                    size={20}
                                    style={{padding:5}}
                                />
                            </TouchableOpacity>
                        </View>
                            <Text style={{paddingVertical:10,paddingHorizontal:15,borderWidth:1,borderRadius:10,position:"absolute",right:10,top:60}}>{progress + 1} / {numberOfQuestions}</Text>
                            <View style={{width:"90%",alignItems:"center",backgroundColor:"white",justifyContent:"center",marginBottom:100,padding:20,borderRadius:20}}>
                                <Text style={{fontWeight:"700",fontSize:"20",width:"100%",textAlign:"center"}}>{dataFixed[progress].q}</Text>
                            </View>                         
                            {dataFixed[progress].type == "binary" ?
                            <View style={{width:"75%",justifyContent:"space-between",flexDirection:"row"}}> 
                                <TouchableOpacity style={styles.btn}  onPress={() => {handleBinaryAnswer(progress,"yes");setProgress(progress + 1)}}>
                                    <Text style={{color:"white",fontWeight:"600"}}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => {handleBinaryAnswer(progress,"no");setProgress(progress + 1)}}>
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
                                <TouchableOpacity style={[styles.btn,{backgroundColor:"white"}]} onPress={() => {handleTextAnswer(progress);setProgress(progress + 1)}}>
                                    <Text style={{color:"black",fontWeight:"600"}}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            }

                    </View>
                    :
                    <ScrollView style={{width:"100%",height:"100%"}}>
                    <View style={styles.container}>                         
                            <View style={styles.ProgressBar}>
                            <ProgressBar progress={progress / numberOfQuestions} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
                        </View>
                        <Text style={{fontSize:20,fontWeight:"800",marginBottom:50,marginTop:80}}>Nice ! We are all done and ready to create your diagnosis ...</Text>
                        <TouchableOpacity onPress={() => handleStartDiagnosis()} style={{borderRadius:10,borderWidth:1,padding:10,width:150,alignItems:"center",backgroundColor:"black"}}>
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
                    <Text style={{fontWeight:"700",fontSize:"20",marginBottom:100,width:"90%",textAlign:"center"}}>{dataFixed[indexToEdit].q}</Text>
                            {dataFixed[indexToEdit].type == "binary" ?
                            <View style={{width:"75%",justifyContent:"space-between",flexDirection:"row"}}> 
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
                            <MaterialCommunityIcons 
                            name='close'
                            color={"white"}
                            size={20}
                            style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
                            onPress={() => {handleCloseDiagnosis}}
                            />
                        </View>
                    }
                    >
                    {DiagnosisSheet({
                        isDiagnosisDone,fullDiagnosis
                    })}
                    </BottomSheetModal>

              

                </BottomSheetModalProvider>
            </GestureHandlerRootView >
        </>
    )
}

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
        height:"100%",
        justifyContent:"center",
    },
    btn:{
        padding:10,
        borderWidth:1,
        backgroundColor:"black",
        borderRadius:10,
        width:120,
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
    }
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