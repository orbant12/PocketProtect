import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState,useEffect,useRef} from "react";
import * as ImagePicker from 'expo-image-picker';
import ProgressBar from 'react-native-progress/Bar';
import { dotSelectOnPart } from './melanomaDotSelect.jsx'

import {bodyFemaleFront} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFemaleFront.ts"
import {bodyFemaleBack} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFemaleBack.ts"
import {bodyFront} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFront.ts"
import {bodyBack} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyBack.ts"

const MelanomaFullProcess = () => {

    const [progress, setProgress] = useState(0.1)

    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const [bodyPart, setBodyPart] = useState([bodyFemaleFront[0]]);
    const [orderedParts,setOrderedParts] = useState(
        [
            "head",
            "chest",
            "left-arm",
            "right-arm",
            "right-hand",
            "left-hand",
            "upper-leg-left",
            "upper-leg-right",
            "lower-leg-left",
            "lower-leg-right",
            "left-feet",
            "right-feet",
        ])

    const [orderedPartsCounter, setOrderedPartsCounter] = useState(0)

    const [gender, setGender]= useState("female")
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [isFinished,setIsFinished] = useState(false)
    const [currentSlugMemory, setCurrentSlugMemory ] = useState([])
    const [birthmarkId, setBirthmarkId] = useState(`Birthmark#${Math.floor(Math.random() * 100)}`);

    const scrollViewRef = useRef(null);

    


    useEffect(() => {
        if(orderedParts[orderedPartsCounter] == "head" && gender == "female"){
            setBodyPart(bodyFemaleFront[0])
        } else if(orderedParts[orderedPartsCounter] == "chest" && gender == "female"){
            setBodyPart(bodyFemaleFront[1])
        } else if(orderedParts[orderedPartsCounter] == "left-arm" && gender == "female"){
            setBodyPart(bodyFemaleFront[2])
        }
    }, [orderedPartsCounter]);

    const handlePartClick = (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setRedDotLocation({ x: locationX, y: locationY })    
    }

        const handlePictureUpload = async() => {
        //UPLOAD PICTURE OR OPEN CAMERA
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploadedSpotPicture(result.assets[0].uri);
        }
    };  

    const BirthmarkIdGenerator = () => {
        return `Birthmark#${Math.floor(Math.random() * 100)}`
    }

    const handleNextSlug = () => {
        setOrderedPartsCounter(orderedPartsCounter + 1)
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        setProgress(progress + 0.1)
    }

    const handleMoreBirthmark = () => {
        setCurrentSlugMemory([...currentSlugMemory,
            {
                location: redDotLocation,
                id: BirthmarkIdGenerator()
            }
        ])
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }



    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>About This Analasis you will need:</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                </View>
                <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
                    <Text style={{padding:10,fontWeight:"600"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <ScrollView ref={scrollViewRef} style={{marginTop:30}}>  
                    <View 
                        style={{
                            width:"100%",
                            alignItems:"center",
                            marginBottom:30
                        }}
                    >
                        <Text 
                            style={{
                                fontWeight:"400",
                                marginTop:10,
                                padding:10,
                                backgroundColor:"lightgray",
                                alignSelf:"flex-end"
                            }}
                        >
                            Part: <Text style={{fontWeight:"600"}}>{orderedParts[orderedPartsCounter]}</Text>
                        </Text>
                        <View style={{flexDirection:"column",width:"90%",marginTop:-20}}>
                            <Text>Body Parts <Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:600}}>1/2</Text></Text>
                            <Text style={{fontSize:20,fontWeight:600}}>Where is your spot ?</Text>
                        </View>

                        <Pressable style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}} onPress={(e) => handlePartClick(e)}>
                                {dotSelectOnPart({
                                    bodyPart,
                                    redDotLocation,
                                    currentSlugMemory,
                                    gender
                                })}
                        </Pressable>

                        <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:0}}>
                            <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                                <Text>Final Step <Text style={uploadedSpotPicture == null ? {opacity:0.3}:{color:"green",fontWeight:600}}>2/2</Text></Text>
                                <Text style={{fontSize:20,fontWeight:600}}>Take a picture of your spot</Text>
                                {uploadedSpotPicture == null ? (
                                    <>
                                        <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",maxWidth:"100%",alignItems:"center",marginTop:20}}>
                                        <Image
                                            source={"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/melanoma/melanoma-skin-cancer-what-is-melanoma.jpg"}
                                            style={{width:150,height:150,borderWidth:1,borderRadius:10}}
                                        />

                                        <View style={{width:"50%",height:120,justifyContent:"space-between"}}>
                                            <Text style={{fontWeight:600,fontSize:13}}>Make sure your Image ...</Text>
                                            <Text style={{fontWeight:400,fontSize:10}}>• As clean as possible - remove all noise</Text>
                                            <Text style={{fontWeight:400,fontSize:10}} >• Lighting is simular to this image</Text>
                                            <Text style={{fontWeight:400,fontSize:10}}>• Birthmark is on the spotlight with the same ration as in this image</Text>
                                        </View>
                                        </View>
                                        <Pressable style={styles.uploadButton} onPress={handlePictureUpload}>
                                            <Text style={{color:"white"}}>Upload</Text>
                                        </Pressable>

                                    </>
                                    ):(
                                        <View style={{flexDirection:"column",width:"100%",alignItems:"center",justifyContent:"space-between",height:220}}>
                                            <Image
                                                source={{uri: uploadedSpotPicture}}
                                                style={{width:150,height:150,borderWidth:1,borderRadius:10,marginTop:20}}
                                            />
                                            <Pressable onPress={() => setUploadedSpotPicture(null)} style={{borderWidth:2,borderRadius:10,borderColor:"red"}}>
                                                <MaterialCommunityIcons
                                                    name="close"
                                                    size={30}
                                                    color="red"
                                                    style={{padding:2}}
                                                />
                                            </Pressable>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                        

                        <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:30}}>
                        {redDotLocation.x != -100 && uploadedSpotPicture != null ? (
                            <Text style={{color:"green",fontWeight:300,fontSize:10,marginBottom:10}}>2/2 - All Steps Completed</Text> 
                        ):(
                            <Text style={{fontWeight:800,opacity:0.5,fontSize:10,marginBottom:10,color:"red"}}>Not All Steps Completed</Text>
                        )}
                        <View style={{width:"100%",borderWidth:1,marginBottom:30}} />
                            <Pressable onPress={handleMoreBirthmark} style={styles.MoreSpotButton}>
                                <Text style={{padding:15,color:"white",fontWeight:"700"}}>More birthmarks on my {orderedParts[orderedPartsCounter]}</Text>
                            </Pressable>

                            <Pressable onPress={handleNextSlug} style={styles.AllSpotButton}>
                                <Text style={{padding:15,color:"black",fontWeight:"500"}}>Marked all birthmarks</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
                {isFinished == true ? (
                    <View style={{width:"100%",alignItems:"center"}}>
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton} >
                            <Text style={{padding:10,fontWeight:"600",}}>Next</Text>
                        </Pressable>
                        <Pressable onPress={() => setProgress(progress - 0.1)} style={styles.backButton}>
                            <Text style={{padding:10,fontWeight:"500",fontSize:13}}>Back</Text>
                        </Pressable>
                    </View>
                ):null
                }
            </View>
        )
    }


    return(
        <View style={styles.container}>

            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {progress == 0.1 ? 
            FirstScreen()
            : progress >= 0.2 ? 
            SecoundScreen()
            :
            null 
            }
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
        justifyContent:"space-between"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10
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
    }
})

export default MelanomaFullProcess