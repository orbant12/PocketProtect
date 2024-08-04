import { View,StyleSheet,Text,Pressable,Image, TouchableOpacity, Modal, ScrollView } from "react-native"
import ProgressBar from 'react-native-progress/Bar';
import React,{useState,useEffect} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Onboarding from 'react-native-onboarding-swiper';
import "react-native-gesture-handler"
import { changePersonalData, changeProfilePicture } from "../../../services/server"
import { useAuth } from "../../../context/UserAuthContext";

import { NavBar_OneOption, NavBar_TwoOption } from "../../../components/Common/navBars";
import { DateToString } from "../../../utils/date_manipulations";
import { SelectionPage } from "../../../components/Common/SelectableComponents/selectPage";
import { styles_shadow } from "../../../styles/shadow_styles";
import * as ImagePicker from 'expo-image-picker';
import { ImageLoaderComponent } from "../../Libary/Melanoma/slugAnalasis";
import ProfileCameraScreenView from "../cameraModal";
import { PagerComponent } from "../../../components/Common/pagerComponent";
import { OneOptionBox } from "../../../components/LibaryPage/Melanoma/boxes/oneOptionBox";
import { AssistantAdvertBox } from "../../../components/LibaryPage/Melanoma/Assistance/assistantAdvert";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { convertImageToBase64 } from "../../../utils/imageConvert";
import { SkinCancerMonitor_Onboard } from "../../../components/AddPage/onBoardings/skinCancerMonitorBoard";
import { Assist_Onboard } from "../../../components/AddPage/onBoardings/assistantBoard";
import { styles } from "../../../styles/onBoard_styles";
import { DateInputPage } from "../OnBoarding_Components/dateInput";


