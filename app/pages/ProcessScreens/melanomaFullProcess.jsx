import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView } from "react-native"
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { useAuth } from "../../context/UserAuthContext.jsx";
import Body from "../../components/BodyParts/index.tsx";
import doctorImage from "../../assets/doc.jpg"
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const MelanomaFullProcess = ({navigation,route}) => {

    //<===============> Variables  <===============> 

    const {currentuser} = useAuth()
    //Progress Trackers
    const [progress, setProgress] = useState(0.1)
    const [bodyProgress, setBodyProgress] = useState(1)
    const [bodyProgressBack, setBodyProgressBack] = useState(0)
    //Body for Birthmark
    const [currentSide, setCurrentSide] = useState("front")
    const [gender, setGender]= useState("")
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    //ROUTING MEMORY
    const sessionMemory = route.params.sessionMemory
    //Modal toggle
    const [isModalUp, setIsModalUp] = useState(false)
    //SKIN BURN
    const [sunBurn, setSunBurn] = useState("never")
    const [haveBeenBurned, setHaveBeenBurned] = useState(false)
    const [selectedBurnSide, setSelectedBurnSide] = useState("front")
    const [selectedBurnSlug, setSelectedBurnSlug] = useState("Not Selected")
    //SKIN TYPE
    const [skinType, setSkinType] = useState(null)
    //PARENT DIAGNOSED
    const [ diagnosedFamilyMember,setDiagnosedFamilyMember] = useState("")
    const familyMemberOptions = [
        {
            member:"father",
        },
        {
            member:"grandfather",
        },
        {
            member:"mother",
        },
        {
            member:"sibling",
        },
        {
            member:"grandmother",
        },
        {
            member:"other",
        }
    ]
    //Bottom Sheet
    const bottomSheetRef = useRef(null);
    const snapPoints = ['90%'];



    //<===============> Functions  <===============> 

    const completedArea = async (sessionMemory) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)
        if(currentSide == "front"){
            setBodyProgress(response.length / 13)
        } else if (currentSide == "back"){
            setBodyProgressBack(response.length / 11)
        }
    }
    
    useEffect(() => {
        completedArea(sessionMemory);
    }, [sessionMemory,]); 

    const handleOpenBottomSheet = (state) => {
        if(state == "open"){
            bottomSheetRef.current.present();
        } else if (state == "hide"){
            bottomSheetRef.current.close();
            setProgress(progress + 0.1)
        }
    }

    //<==============> Components  <=============> 

    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:23,backgroundColor:"white"}}>Why complete this report ?</Text>
                    <View style={{width:"80%",marginTop:50,height:200,justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="magnify-scan"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white",width:"100%"}}>Designed by medical researchers and doctors</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="creation"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Most diaseses can be detected by tracking reccourant symtoms daily</Text>
                        </View>

                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="calendar-today"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>We can monitor and keep track of your health and potential reoccuring symptoms</Text>
                        </View>


                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="doctor"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Our Ai Model can see your daily reports and use them for more accurate analasis and health advice</Text>
                        </View>                                        
                    </View>

                    <View style={{width:"80%",borderRadius:5,backgroundColor:"lightgray",padding:10,marginTop:60,opacity:0.8}}>
                        <Text style={{marginLeft:10,fontWeight:"600",fontSize:13,}}>Imagine visiting your doctor daily, reporting your health that can be used to make analasis today and can be used in the future</Text>
                    </View>
                </View>
                <Pressable onPress={() => setProgress(0.2)} style={[styles.startButton,{marginBottom:10}]}>
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What body type do you have ?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                        <Pressable onPress={() => setGender("male")} style={gender == "male" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                            <MaterialCommunityIcons 
                                name="weight"
                                size={20}
                                style={{marginBottom:1}}
                            />
                            <Text style={{fontWeight:"600",fontSize:17}}>Male</Text>
                        </Pressable>
                        <Pressable onPress={() => setGender("female")} style={gender == "female" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                            <MaterialCommunityIcons 
                                name="heart"
                                size={20}
                                style={{marginBottom:1}}
                            />
                            <Text style={{fontWeight:"600",fontSize:17}}>Female</Text>
                        </Pressable>
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                    {gender != "" ? 
                        <Pressable onPress={() => setProgress(0.3)} style={styles.startButton}>
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setProgress(0.1)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

    function SkinBurnScreen(){
        return(
            <>
            {!haveBeenBurned ? 
                <View style={styles.startScreen}>
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>Have you been sunburned ?</Text>
                        
                    </View>
                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0}}>
                            <Pressable onPress={() => setSunBurn ("never")} style={sunBurn == "never" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                <MaterialCommunityIcons 
                                    name="weight"
                                    size={20}
                                    style={{marginBottom:1}}
                                />
                                <Text style={{fontWeight:"600",fontSize:17}}>Never</Text>
                            </Pressable>
                            <Pressable onPress={() => setSunBurn ("stage1")} style={sunBurn  == "stage1" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                <MaterialCommunityIcons 
                                    name="heart"
                                    size={20}
                                    style={{marginBottom:1}}
                                />
                                <Text style={{fontWeight:"600",fontSize:17}}>Stage I</Text>
                            </Pressable>
                        </View>
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                            <Pressable onPress={() => setSunBurn ("stage2")} style={sunBurn  == "stage2" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                <MaterialCommunityIcons 
                                    name="weight"
                                    size={20}
                                    style={{marginBottom:1}}
                                />
                                <Text style={{fontWeight:"600",fontSize:17}}>Stage II</Text>
                            </Pressable>
                            <Pressable onPress={() => setSunBurn ("stage3")} style={sunBurn == "stage3" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                <MaterialCommunityIcons 
                                    name="heart"
                                    size={20}
                                    style={{marginBottom:1}}
                                />
                                <Text style={{fontWeight:"600",fontSize:17}}>Stage III</Text>
                            </Pressable>
                        </View>
                        <View style={{width:"100%",alignItems:"center"}}>
                        {sunBurn == "never" ? 
                            <Pressable  onPress={() => setProgress(0.4)} style={styles.startButton}>
                                <Text style={{padding:10,fontWeight:"600",color:"white"}}>Next</Text>
                            </Pressable>
                            :sunBurn == "stage1" ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:10,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            sunBurn == "stage2" ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:10,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            sunBurn == "stage3" ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:10,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            <Pressable style={styles.startButtonNA}>
                                <Text style={{padding:10,fontWeight:"600",color:"white"}}>Not Selected Yet</Text>
                            </Pressable>
                        }
                        <Pressable onPress={() => setProgress(0.2)} style={{marginBottom:10}}>
                            <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                        </Pressable>
                    </View>
                </View>
                :
                <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:18,backgroundColor:"white",textAlign:"center"}}>Select where the sunburn has occured ?</Text>
                </View>
                <View style={{flexDirection:"column",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0,borderTopWidth:1}}>
                        <Body 
                            data={[{slug: selectedBurnSlug}]}
                            side={selectedBurnSide}
                            gender={gender}
                            scale={0.9}
                            onBodyPartPress={(slug) => setSelectedBurnSlug(slug.slug)}
                        />
                        <View style={styles.positionSwitch}>
                            <Pressable onPress={() => setSelectedBurnSide("front")}>
                                <Text style={selectedBurnSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                            </Pressable>
                            <Text>|</Text>
                            <Pressable onPress={() => setSelectedBurnSide("back")}>
                                <Text style={selectedBurnSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                            </Pressable>
                        </View>
                </View>
                <View style={{width:"100%",alignItems:"center"}}>
                    {selectedBurnSlug != "Not Selected" ? 
                        <Pressable onPress={() => {setProgress(0.4)}} style={styles.startButton}>
                            <Text style={{padding:10,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
                </View> 
            }
            </>
        )
    }

    function SkinTypeScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What is your skin type ?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0}}>
                        <Pressable onPress={() => setSkinType(0)} style={[{ backgroundColor:"#fde3ce"}, skinType == 0 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />
                        
                        <Pressable onPress={() => setSkinType (1)} style={[{ backgroundColor:"#fbc79d"},skinType  == 1 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                    
                </View>

                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                        <Pressable onPress={() => setSkinType(2)} style={[{ backgroundColor:"#934506"},skinType  == 2 ? styles.skinTypeOptionButtonA: styles.skinTypeOptionButton]} />
                        
                        <Pressable onPress={() => setSkinType(3)} style={[{ backgroundColor:"#311702"},skinType == 3 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />
            
                    
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                    {skinType!= null ? 
                        <Pressable onPress={() => setProgress(0.5)} style={styles.startButton}>
                            <Text style={{padding:10,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setProgress(0.3)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                    </View>
            </View>
        )
    }

    function FamilyTreeScreen(){
        return(
        <GestureHandlerRootView style={{ flex: 1,zIndex:-1,width:"100%" }}>
            <BottomSheetModalProvider>
                <View style={styles.startScreen}>
                    <View style={{marginTop:150,alignItems:"center",backgroundColor:"lightblue",padding:30,borderRadius:10}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,textAlign:"center",}}>Has anyone in your family been diagnosed with <Text style={{color:"white"}}>Melanoma </Text> before ?</Text>
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                        <Pressable onPress={() => handleOpenBottomSheet("open")} style={[styles.startButton,{backgroundColor:"white",marginBottom:10}]}>
                            <Text style={{padding:10,fontWeight:"600"}}>Yes</Text>
                        </Pressable>
                        
                        <Pressable onPress={() => setProgress(0.6)} style={[styles.startButton]}>
                            <Text style={{padding:10,fontWeight:"700",color:"white"}}>No</Text>
                        </Pressable>

                        <Pressable onPress={() => setProgress(0.4)} style={{marginBottom:10}}>
                            <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                        </Pressable>
                    </View> 

                    <BottomSheetModal
                        ref={bottomSheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:20,borderTopRightRadius:20,borderBottomWidth:2,height:30,color:"white"}}
                        handleIndicatorStyle={{backgroundColor:"white"}}
                    >
                        <View style={{width:"100%",alignItems:"center",flexDirection:"column",backgroundColor:"#fff",padding:10,marginTop:30}}>
                            <Text style={{fontWeight:700,textAlign:"center",fontSize:20}}>Please select whom from your family had been diagnosed ...</Text>
                            <ScrollView horizontal style={{width:"100%",marginTop:50}} showsHorizontalScrollIndicator={false}>
                                {familyMemberOptions.map((data) => (
                                    <Pressable key={data.member} onPress={() => setDiagnosedFamilyMember(data.member)} style={diagnosedFamilyMember == data.member ? styles.selectableBubbleA : styles.selectableBubble} >
                                        <MaterialCommunityIcons
                                            name="heart"
                                        />
                                        <Text>{data.member}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <Pressable onPress={() => handleOpenBottomSheet("hide")} style={{marginTop:50,borderWidth:1,borderRadius:8,width:130,height:40,alignItems:"center",justifyContent:"center",backgroundColor:"black"}}>
                                <Text style={{fontWeight:"700",color:"white"}}>Done</Text>
                            </Pressable>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
        )
    }

    function ThirdScreen(){
        return(
            <>
                <View style={styles.startScreen}>
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                        <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                            <Body
                                data={completedAreaMarker}
                                gender={gender}
                                side={currentSide}
                                scale={1}
                                //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                                colors={['#A6FF9B']}
                                onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender, userId: currentuser.uid, sessionMemory:sessionMemory, progress:progress })}
                                zoomOnPress={true}
                            />

                            <View style={styles.colorExplain}>
                                <View style={styles.colorExplainRow} >
                                <View style={styles.redDot} />
                                    <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Empty</Text>
                                </View>

                                <View style={styles.colorExplainRow}>
                                    <View style={styles.greenDot} />
                                    <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Complete</Text>
                                </View>
                            </View>
                    </View>

                    <Pressable onPress={() => bodyProgress == 1 ? setProgress(progress + 0.1) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.5,borderWidth:1,alignItems:"center",width:"90%",borderRadius:20,marginBottom:0,backgroundColor:"black"}}>
                        <Text style={{padding:10,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>

                    <Pressable onPress={() => setProgress(0.5)} style={{marginTop:-5}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
                {isModalUp ?
                <View style={styles.modalOverlay}> 
                    <View style={styles.modalBox}>
                        <View style={{alignItems:"center",padding:30}}>
                            <Text style={{fontWeight:"600",fontSize:17}}>Not all body parts completed</Text>
                            <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>Sure you want to proceed</Text>
                        </View>
                        <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                            <Pressable style={styles.modalYesBtn} onPress={() => setIsModalUp(!isModalUp)}>
                                <Text style={{fontWeight:"700",color:"white"}}>No</Text>
                            </Pressable>

                            <Pressable onPress={() => {setProgress(progress + 0.1);setIsModalUp(!isModalUp);setCurrentSide("back")}} style={styles.modalNoBtn}>
                                <Text style={{fontWeight:"700"}}>Yes</Text>
                            </Pressable>
    
                        </View>
                    </View>
                </View>
                :null
                }
            </>
        )
    }

    function FourthScreen(){
        return(
            <>
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                    <ProgressBar progress={bodyProgressBack} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={completedAreaMarker}
                        gender={gender}
                        side={currentSide}
                        scale={1}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender, userId: currentuser.uid, sessionMemory:sessionMemory })}
                        zoomOnPress={true}
                    />

                <View style={styles.colorExplain}>
                    <View style={styles.colorExplainRow} >
                        <View style={styles.redDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Empty</Text>
                        </View>

                        <View style={styles.colorExplainRow}>
                            <View style={styles.greenDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Complete</Text>
                        </View>
                    </View>
                </View>

                <Pressable onPress={() => bodyProgress == 1 ? setProgress(0.8) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.5,borderWidth:1,alignItems:"center",width:"90%",borderRadius:20,marginBottom:0,backgroundColor:"black"}}>
                    <Text style={{padding:10,fontWeight:"600",color:"white"}}>Next</Text>
                </Pressable>

                <Pressable onPress={() => {setProgress(0.6);setCurrentSide("front")}} style={{marginTop:-5}}>
                    <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                </Pressable>
            </View>
            {isModalUp ?
            <View style={styles.modalOverlay}> 
                <View style={styles.modalBox}>
                    <View style={{alignItems:"center",padding:30}}>
                        <Text style={{fontWeight:"600",fontSize:17}}>Not all body parts completed</Text>
                        <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>Sure you want to proceed</Text>
                    </View>
                    <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                        <Pressable style={styles.modalYesBtn} onPress={() => setIsModalUp(!isModalUp)}>
                            <Text style={{fontWeight:"700",color:"white"}}>No</Text>
                        </Pressable>

                        <Pressable onPress={() => setProgress(0.8)} style={styles.modalNoBtn}>
                            <Text style={{fontWeight:"700"}}>Yes</Text>
                        </Pressable>

                    </View>
                </View>
            </View>
            :null
            }
        </>
        )
    }

    function FifthScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Congratulations your birtmarks are being monitored !</Text>
                    <Image 
                        source={doctorImage}
                        style={{width:200,height:200,marginTop:-20,zIndex:-1}}
                    />
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                </View>
                <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
                    <Text style={{padding:10,fontWeight:"600"}}>Finish</Text>
                </Pressable>
            </View>
        )
    }

     //<==============> Main Component Return <=============> 

    return(
        <View style={styles.container}>

            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {progress === 0.1 ? FirstScreen():null}
            {progress === 0.2 ? SecoundScreen():null}
            {progress === 0.3 ? SkinBurnScreen():null}
            {progress === 0.4 ? SkinTypeScreen():null}
            {progress === 0.5 ? FamilyTreeScreen():null}
            {progress === 0.6 ? ThirdScreen():null}
            {progress === 0.7 ? FourthScreen():null}
            {progress === 0.8 ? FifthScreen():null}

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        width:"100%",
        height:"100%",
        justifyContent:"center"
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        backgroundColor:"white",
        zIndex:-1
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:2,
        backgroundColor:"black"
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10,
        opacity:0.3
    },
    backButton:{
        borderWidth:0,
        alignItems:"center",
        width:"40%",
        borderRadius:20,
    },
    bar: {
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"lightgray"
    },
    saveButtonActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
    },
    saveButtonInActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
        opacity:0.5
    },
    uploadButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        marginTop: 30,
        marginBottom:30,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 10,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
    
    },
    OwnSlugAddBtn: {
        width: "80%",
        height: 50,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft:"auto",
        marginRight:"auto",
    },
    MoreSpotButton:{
        backgroundColor:"magenta",
        borderRadius:10,
        marginBottom:20,
        width:250,
        alignItems:"center",
        borderWidth:1
    },
    AllSpotButton:{
        backgroundColor:"white",
        borderRadius:10,
        borderWidth:1,
        width:250,
        alignItems:"center",
        opacity:0.8
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'gray',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#00FF00',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    colorExplain: {
        flexDirection: 'column',
        alignItems: 'left',
        position: 'absolute',
        marginTop: 10,
        top: 100,
        left: 0,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 200,
        left: 0,
    },
    genderOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:1,
        borderRadius:30,
        padding:20,
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:1,
        borderRadius:30,
        padding:20,
        backgroundColor:"lightblue"
    },
    skinTypeOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:5,
        borderColor:"lightblue",
        borderRadius:30,
        padding:20,
    },
    skinTypeOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderRadius:30,
        padding:20,
    },
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        width:300,
        height:200,
        borderWidth:1,
        borderRadius:10,
        padding:0,
        shadowColor: '#171717',
        shadowOffset: {width: 4, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    modalYesBtn:{
        padding:5,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:60,
        height:40,
        alignItems:"center",
        marginLeft:30,

    },
    modalNoBtn:{
        padding:5,
        backgroundColor:"white",
        borderRadius:10,
        alignItems:"center",
        borderWidth:1,
        width:60,
        height:40,
        justifyContent:"center",
    },
    modalOverlay:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 0,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
        marginBottom:20
    
    },
    selectableBubble:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderWidth:1,
        borderRadius:20,
        marginLeft:20,
        marginRight:20
    },
    selectableBubbleA:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderRadius:20,
        marginLeft:20,
        marginRight:20,
        borderWidth:2,
        borderColor:"lightblue",
        borderRadius:20,
    }
})

export default MelanomaFullProcess