
import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet,Pressable ,ScrollView,Image,TouchableOpacity} from 'react-native';
import Body from "../../../components/BodyParts/index";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { melanomaSpotUpload,melanomaUploadToStorage,updateSpot  } from '../../../server.js';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../../../context/UserAuthContext.jsx';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {app} from "../../../firebase"



const MelanomaAdd = ({ route , navigation }) => {     
 
    const skin_type = route.params.skin_type;
    const addType = route.params.type;
    const userData = route.params.userData    
    const bodyPart = route.params.bodyPart
    const firstSelectedPart = bodyPart.slug

    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [birthmarkId, setBirthmarkId] = useState(`Birthmark#${Math.floor(Math.random() * 100)}`);
    const [isScreenLoading,setIsScreenLoading ]  = useState(false)

    const { currentuser } = useAuth()    
    const functions = getFunctions(app);


    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
        
                {
                    bodyPart.pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.slug}_${index}`} 
                                d={path}
                                fill={skin_type == 0 ? "#fde3ce" : skin_type == 1 ? "#fbc79d" : skin_type == 2 ? "#934506" : skin_type == 3 ? "#311702":null}
                                stroke={bodyPart.color} 
                                strokeWidth="2"
                                rotation={
                                    bodyPart.slug == "right-arm" ? "-20"
                                    :
                                    bodyPart.slug == "left-arm" ? "20"
                                    :
                                    bodyPart.slug == "right-arm(back)" ? "-20"
                                    :
                                    bodyPart.slug == "left-arm(back)" ? "20"
                                    :
                                    null
                                }
                                transform={
                                    userData.gender == "male" ? (
                                        bodyPart.slug == "chest" ? `translate(-180 -270)` 
                                        :
                                        bodyPart.slug == "head" ? `translate(-140 -70)`
                                        :
                                        bodyPart.slug == "legs" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "torso" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "feet" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "abs" ? `translate(-60 -390)`
                                        :
                                        bodyPart.slug == "left-hand" ? `translate(40 -670)`
                                        :
                                        bodyPart.slug == "right-hand" ? `translate(-480 -670)`
                                        :
                                        bodyPart.slug == "left-arm" ? `translate(120 -420)`
                                        :
                                        bodyPart.slug == "right-arm" ? `translate(-300 -230)`
                                        :
                                        bodyPart.slug == "upper-leg-left" ? `translate(0 -650)`
                                        :
                                        bodyPart.slug == "upper-leg-right" ? `translate(-170 -650)`
                                        :
                                        bodyPart.slug == "lower-leg-left" ? `translate(-20 -950)`
                                        :
                                        bodyPart.slug == "lower-leg-right" ? `translate(-170 -950)`
                                        :
                                        bodyPart.slug == "left-feet" ? `translate(-130 -1200)`
                                        :
                                        bodyPart.slug == "right-feet" ? `translate(-290 -1200)`
                                        :
                                        //BACK
                                        bodyPart.slug == "head(back)" ? `translate(-860 -80)`
                                        :
                                        bodyPart.slug == "back" ? `translate(-800 -290)`
                                        :
                                        bodyPart.slug == "left-arm(back)" ? `translate(-600 -430)`
                                        :
                                        bodyPart.slug == "right-arm(back)" ? `translate(-1000 -230)`
                                        :
                                        bodyPart.slug == "gluteal" ? `translate(-900 -590)`
                                        :
                                        bodyPart.slug == "right-palm" ? `translate(-1190 -675)`
                                        :
                                        bodyPart.slug == "left-palm" ? `translate(-680 -670)`
                                        :
                                        bodyPart.slug == "left-leg(back)" ? `translate(-550 -750)`
                                        :
                                        bodyPart.slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.slug == "left-feet(back)" ? `translate(-840 -1230)`
                                        :
                                        bodyPart.slug == "right-feet(back)" ? `translate(-1000 -1230)`
                                        :
                                        null
                                        ):(
                                        bodyPart.slug == "chest" ? `translate(-145 -270)` 
                                        :
                                        bodyPart.slug == "head" ? `translate(-50 -10)`
                                        :
                                        bodyPart.slug == "legs" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "torso" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "feet" ? `translate(-140 -100)`
                                        :
                                        bodyPart.slug == "abs" ? `translate(-20 -380)`
                                        :
                                        bodyPart.slug == "left-hand" ? `translate(100 -630)`
                                        :
                                        bodyPart.slug == "right-hand" ? `translate(-460 -640)`
                                        :
                                        bodyPart.slug == "left-arm" ? `translate(180 -420)`
                                        :
                                        bodyPart.slug == "right-arm" ? `translate(-300 -230)`
                                        :
                                        bodyPart.slug == "upper-leg-left" ? `translate(0 -650)`
                                        :
                                        bodyPart.slug == "upper-leg-right" ? `translate(-110 -650)`
                                        :
                                        bodyPart.slug == "lower-leg-left" ? `translate(-20 -950)`
                                        :
                                        bodyPart.slug == "lower-leg-right" ? `translate(-120 -950)`
                                        :
                                        bodyPart.slug == "left-feet" ? `translate(-130 -1280)`
                                        :
                                        bodyPart.slug == "right-feet" ? `translate(-220 -1280)`
                                        :
                                        //BACK
                                        bodyPart.slug == "head(back)" ? `translate(-900 -30)`
                                        :
                                        bodyPart.slug == "back" ? `translate(-850 -280)`
                                        :
                                        bodyPart.slug == "left-arm(back)" ? `translate(-650 -450)`
                                        :
                                        bodyPart.slug == "right-arm(back)" ? `translate(-1100 -230)`
                                        :
                                        bodyPart.slug == "gluteal" ? `translate(-960 -590)`
                                        :
                                        bodyPart.slug == "right-palm" ? `translate(-1270 -620)`
                                        :
                                        bodyPart.slug == "left-palm" ? `translate(-730 -630)`
                                        :
                                        bodyPart.slug == "left-leg(back)" ? `translate(-600 -750)`
                                        :
                                        bodyPart.slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.slug == "left-feet(back)" ? `translate(-940 -1330)`
                                        :
                                        bodyPart.slug == "right-feet(back)" ? `translate(-1050 -1330)`
                                        
                                        :null
                                        )
                                }
                                scale={
                                    userData.gender == "male" ? (
                                        bodyPart.slug == "left-hand" ? "1.3" 
                                        : 
                                        bodyPart.slug == "right-hand" ? "1.3"
                                        :
                                        bodyPart.slug == "chest" ? "1" 
                                        :
                                        bodyPart.slug == "head" ? "0.8"
                                        :
                                        bodyPart.slug == "legs" ? "0.8"
                                        :
                                        bodyPart.slug == "torso" ? "0.8"
                                        :
                                        bodyPart.slug == "feet" ? "0.8"
                                        :
                                        bodyPart.slug == "abs" ? "0.6"
                                        :
                                        bodyPart.slug == "left-arm" ? "0.6"
                                        :
                                        bodyPart.slug == "right-arm" ? "0.6"
                                        :
                                        bodyPart.slug == "upper-leg-left" ? "0.65"
                                        :
                                        bodyPart.slug == "upper-leg-right" ? "0.65"
                                        :
                                        bodyPart.slug == "lower-leg-left" ? "0.7"
                                        :
                                        bodyPart.slug == "lower-leg-right" ? "0.7"
                                        :
                                        bodyPart.slug == "left-feet" ? "1.2"
                                        :
                                        bodyPart.slug == "right-feet" ? "1.2 "
                                        :
                                        //BACK
                                        bodyPart.slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.slug == "back" ? "0.6"
                                        :
                                        bodyPart.slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.slug == "gluteal" ? "1"
                                        :
                                        bodyPart.slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.slug == "right-feet(back)" ? "1.2"
                                        :
                                        null):(
                                        bodyPart.slug == "left-hand" ? "1.3" 
                                        : 
                                        bodyPart.slug == "right-hand" ? "1.3"
                                        :
                                        bodyPart.slug == "chest" ? "1" 
                                        :
                                        bodyPart.slug == "head" ? "0.65"
                                        :
                                        bodyPart.slug == "legs" ? "0.8"
                                        :
                                        bodyPart.slug == "torso" ? "0.8"
                                        :
                                        bodyPart.slug == "feet" ? "0.8"
                                        :
                                        bodyPart.slug == "abs" ? "0.6"
                                        :
                                        bodyPart.slug == "left-arm" ? "0.6"
                                        :
                                        bodyPart.slug == "right-arm" ? "0.6"
                                        :
                                        bodyPart.slug == "upper-leg-left" ? "0.65"
                                        :
                                        bodyPart.slug == "upper-leg-right" ? "0.65"
                                        :
                                        bodyPart.slug == "lower-leg-left" ? "0.7"
                                        :
                                        bodyPart.slug == "lower-leg-right" ? "0.7"
                                        :
                                        bodyPart.slug == "left-feet" ? "1.2"
                                        :
                                        bodyPart.slug == "right-feet" ? "1.2 "
                                        :
                                        //BACK
                                        bodyPart.slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.slug == "back" ? "0.6"
                                        :
                                        bodyPart.slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.slug == "gluteal" ? "1"
                                        :
                                        bodyPart.slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.slug == "right-feet(back)" ? "1.2"
                                        :
                                        null)
                                }
                                
                            />
                    ))
                }
        
                    <Circle cx={redDotLocation.x} cy={redDotLocation.y} r="5" fill="red" />
            </Svg>
        )
    }


    const ownSelectedPart = () => {
        return (
                <View style={{alignItems:"center",flexDirection:"column",justifyContent:"center",padding:20}}>
                    <Text style={{maxWidth:250,textAlign:"center",fontWeight:"600",opacity:0.6}}>You haven't selected a body part yet</Text>
                    <Pressable style={{marginTop:25,borderRadius:10,backgroundColor:"lightgray",width:150,alignItems:"center"}}>
                        <Text style={{color:"black",padding:15,fontWeight:500,opacity:0.6}}>Select a slug first</Text>
                    </Pressable>
                </View>
        )
    }

    const handlePartClick = (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setRedDotLocation({ x: locationX, y: locationY })    
    }

    const handleSaveSvg = async() => {
        const storageLocation = `users/${currentuser.uid}/melanomaImages/${birthmarkId}`;

        const uploadToStorage = async(uri) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                  console.log(e);
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });
            const response = await melanomaUploadToStorage({
                melanomaPicFile: blob,
                userId: currentuser.uid,
                birthmarkId: birthmarkId,
                storageLocation: storageLocation,
            })
            return response;
        }
                
        const blobToBase64 = (blob) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get only the base64 part
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };
                                
        const evaluate = async (photo) => {
            const generatePrediction = httpsCallable(functions, 'predict');
            try {
                // Fetch the image from the URL
                const response = await fetch(photo);
                if (!response.ok) throw new Error('Failed to fetch image');
        
                // Convert the response to a Blob
                const blob = await response.blob();
        
                // Convert blob to base64
                const base64String = await blobToBase64(blob);
        
                // Send the base64 encoded JPEG string to the Firebase function
                const result = await generatePrediction({ input: base64String });
                
                console.log('Prediction result:', result.data);
                return result.data
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const pictureUrl = await uploadToStorage(uploadedSpotPicture);
        const rate = await evaluate(pictureUrl)
        const res = await melanomaSpotUpload({
            userId: currentuser.uid,
            melanomaDocument: {"spot": selectedPart, "location": redDotLocation},
            gender: userData.gender,
            melanomaPictureUrl: pictureUrl,
            birthmarkId: birthmarkId,
            storageLocation: storageLocation,
            risk:rate
        })
        if (res == true) {
            //NAVIGATE BACK
            alert("Melanoma spot saved successfully");            
            setRedDotLocation({ x: -100, y: 10 });
            setUploadedSpotPicture(null);
            setBirthmarkId(`Birthmark#${Math.floor(Math.random() * 100)}`);
            navigaton.goBack()
        }
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

    function formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    const handleMoreBirthmark = async () => {
        const today = new Date();
        if(addType == "new"){
            const BirthmarkIdGenerator = () => {
                return `Birthmark#${generateNumericalUID(4)}`
            }
            const ID =  BirthmarkIdGenerator()
            const storageLocation = `users/${userData.id}/melanomaImages/${ID}`;
            setIsScreenLoading(true)
            try{
                const uploadToStorage = async(uri) => {
                    const blob = await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            resolve(xhr.response);
                        };
                        xhr.onerror = function (e) {
                            console.log(e);
                            reject(new TypeError("Network request failed"));
                        };
                        xhr.responseType = "blob";
                        xhr.open("GET", uri, true);
                        xhr.send(null);
                    });
                    const response = await melanomaUploadToStorage({
                        melanomaPicFile: blob,                           
                        storageLocation: storageLocation,
                    })
                    return response;
                }
    
                const pictureUrl = await uploadToStorage(uploadedSpotPicture);
    
                const res = await melanomaSpotUpload({
                    userId: userData.id,
                    melanomaDocument: {"spot": [bodyPart], "location": redDotLocation},
                    gender: userData.gender,        
                    birthmarkId: ID,
                    melanomaPictureUrl: pictureUrl,
                    storageLocation: storageLocation,
                    risk:0,
                    storage_name: ID,
                    created_at:new Date(),
                })
                if (res == true) {
                    setIsScreenLoading(false)
                    setRedDotLocation({ x: -100, y: 10 });                             
                    setUploadedSpotPicture(null)     
                    navigation.goBack()           
                }
            } catch (err) {
                alert(err)
                console.log(err)
            }
        } else {
            setIsScreenLoading(true)
            const ID = generateNumericalUID(4)
            const storageLocation = `users/${userData.id}/melanomaImages/${addType.id}_updated#${ID}`;
            const uploadToStorage = async(uri) => {
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function (e) {
                        console.log(e);
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", uri, true);
                    xhr.send(null);
                });
                const response = await melanomaUploadToStorage({
                    melanomaPicFile: blob,                           
                    storageLocation: storageLocation,
                })
                return response;
            }

            const pictureUrl = await uploadToStorage(uploadedSpotPicture);
            const data = {
                melanomaDoc: {"spot": [bodyPart], "location": redDotLocation},
                gender: userData.gender,        
                melanomaId: addType.id,
                melanomaPictureUrl: pictureUrl,
                storage_location: storageLocation,
                risk:0,
                storage_name:`${addType.id}_updated#${ID}`,
                created_at: new Date()
            }
            const res = await updateSpot({
                userId: currentuser.uid,
                spotId: addType.id,
                data: data,                
            })
            if (res == true){
                setIsScreenLoading(false)
                setRedDotLocation({ x: -100, y: 10 });                             
                setUploadedSpotPicture(null)     
                navigation.goBack()   
            } else {

            }
        }

    }
    
    function generateNumericalUID(length) {
        if (length <= 0) {
            throw new Error("Length must be a positive integer.");
        }
    
        let uid = '';
        for (let i = 0; i < length; i++) {
            uid += Math.floor(Math.random() * 10).toString();
        }
        return uid;
    }

    useEffect(() => {
        if(addType != "new"){
            setRedDotLocation({x:addType.locationX, y:addType.locationY})
        }
    },[])


    
    return (
        <View style={styles.container}>
        <ScrollView style={{width:"100%",height:"100%"}}>
            <View style={styles.OwnSlugAddBtn}>
                <Text style={{fontWeight:600,opacity:0.6}}>+ Use your own Body Parts</Text>
            </View>
            
            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                    <Text>First Step <Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:600}}>1/2</Text></Text>
                    {addType == "new" ? <Text style={{fontSize:20,fontWeight:600}}>Where is your spot ?</Text> : <Text style={{fontSize:20,fontWeight:600}}>{addType.id}</Text> }
                </View>
                {addType == "new" ?
                    <Pressable style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}} onPress={(e) => handlePartClick(e)}>                        
                        {dotSelectOnPart() }
                    </Pressable> 
                    :
                    <View style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}}>
                        {dotSelectOnPart() }
                    </View>
                }
            </View>

            <View style={{width:"100%",borderWidth:1}} />

            <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:0}}>
                <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                    <Text>Final Step <Text style={uploadedSpotPicture == null ? {opacity:0.3}:{color:"green",fontWeight:600}}>3/3</Text></Text>
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
                            <TouchableOpacity style={styles.uploadButton} onPress={handlePictureUpload}>
                                <Text style={{color:"white"}}>Upload</Text>
                            </TouchableOpacity>
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

            <View style={{width:"100%",borderWidth:1}} />

            <View style={{width:"100%",alignItems:"center",marginBottom:20,marginTop:10}}>
                <TouchableOpacity
                    style={
                        firstSelectedPart != "" && redDotLocation.x != -100 && uploadedSpotPicture != null ?
                        styles.saveButtonActive : styles.saveButtonInActive
                    } onPress={handleMoreBirthmark}>

                    <Text style={{color:"white"}}>Save</Text>
                </TouchableOpacity>
                {firstSelectedPart != "" && redDotLocation.x != -100 && uploadedSpotPicture != null ? (
                    <Text style={{color:"green",fontWeight:300,fontSize:10}}>3/3 - All Steps Completed</Text> 
                ):(
                    <Text style={{fontWeight:300,opacity:0.5,fontSize:10}}>Not All Steps Completed</Text>
                )}
         
            </View>

        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: 'white',
        width: '100%',
    },
    saveButtonActive: {
        backgroundColor: 'black',
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
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        marginTop: 30,
        marginBottom:30,
        borderColor:"#FF99FF",
        borderWidth:2
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
        marginBottom: 0,
        marginLeft:"auto",
        marginRight:"auto",
    },
});

export default MelanomaAdd;