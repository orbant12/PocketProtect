import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView,TouchableOpacity, SafeAreaView,Dimensions, PixelRatio } from "react-native"
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { useAuth } from "../../context/UserAuthContext.jsx";
import Body from "../../components/BodyParts/index.tsx";
import doctorImage from "../../assets/doc.jpg"
import Stage1SVG from "../../assets/skinburn/3.png"
import stage2SVG from "../../assets/skinburn/2.png"
import stage3SVG from "../../assets/skinburn/1.png"
import alertMelanoma from "../../assets/skinburn/Melanoma.png"
import alertTeam from "../../assets/skinburn/5.png"
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { melanomaMetaDataUpload } from "../../server.js"


const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => {
    return size * PixelRatio.getFontScale();
};

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
    const [ melanomaMetaData, setMelanomaMetaData] = useState({
        sunburn:[{
            stage:0,
            slug:""
        }],
        skin_type: null,
        detected_relative:"none",

    })
    //SKIN BURN
    const [haveBeenBurned, setHaveBeenBurned] = useState(false)
    const [selectedBurnSide, setSelectedBurnSide] = useState("front")

    //PARENT DIAGNOSED
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

    const handleMelanomaDataChange = (type, data) => {
        setMelanomaMetaData((prevState) => {
          let newSunburn = [...prevState.sunburn]; // Create a shallow copy of the sunburn array              
            if (newSunburn.length === 0) {
                newSunburn.push({ stage: 0, slug: "" }); 
            }                
            if (type === "slug") {
                newSunburn[0] = { ...newSunburn[0], slug: data };
            } else if (type === "stage") {
                newSunburn[0] = { ...newSunburn[0], stage: data };
            }                
            return {
                ...prevState,
                sunburn: newSunburn,
                ...(type === "skin_type" && { skin_type: data }),
                ...(type === "detected_relative" && { detected_relative: data })
            };
            });
    };

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    const handleBack = (permission) => {
        if (round(progress,1) == 0.1 || permission == true){
            navigation.goBack()
        } else if (haveBeenBurned != true && round(progress,1) != 0.9) {    
            setProgress(progress - 0.1)                          
        }  else if (round(progress,1) == 0.9){
            setCurrentSide("front")
            setProgress(progress - 0.1)   
        } else {
            setHaveBeenBurned(false)
        }
    }

    const addMoreBurn = () => {
        setMelanomaMetaData(prevState => ({
            ...prevState,
            sunburn: [{ stage: 3, slug: "" }, ...prevState.sunburn]
        }));
        // Step 3: Set haveBeenBurned to false
        setHaveBeenBurned(false);
    };

    const deleteSunburn = (index) => {
        if(index != 0){
        setMelanomaMetaData((prevState) => {
          const newSunburn = [...prevState.sunburn]; // Create a shallow copy of the sunburn array
          newSunburn.splice(index, 1); // Remove the item at the specified index
    
          return {
            ...prevState,
            sunburn: newSunburn // Update the state with the modified array
          };
        });
        } else {
            setHaveBeenBurned(false)
        } 
    };

    const uploadMetaData = async (metaDataPass) => {   
        const res = await melanomaMetaDataUpload({
            userId: currentuser.uid,
            metaData: metaDataPass
        })
        if (res != true){
            alert("Something Went Wrong. Please check your intenet connection or restart the app !")
        }
    }


    //<==============> Components  <=============> 

    function NotAllSlugModal(){
        return(
            <View style={styles.modalOverlay}> 
            <View style={styles.modalBox}>
                <View style={{alignItems:"center",padding:20}}>
                    <Text style={{fontWeight:"700",fontSize:18,marginTop:10}}>Not all body parts completed</Text>
                    <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>Sure you want to proceed ?</Text>
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
        )
    }

    function FirstScreen(){
        return(
            <>
            <View style={styles.startScreen}> 
                <View style={{alignItems:"center",width:"100%",marginTop:50}}>
                    <Text style={[{marginBottom:10,fontWeight:"700",fontSize:23,backgroundColor:"white",marginTop:0},styles.HeaderText]}>Why complete this report ?</Text>                                    
                </View> 
                <View style={{width:"100%",alignItems:"center"}}>
                    <View style={{width:"80%",marginTop:0,height:200,justifyContent:"space-between"}}>
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

                    <View style={{width:"80%",borderRadius:5,backgroundColor:"lightgray",padding:10,marginTop:50,opacity:0.8}}>
                        <Text style={{marginLeft:10,fontWeight:"600",fontSize:13,}}>Imagine visiting your doctor daily, reporting your health that can be used to make analasis today and can be used in the future</Text>
                    </View>
                </View>             

                <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative",bottom:20}]}>
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
                </Pressable>                    
            </View>          
        </>
    )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"800",fontSize:20,backgroundColor:"white"}}>What body type do you have ?</Text>                    
                </View>
                <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:80}}>
                        <Pressable onPress={() => setGender("male")} style={gender == "male" ? styles.genderOptionButtonA : styles.genderOptionButton}>           
                            <View style={{padding:5,backgroundColor:"rgba(0,0,0,0.1)",opacity:0.6,borderRadius:50,marginBottom:0}}>
                                <MaterialCommunityIcons 
                                    name="gender-male"
                                    size={25}                                    
                                    color={"blue"}
                                />
                            </View>  
                            <Text style={{fontWeight:"600",fontSize:17}}>Male</Text>
                        </Pressable>
                        <Pressable onPress={() => setGender("female")} style={gender == "female" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                            <View style={{padding:5,backgroundColor:"rgba(0,0,0,0.1)",opacity:0.6,borderRadius:50,marginBottom:0}}>
                                <MaterialCommunityIcons 
                                    name="gender-female"
                                    size={30}
                                    style={{marginBottom:1}}
                                    color={"magenta"}
                                />
                            </View>               
                            <Text style={{fontWeight:"600",fontSize:17}}>Female</Text>
                        </Pressable>
                </View>
                <View style={{width:"100%",alignItems:"center"}}>
                    {gender != "" ? 
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative",marginBottom:20}]}>
                            <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }      
                </View>
            </View>
        )
    }

    function FactScreen(){
        return(
            <View style={[styles.startScreen,{justifyContent:"center"}]}>
                    <View style={{width:"100%",alignItems:"center",marginBottom:50}}>
                        <View style={{width:"100%",alignItems:"center"}}>
                            <Image 
                                source={alertTeam} 
                                style={{width:230,height:230,borderRadius:"120%",borderWidth:0.5,borderColor:"lightgray",marginTop:0}}                                               
                            />
                            <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:10}}>Deep Learning Neural Network</Text>
                            <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:0}}>+ Dermotologist</Text>
                        </View>     
                        <View>
                            <Text style={{fontWeight:"550",fontSize:12,maxWidth:"90%",textAlign:"center",marginTop:5,opacity:0.7,marginTop:20,textAlign:"justify"}}>Our AI model can detect malignant moles with a <Text style={{color:"magenta",fontWeight:"600"}}>95%</Text> accuracy which is <Text style={{color:"magenta",fontWeight:"600"}}>+20% </Text>better then the accuracy of dermotologists</Text> 
                            <Text style={{fontWeight:"550",fontSize:12,maxWidth:"90%",textAlign:"center",marginTop:5,opacity:0.7,marginTop:20,textAlign:"justify"}}>Your moles can be supervised by both <Text style={{color:"magenta",fontWeight:"800"}}>AI & Dermotologist</Text> to be as protected as possible and alert you to consult a possible removal with your dermotologist</Text> 
                        </View> 
                    </View>                   
                    <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,position:"absolute",bottom:20}}>
                        <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="check-all"
                                size={25}
                                color={"black"}
                            />
                        </View>         
                        <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"700",opacity:0.9,textAlign:"center",justifyContent:"center"}}>Next</Text>
                    </TouchableOpacity>
            </View>
        )
    }

    function SkinBurnScreen(){
        return(
            <>
            {!haveBeenBurned ? 
                <View style={[styles.startScreen]}>
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:10,fontWeight:"800",fontSize:20,backgroundColor:"white"}}>Have you been sunburnt ?</Text>
                        
                    </View>
                    <View style={{marginBottom:30}}>
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                                <Pressable onPress={() => handleMelanomaDataChange("stage",0)} style={melanomaMetaData.sunburn[0]?.stage  == 0 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                    <MaterialCommunityIcons 
                                        name="cancel"
                                        size={20}
                                        style={{marginBottom:1}}
                                    />
                                    <Text style={{fontWeight:"600",fontSize:17}}>Never</Text>
                                </Pressable>
                                <Pressable onPress={() => handleMelanomaDataChange("stage",1)} style={melanomaMetaData.sunburn[0]?.stage  == 1 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                    <Image 
                                        source={Stage1SVG}
                                        style={{position:"relative",width:100,height:100}}
                                    />
                                    <Text style={{fontWeight:"600",fontSize:17}}>Stage I</Text>
                                </Pressable>
                            </View>
                            <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                                <Pressable onPress={() => handleMelanomaDataChange("stage",2)} style={melanomaMetaData.sunburn[0]?.stage  == 2 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                    <Image 
                                        source={stage3SVG}
                                        style={{position:"relative",width:100,height:100}}
                                    />
                                    <Text style={{fontWeight:"600",fontSize:17}}>Stage II</Text>
                                </Pressable>
                                <Pressable onPress={() => handleMelanomaDataChange("stage",3)}style={melanomaMetaData.sunburn[0]?.stage  == 3 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                                    <Image 
                                        source={stage2SVG}
                                        style={{position:"relative",width:100,height:100}}
                                    />
                                    <Text style={{fontWeight:"600",fontSize:17}}>Stage III</Text>
                                </Pressable>
                            </View>
                    </View>      
                        <View style={{width:"100%",alignItems:"center"}}>
                        {melanomaMetaData.sunburn[0]?.stage  == 0 ? 
                            <Pressable  onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                            </Pressable>
                            :melanomaMetaData.sunburn[0]?.stage== 1 ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            melanomaMetaData.sunburn[0]?.stage == 2 ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            melanomaMetaData.sunburn[0]?.stage == 3 ? 
                            <Pressable onPress={() => setHaveBeenBurned(!haveBeenBurned)} style={styles.startButton}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Where ?</Text>
                            </Pressable>
                            :
                            <Pressable style={styles.startButtonNA}>
                                <Text style={{padding:15,fontWeight:"600",color:"black"}}>Not Selected Yet</Text>
                            </Pressable>
                        }                
                    </View>
                </View>
                :
            
                <View style={styles.startScreen}>
                        <ScrollView centerContent style={{width:"100%"}}>
                            <View style={{width:"100%",alignItems:"center"}}>
                                <View style={{marginTop:50,alignItems:"center"}}>  
                                    <Text style={{marginBottom:10,fontWeight:"800",fontSize:18,backgroundColor:"white",textAlign:"center"}}>Select where the sunburn has occured ?</Text>
                                </View>
                                <View style={{flexDirection:"column",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:-10}}>
                                        <Body 
                                            data={[{slug: melanomaMetaData.sunburn[0].slug}]}
                                            side={selectedBurnSide}
                                            gender={gender}
                                            scale={0.8}
                                            onBodyPartPress={(slug) => handleMelanomaDataChange("slug",slug.slug)}
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
                    {melanomaMetaData.sunburn.map((data,index) => (                  
                        <>
                    {index == 0 && <Text style={{fontWeight:"800",opacity:0.2,top:15,color:"magenta"}}>Current</Text>}
                        <View key={index} style={[{width:"80%",borderWidth:0.3,padding:15,margin:20,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},index == 0 &&{ borderWidth:2,borderColor:"magenta"}]}>
                            <MaterialCommunityIcons 
                                name="chart-box"
                                size={25}
                            />
                            <View style={{marginLeft:0}}> 
                            <Text style={{marginBottom:8,fontWeight:"400"}}>Stage: <Text style={{opacity:1,fontWeight:"800"}}>{data.stage}</Text></Text>
                            <Text style={{fontWeight:"400",}}>Where: <Text style={{opacity:1,fontWeight:"800"}}>{data.slug}</Text></Text>
                            </View>   
                            <MaterialCommunityIcons 
                                name="delete"
                                size={25}
                                color={"red"}
                                opacity={"0.4"}
                                onPress={() => deleteSunburn(index)}
                            />                
                        </View>
                        </>  
                    ))}
                    <View style={{width:"100%",alignItems:"center",marginBottom:20,marginTop:50}}>
                        {melanomaMetaData.sunburn.slug != "Not Selected" ? 
                            <Pressable onPress={() => {setProgress(0.5)}} style={[styles.startButton,{marginBottom:0,position:"relative"}]}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Done</Text>
                            </Pressable>
                            :
                            <Pressable style={styles.startButtonNA}>
                                <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                            </Pressable>
                        }
                        <Pressable onPress={() => addMoreBurn()} style={{marginTop:0}}>
                            <Text style={{padding:13,fontWeight:"600",color:"black",fontSize:17 }}>+ Add More</Text>
                        </Pressable>
                    </View>
                    </View>
                    </ScrollView>
                </View> 
                
            }
            </>
        )
    }

    function SkinTypeScreen(){
        return(          
            <View style={styles.startScreen}>                                    
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:50,fontWeight:"800",fontSize:20,backgroundColor:"white"}}>What is your skin type ?</Text>
                        
                    </View>
                    <View style={{marginBottom:0}}>
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                                <Pressable onPress={() => handleMelanomaDataChange("skin_type",0)} style={[{ backgroundColor:"#fde3ce"}, melanomaMetaData.skin_type == 0 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                
                                <Pressable onPress={() => handleMelanomaDataChange("skin_type",1)} style={[{ backgroundColor:"#fbc79d"},melanomaMetaData.skin_type  == 1 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                    
                        </View>

                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",2)} style={[{ backgroundColor:"#934506"},melanomaMetaData.skin_type  == 2 ? styles.skinTypeOptionButtonA: styles.skinTypeOptionButton]} />                            
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",3)} style={[{ backgroundColor:"#311702"},melanomaMetaData.skin_type == 3 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                        
                        </View>
                    </View>

                    <View style={{width:"100%",alignItems:"center",marginBottom:0}}>
                    {melanomaMetaData.skin_type != null ? 
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative",marginBottom:10}]}>
                            <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={[styles.startButtonNA]}>
                            <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }        
                    </View>

                </View>                
            
            
        )
    }

    function FamilyTreeScreen(){
        return(
        <GestureHandlerRootView style={{ flex: 1,zIndex:-1,width:"100%" }}>
            <BottomSheetModalProvider>
                <View style={styles.startScreen}>
                    <View style={{marginTop:200,alignItems:"center",backgroundColor:"rgba(0,0,0,0.04)",padding:20,borderRadius:10,width:"90%"}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,textAlign:"center",}}>Has anyone in your family been diagnosed with <Text style={{color:"magenta"}}>Melanoma </Text> before ?</Text>
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                        <Pressable onPress={() => handleOpenBottomSheet("open")} style={[styles.startButton,{backgroundColor:"white",marginBottom:20,position:"relative"}]}>
                            <Text style={{padding:15,fontWeight:"600"}}>Yes</Text>
                        </Pressable>
                        
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative"}]}>
                            <Text style={{padding:15,fontWeight:"700",color:"white"}}>No</Text>
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
                                    <Pressable key={data.member} onPress={() => handleMelanomaDataChange("detected_relative",data.member)} style={melanomaMetaData.detected_relative == data.member ? styles.selectableBubbleA : styles.selectableBubble} >
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

    function AlertScreen(){
        return(
            <ScrollView style={{marginTop:30,marginBottom:20}}>
            <View style={{width:"100%",alignItems:"center",marginTop:20}}>
                    <View style={{width:"100%",alignItems:"center"}}>
                    <Image 
                        source={alertMelanoma} 
                        style={{width:230,height:230,borderRadius:"120%",borderWidth:0.5,borderColor:"lightgray"}}                                               
                    />
                    <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:20}}>Great ! Now let's build your body's mole map</Text>  
                    <Text style={{fontWeight:"550",fontSize:12,maxWidth:"95%",textAlign:"center",marginTop:20,opacity:0.7}}>You will mark the location of your mole and upload them to Pocket Protect Cloud. Where our <Text style={{fontWeight:"700",color:"magenta"}}>AI model</Text> and <Text style={{fontWeight:"700",color:"magenta"}}>Professional Dermotologists</Text> can determine wheter your moles are malignant or beningn</Text> 
                    </View>
                        
                    <TouchableOpacity onPress={() => {setProgress(progress + 0.1);uploadMetaData(melanomaMetaData)}} style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,marginTop:80}}>
                        <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="account-arrow-right"
                                size={25}
                                color={"black"}
                            />
                        </View>         
                        <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"600",opacity:0.9,textAlign:"center"}}>Ready !</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0.3,backgroundColor:"white",borderRadius:40,marginTop:15}}>
                        <View style={{backgroundColor:"black",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="account-arrow-right"
                                size={25}
                                color={"white"}
                            />
                        </View>                             
                        <Text style={{marginLeft:20,fontSize:15,color:"black",fontWeight:"700",opacity:0.9,textAlign:"center"}}>How the process works ?</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        )
    }

    function ThirdScreen(){
        return(
            <>
                <ScrollView style={{width:"100%",zIndex:-5,height:"100%",backgroundColor:"white"}}>
                    <View style={[styles.startScreen]}>
                        <View style={{marginTop:50,alignItems:"center"}}>  
                            <Text style={{marginBottom:30,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                            <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                                <Body
                                    data={completedAreaMarker}
                                    gender={gender}
                                    side={currentSide}
                                    scale={1.2}
                                    //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                                    colors={['#A6FF9B']}
                                    onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender, userId: currentuser.uid, sessionMemory:sessionMemory, progress:progress,skinColor: melanomaMetaData.skin_type })}
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

                        <Pressable onPress={() => bodyProgress == 1 ? setProgress(progress + 0.1) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.85,borderWidth:1,alignItems:"center",width:"90%",borderRadius:20,marginBottom:10,backgroundColor:"black",marginTop:20}}>
                            <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>

                    </View >
                </ScrollView>
                {isModalUp ?
                    NotAllSlugModal()
                :null
                }
            </>
        )
    }

    function FourthScreen(){
        return(
            <>
            <ScrollView style={{width:"100%",zIndex:-5,height:"100%",backgroundColor:"white"}}>
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                    <ProgressBar progress={bodyProgressBack} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={completedAreaMarker}
                        gender={gender}
                        side={currentSide}
                        scale={1.2}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender, userId: currentuser.uid, sessionMemory:sessionMemory, skinColor: melanomaMetaData.skin_type})}
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

                <Pressable onPress={() => bodyProgress == 1 ? setProgress(1) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.85,borderWidth:1,alignItems:"center",width:"90%",borderRadius:20,marginBottom:10,backgroundColor:"black",marginTop:20}}>
                    <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                </Pressable>
            </View>
            </ScrollView>
            {isModalUp ?
                NotAllSlugModal()
            :null
            }
        </>
        )
    }

    function FifthScreen(){
        return(
            <View style={styles.startScreen}>
                <ScrollView style={{width:"100%",marginBottom:100}}>
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Congratulations your birtmarks are being monitored !</Text>
                        <Image 
                            source={doctorImage}
                            style={{width:200,height:200,marginTop:-20,zIndex:-1}}
                        />
                        <View style={{borderWidth:0.5,width:"100%",borderColor:"lightgray"}} />
                        <Text style={{fontWeight:"700",fontSize:18,marginTop:20}}>What's next ?</Text> 
                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View> 
                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View> 

                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center",marginBottom:10}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View>          
                    </View>        
                </ScrollView>
                <Pressable onPress={() => {navigation.goBack()}} style={[styles.startButton,{marginBottom:20}]}>
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Finish</Text>
                    </Pressable>
            </View>
        )
    }

     //<==============> Main Component Return <=============> 


    return(
        
        <View style={styles.container}>

            <View style={styles.ProgressBar}>
                <TouchableOpacity onPress={handleBack} style={{backgroundColor:"#eee",borderRadius:30}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={20}
                        style={{padding:6}}
                    />
                </TouchableOpacity>

                <ProgressBar progress={progress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                <TouchableOpacity onPress={() => handleBack(true)} style={{backgroundColor:"#eee",borderRadius:30}}>
                    <MaterialCommunityIcons 
                        name="close"
                        size={20}
                        style={{padding:6}}
                    />
                </TouchableOpacity>
            </View>
            {round(progress,1) === 0.1 && FirstScreen()}
            {round(progress,1) === 0.2 && FactScreen()}
            {round(progress,1) === 0.3 && SecoundScreen()}
            {round(progress,1) == 0.4 && SkinBurnScreen()}
            {round(progress,1) === 0.5 && SkinTypeScreen()}
            {round(progress,1) === 0.6 && FamilyTreeScreen()}
            {round(progress,1) === 0.7 && AlertScreen()}          
            {round(progress,1) === 0.8 && ThirdScreen()}
            {round(progress,1) === 0.9 && FourthScreen()}
            {round(progress,1) === 1 && FifthScreen()}

        </View>
        
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        width:"100%",
        height:"100%",
        borderWidth:0,
        justifyContent:"center"
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        marginBottom:0,
        backgroundColor:"white",
        zIndex:-1
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"absolute",
        bottom:20
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:20,
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
        width:"95%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between"
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
        top: 300,
        left: 0,
    },
    genderOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:0.3,
        borderRadius:10,
        padding:20,
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:2,
        borderRadius:15,
        padding:20,
        backgroundColor:"rgba(0,0,0,0.03)",
        borderColor:"magenta"
    },
    skinTypeOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:5,
        borderColor:"magenta",
        borderRadius:15,
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
        height:180,
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    },
    progressDot:{
        width:6,
        height:6,
        borderRadius:100,
        backgroundColor:"black",
        position:"absolute",
        bottom:70
    },
    HeaderText:{
        fontSize: responsiveFontSize(23),
    }
})

export default MelanomaFullProcess