const RegOnBoarding = ({navigation}) => {

    const maleDefault = Image.resolveAssetSource(require("../../../assets/male.png")).uri;
    const femaleDefault = Image.resolveAssetSource(require("../../../assets/female.png")).uri;
    

    // <===> Variable <====> 

    const [ progress, setProgress] = useState(0)
    const [gender, setGender ] = useState(null)
    const [birthDate, setBirthDate] = useState(new Date(2098051730000));
    const {currentuser, handleAuthHandler} = useAuth()
    const [profileUrl, setProfileUrl] = useState(maleDefault)
    const [isCameraActive, setIsCameraActive] = useState(false)

    // <===> FUNCTIONS <====> 
    
    const handleFinishOnboarding = async () => {
        const response = await changePersonalData({
            fieldNameToChange: "gender",
            dataToChange: gender,
            userId: currentuser.uid,
        })
        const response2 = await changePersonalData({
            fieldNameToChange: "birth_date",
            dataToChange: birthDate,
            userId: currentuser.uid,
        })
        const profileBlob = await convertImageToBase64(profileUrl)
        const response3 = await changeProfilePicture({
            userId: currentuser.uid,
            profileBlob:profileBlob
        })
        if (response == true && response2 == true && response3 == true) {
            handleAuthHandler("fetch_w_main")
        } else {
            alert("Something went wrong !")
        }
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;        
        setBirthDate(currentDate);
      };

      useEffect(() => {
        if(gender == "female" && (profileUrl == maleDefault || profileUrl == "")){
            setProfileUrl(femaleDefault)
        } else if(gender == "male" && (profileUrl == femaleDefault || profileUrl == "")){
            setProfileUrl(maleDefault)
        }
      },[progress])

     // <===> Child Component <====> 



    function SecoundScreen(){
        
            return(            
            <SelectionPage 
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.2}}}
                selectableOption={"box"}
                desc="We need this information to create an accurate model of your body and distinctive models for each body part ..."
                selectableData={
                    [
                        {
                            title:"Female",
                            type:"female",
                            icon:{
                                type:"icon",
                                metaData:{
                                    name:"gender-female",
                                    size:30,
                                    color:"magenta"
                                }
                            }
                        },
                        {
                            title:"Male",
                            type:"male",
                            icon:{
                                type:"icon",
                                metaData:{
                                    name:"gender-male",
                                    size:30,
                                    color:"blue"
                                }
                            }
                        },                                                                                                                                                        
                    ]
                }                    
                setOptionValue={(e) =>{setGender(e)} }
                optionValue={gender}
                pageTitle={"What body type do you have ?"}
                setProgress={setProgress}
            />

        )
    }


    function ProfileScreen(){
        const handlePictureUpload = async() => {        
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (!result.canceled) {
                setProfileUrl(result.assets[0].uri);
            }
        };

        return(
            <>
                <View style={styles.startScreen}>
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%"}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Select or upload your profile picture !</Text>
                        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="information"
                                color={"black"}
                                size={30}
                                style={{width:"10%",opacity:0.6}}
                            />
                            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>You can change this later ! We need this information for making chatting and medical reports more personal & formal ...</Text>
                        </View>
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                        <View style={[{borderWidth:0.3,borderColor:"magenta",backgroundColor:"rgba(0,0,0,1)",borderRadius:10,marginBottom:30,width:130,height:130,flexDirection:"column",alignItems:"center",justifyContent:"center"},styles_shadow.hightShadowContainer]}>
                            <ImageLoaderComponent
                                w={120}
                                h={120}
                                imageStyle={{borderRadius:10}}
                                style={{backgroundColor:"transparent",borderRadius:10}}
                                data={{melanomaPictureUrl:profileUrl}}
                            />
                        </View>
                        <View style={{width:"80%",flexDirection:"row",alignItems:"center",justifyContent:"center",padding:10,borderWidth:0.3,borderRadius:10}}>
                            <TouchableOpacity onPress={() => setProfileUrl(maleDefault)}>
                                <Image 
                                    style={profileUrl != maleDefault ? {width:50,height:50,marginLeft:5,borderWidth:3} : {width:50,height:50,marginLeft:5,borderWidth:3,borderColor:"magenta"}}
                                    source={{uri: maleDefault}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setProfileUrl(femaleDefault)}>
                                <Image 
                                    style={profileUrl != femaleDefault ? {width:50,height:50,marginLeft:5,borderWidth:3} : {width:50,height:50,marginLeft:5,borderWidth:3,borderColor:"magenta"}}
                                    source={{uri: femaleDefault}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsCameraActive(true)} style={{backgroundColor:"white",padding:10,borderRadius:5, width:50,height:50,marginLeft:25,borderWidth:3,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
                                <MaterialCommunityIcons 
                                    name="camera"
                                    size={25}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePictureUpload} style={{backgroundColor:"black",padding:10,borderRadius:5, width:50,height:50,marginLeft:5,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
                                <MaterialCommunityIcons 
                                    name="image"
                                    size={30}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Pressable onPress={() => setProgress(progress + 0.2)} style={[styles.startButton,{marginBottom:0}]}>
                        <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>
                </View>
                <Modal visible={isCameraActive} animationType="slide" presentationStyle="overFullScreen" >
                    <ProfileCameraScreenView 
                        onClose={() => setIsCameraActive(false)}
                        onPictureTaken={(uri:string) => {
                            setProfileUrl(uri);
                            setIsCameraActive(false);
                        }}
                    />  
                </Modal>
            </>
        )
    }

    function TutorialFirst(){


        return(
            <View style={[styles.startScreen,{height:"93%"}]}>
                <ScrollView contentContainerStyle={{alignItems:"center",paddingBottom:250}} style={{width:"100%",paddingTop:20}}>
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Take our warm welcome and let's get you protected !</Text>
                        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="information"
                                color={"black"}
                                size={30}
                                style={{width:"10%",opacity:0.6}}
                            />
                            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>Take your time to explore the app and it's features ...</Text>
                        </View>
                    </View>
                    <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:40},styles_shadow.hightShadowContainer]}>
                        <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                            <Text style={{fontSize:18,fontWeight:"700",color:"white"}}>Melanoma Monitor</Text>
                            <MaterialCommunityIcons 
                                name="liquid-spot"
                                color={"white"}
                                size={25}
                            />
                        </View>
                    <PagerComponent 
                        indicator_position={{backgroundColor:"black",padding:15}}
                        dotColor={"white"}
                        pagerStyle={{height:300,borderWidth:1}}
                        pages={[
                            {pageComponent:() =>
                                <Image
                                    source={{uri: maleDefault}}
                                    style={{width:"100%",height:300}}
                                />
                            },
                            {pageComponent:() =>
                            <Image
                                source={{uri: maleDefault}}
                                style={{width:"100%",height:300}}
                            />
                            }
                        ]}
                    />
                    </View>
                    <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:70},styles_shadow.hightShadowContainer]}>
                        <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                            <Text style={{fontSize:18,fontWeight:"700",color:"white"}}>Medical AI Assistant</Text>
                            <MaterialCommunityIcons 
                                name="doctor"
                                color={"white"}
                                size={25}
                            />
                        </View>
                        <PagerComponent 
                        indicator_position={{backgroundColor:"black",padding:15}}
                        dotColor={"white"}
                        pagerStyle={{height:300,borderWidth:1}}
                        pages={[
                            {pageComponent:() =>
                                <Image
                                    source={{uri: maleDefault}}
                                    style={{width:"100%",height:300}}
                                />
                            },
                            {pageComponent:() =>
                            <Image
                                source={{uri: maleDefault}}
                                style={{width:"100%",height:300}}
                            />
                            }
                        ]}
                    />
                    </View>
                    <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:70},styles_shadow.hightShadowContainer]}>
                        <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                            <Text style={{fontSize:18,fontWeight:"700",color:"white"}}>Diagnosis AI</Text>
                            <MaterialCommunityIcons 
                                name="brain"
                                color={"white"}
                                size={25}
                            />
                        </View>
                        <PagerComponent 
                        indicator_position={{backgroundColor:"black",padding:15}}
                        dotColor={"white"}
                        pagerStyle={{height:300,borderWidth:1}}
                        pages={[
                            {pageComponent:() =>
                                <Image
                                    source={{uri: maleDefault}}
                                    style={{width:"100%",height:300}}
                                />
                            },
                            {pageComponent:() =>
                            <Image
                                source={{uri: maleDefault}}
                                style={{width:"100%",height:300}}
                            />
                            }
                        ]}
                    />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => handleFinishOnboarding()} style={{width:"85%",padding:14,backgroundColor:"magenta",alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:10,marginTop:0}}>
                <Text style={{fontSize:15,fontWeight:"700", color:"white"}}>Start</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function ThirdScreen(){

        function TutorialSecound(){
            return(
                <View style={styles.startScreen}>
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"center"}}>Our Deep Learning Skin Cancer Detection Model</Text>
                    </View>
                    <View style={{width:"100%",height:"80%",alignItems:"center",zIndex:-1}}>
                    </View>
                </View>
            )
        }



        function TutorialThird(){
            return(
                <View style={styles.startScreen}>
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Learn to protect you and your loved ones !</Text>
                        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="information"
                                color={"black"}
                                size={30}
                                style={{width:"10%",opacity:0.6}}
                            />
                            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>We have a bunch of quick learning modules about skin cancer and it's signs of appearance</Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{alignItems:"center",paddingBottom:250}} style={{width:"100%"}}>
                        <OneOptionBox 
                            navigation={navigation}
                            buttonTitle="Start Learning"
                            subTitle="ABCDE Rule"
                            mainTitle="Detect Skin Cancer"
                            image={require("../../../assets/abcde.png")}
                            bgColor="white"
                            onClick={() => alert("Complete your onboarding to access this feature")}
                            id="abcde"
                        />


                        <OneOptionBox 
                            navigation={navigation}
                            stw={180}
                            buttonTitle="Register New !"
                            subTitle="Sunburn significantly increases the risk of skin cancer"
                            mainTitle="Your Skin Data"
                            image={require("../../../assets/type.png")}
                            bgColor={"black"}
                            textColor={"white"}
                            onClick={() => alert("Complete your onboarding to access this feature")}
                            id="skin_data"
                        />

                        <OneOptionBox 
                            navigation={navigation}
                            buttonTitle="How it works ?"
                            subTitle="100% Transparency - Open Source"
                            mainTitle="Our AI Model"
                            image={require("../../../assets/ai.png")}
                            bgColor="white"
                            onClick={() => alert("Complete your onboarding to access this feature")}
                            id="ai_model"
                        />

                        <OneOptionBox 
                            navigation={navigation}
                            stw={180}
                            buttonTitle="Register New !"
                            subTitle="Sunburn significantly increases the risk of skin cancer"
                            mainTitle="Track Sun Burn"
                            image={require("../../../assets/burn.png")}
                            bgColor={"orange"}
                            onClick={() => alert("Complete your onboarding to access this feature")}
                            id="sun_burn"
                        />
                    </ScrollView>
                </View>
            )
        }

        return(
            <View style={{width:"100%",height:"100%",zIndex:-1}}>
                <Onboarding
                    onDone={() => setProgress(1)}
                    skipLabel={"Back"}
                    pages={[
                    // 1.) UPLOAD PODCAST
                    {
                        backgroundColor: 'white',
                        title: 
                        SkinCancerMonitor_Onboard({
                            noTitle:false,
                        })
                    },

                    {
                        backgroundColor: 'white',
                        title: TutorialThird()
                    },
                    {
                        backgroundColor: 'white',
                        title: Assist_Onboard()
                    },
                    {
                        backgroundColor: 'white',
                        title: 
                            TutorialSecound()
                    },
                ]}
                />
            </View>
    )}

    function FinalScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:200,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Congratulations, let start your protection !</Text>
                    <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:40}}>
                        <View style={{width:70,height:70,borderWidth:1}} />
                        <View style={{width:70,height:70,borderWidth:1}} />
                        <View style={{width:70,height:70,borderWidth:1}} />
                    </View>
                    <Text style={{marginBottom:10,fontSize:12,backgroundColor:"white",textAlign:"center",marginTop:10}}>Currently Avalible Detections - Version 1.0</Text>
               
                </View>
                <View style={{width:"100%",alignItems:"center"}}>
                {gender != "" ? 
                    <Pressable onPress={() => handleFinishOnboarding()} style={styles.startButton}>
                        <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>
                    :
                    <Pressable style={styles.startButtonNA}>
                        <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                    </Pressable>
                }
                    <Pressable onPress={() => setProgress(0.6)} style={{}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

    const round = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    return(
        <>
        {progress >= 0.6 ?
            <NavBar_TwoOption 
                icon_right={{name:"skip-next-outline",size:25,action() {
                    progress >= 0.6 ? setProgress(1) : alert("You need to add mandatory data first !")
                },}}
                icon_left={{name:"arrow-left",size:25,action:() => setProgress(progress - 0.2) }}
                title={"Welcome to PocketProtect"} 
                outerBg="white"
            />
            :
            <NavBar_OneOption 
                icon_left={{name:"arrow-left",size:25,action() {
                    round(progress) !== 0 ? setProgress(progress - 0.2) : setProgress(0)
                },}}
                title="Welcome to PocketProtect"
            />}
            <View style={styles.container}>
                <View style={styles.ProgressBar} >
                    <ProgressBar progress={progress} width={350} height={5} color={"magenta"}backgroundColor={"white"} />
                </View>
                {round(progress) == 0 ? <DateInputPage 
                    title={"When were you born ?"}
                    date={birthDate}
                    setProgress={setProgress}
                    progress={progress}
                    setBirthDate={setBirthDate}
                />:null}
                {round(progress) == 0.2 ? SecoundScreen():null}
                {round(progress) == 0.4 ? ProfileScreen():null}
                {round(progress) == 0.6 ? ThirdScreen():null}
                {round(progress) == 1 ? TutorialFirst():null}
            </View>
        </>
    )
}



export default RegOnBoarding;