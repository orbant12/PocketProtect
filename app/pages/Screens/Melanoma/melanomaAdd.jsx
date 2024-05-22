
import React, {useState} from 'react';
import { Text, View, StyleSheet,Pressable ,ScrollView,Image} from 'react-native';
import Body from 'react-native-body-highlighter';
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { melanomaSpotUpload,melanomaUploadToStorage  } from '../../../server.js';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../../../context/UserAuthContext.jsx';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {app} from "../../../firebase"


const MelanomaAdd = ({route,navigaton}) => {
    const [selectedSide, setSelectedSide] = useState("front");
    const userData = route.params.data;
    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const [selectedPart, setSelectedPart] = useState([]);
    const [selectedPartOwnSlug, setSelectedPartOwnSlug] = useState([]);
    const [firstSelectedPart, setFirstSelectedPart] = useState("");
    const [selectedExportedSvg, setSelectedExportedSvg] = useState(null);
    const [selectedSlugType, setSelectedSlugType] = useState("ownSlug");
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [birthmarkId, setBirthmarkId] = useState(`Birthmark#${Math.floor(Math.random() * 100)}`);

    const { currentuser } = useAuth()
    const scale = 1;
    const functions = getFunctions(app);

    const handleSelectedPart = (even) => {
        console.log(even);
        setSelectedPart([even]);
        setFirstSelectedPart(even.slug);
    }

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
        
                {selectedPart.map(bodyPart => (
                    bodyPart.pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.slug}_${index}`} 
                                d={path}
                                fill="blue" 
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
                ))}
        
                    <Circle cx={redDotLocation.x} cy={redDotLocation.y} r="5" fill="red" />
            </Svg>
        )
    }

    const ownSelectedPart = () => {
        return (
            <View>
            {selectedPartOwnSlug.length > 0 ? (
                <View>
                    <Text>sdsds</Text>
                </View>
            ) : (
                <View style={{alignItems:"center",flexDirection:"column",justifyContent:"center",padding:20}}>
                    <Text style={{maxWidth:250,textAlign:"center"}}>You haven't uploaded your own <Text style={{fontWeight:600,fontSize:15}}>{firstSelectedPart}</Text> yet</Text>
                    <Pressable style={{marginTop:25,borderRadius:10,backgroundColor:"lightgray",width:150,alignItems:"center"}}>
                        <Text style={{color:"black",padding:15,fontWeight:500,opacity:0.6}}>Make a scan</Text>
                    </Pressable>
                </View>
            )}
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
            setFirstSelectedPart("");
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


    //const routeData = route.params.data;
    return (
        <View style={styles.container}>
        <ScrollView style={{width:"100%",height:"100%"}}>
            <View style={styles.OwnSlugAddBtn}>
                <Text style={{fontWeight:600,opacity:0.6}}>+ Use your own Body Parts</Text>
            </View>
            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                <View style={{flexDirection:"column",width:"90%",marginTop:10}}>
                    <Text>First Step <Text style={firstSelectedPart == "" ? {opacity:0.3}:{color:"green",fontWeight:600}}>1/3</Text></Text>
                    <Text style={{fontSize:20,fontWeight:600}}>Select a body part</Text>
                </View>
                <Body
                    data={[
                        { slug: `${firstSelectedPart}`, intensity: 1 },
                        ]}
                    scale={scale}
                    gender={userData.gender}
                    side={selectedSide}
                    onBodyPartPress={(e) => handleSelectedPart(e)}
                />
                    <Text>
                        <Text style={{fontWeight:600}}>Selected Part:</Text> 
                        {`${firstSelectedPart}`}
                    </Text>

                    <View style={styles.positionSwitch}>
                        <Pressable onPress={() => setSelectedSide("front")}>
                            <Text style={selectedSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                        </Pressable>
                        <Text>|</Text>
                        <Pressable onPress={() => setSelectedSide("back")}>
                            <Text style={selectedSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                        </Pressable>
                    </View>
            </View>

            <View style={{width:"100%",borderWidth:1}} />

            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                    <Text>Secound Step <Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:600}}>2/3</Text></Text>
                    <Text style={{fontSize:20,fontWeight:600}}>Where is your spot ?</Text>
                </View>
              
                    <Pressable style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}} onPress={(e) => handlePartClick(e)}>
                        
                            {selectedSlugType == "defaultSlug" ? dotSelectOnPart() : ownSelectedPart()}
                    </Pressable>

                    <View style={styles.positionSwitch}>
                        <Pressable onPress={() => setSelectedSlugType("ownSlug")}>
                            <Text style={selectedSlugType == "ownSlug" ? {fontWeight:600}:{opacity:0.5}}>Own</Text>
                        </Pressable>
                        <Text>|</Text>
                        <Pressable onPress={() => setSelectedSlugType("defaultSlug")}>
                            <Text style={selectedSlugType == "defaultSlug" ? {fontWeight:600}:{opacity:0.5}}>Default</Text>
                        </Pressable>
                    </View>
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

            <View style={{width:"100%",borderWidth:1}} />

            <View style={{width:"100%",alignItems:"center",marginBottom:20,marginTop:10}}>
                <Pressable 
                    style={
                        firstSelectedPart != "" && redDotLocation.x != -100 && uploadedSpotPicture != null ?
                        styles.saveButtonActive : styles.saveButtonInActive
                    } onPress={handleSaveSvg}>

                    <Text style={{color:"white"}}>Save</Text>
                </Pressable>
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
});

export default MelanomaAdd;