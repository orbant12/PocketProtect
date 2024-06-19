
import React, {useEffect, useState} from 'react';
import { Text, View,Pressable ,ScrollView,Image,TouchableOpacity} from 'react-native';
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/client/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import {melanomaUploadToStorage,updateSpot} from '../../../services/server.js';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavBar_SpotAdd } from '../../../components/LibaryPage/Melanoma/navBarRow';
import { spotUpdateStyle } from '../../../styles/libary_style';
import { fileUriConverterToBlob } from '../../../utils/melanoma/fileUriConverter';


const MelanomaAdd = ({ route , navigation }) => {    
    
    //<==========> VARIABLE <============>

    const skin_type = route.params.skin_type;
    const spotId = route.params.type; 
    const userData = route.params.userData    
    const bodyPart = route.params.bodyPart
    const firstSelectedPart = bodyPart.slug

    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [isScreenLoading,setIsScreenLoading ]  = useState(false)
    const { currentuser } = useAuth()    


    //<==========> Function <============>

    const handlePictureUpload = async() => {        
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

    const handleMoreBirthmark = async () => {    
        setIsScreenLoading(true)
        const ID = generateNumericalUID(4)
        const storageLocation = `users/${userData.id}/melanomaImages/${spotId.id}_updated#${ID}`;

        const uploadToStorage = async(uri) => {
            const blob = await fileUriConverterToBlob({uri})
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
            melanomaId: spotId.id,
            melanomaPictureUrl: pictureUrl,
            storage_location: storageLocation,
            risk:null,
            storage_name:`${spotId.id}_updated#${ID}`,
            created_at: new Date()
        }
        const res = await updateSpot({
            userId: currentuser.uid,
            spotId: spotId.id,
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
        setRedDotLocation({x:spotId.locationX, y:spotId.locationY})
    },[])


    //<==========> Main Return <============>
    
    return (
        <View style={spotUpdateStyle.container}>
        <ScrollView style={{width:"100%",height:"100%"}}>
            <NavBar_SpotAdd 
                navigation={navigation}
                type={spotId}
            />
            <View style={spotUpdateStyle.section}>
            <PickerSection 
                redDotLocation={redDotLocation}
                spotId={spotId}
                userData={userData}
                bodyPart={bodyPart}y
                skin_type={skin_type}
            />

            <View style={{width:"100%",borderWidth:1}} />

            <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:0}}>
                <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                    <Text>Final Step <Text style={uploadedSpotPicture == null ? {opacity:0.3}:{color:"green",fontWeight:"600"}}>3/3</Text></Text>
                    <Text style={{fontSize:20,fontWeight:"600"}}>Take a picture of your spot</Text>
                    {uploadedSpotPicture == null ? (
                        <>
                            <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",maxWidth:"100%",alignItems:"center",marginTop:20}}>
                            <Image
                                source={"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/melanoma/melanoma-skin-cancer-what-is-melanoma.jpg"}
                                style={{width:150,height:150,borderWidth:1,borderRadius:10}}
                            />
    
                            <View style={{width:"50%",height:120,justifyContent:"space-between"}}>
                                <Text style={{fontWeight:"600",fontSize:13}}>Make sure your Image ...</Text>
                                <Text style={{fontWeight:"400",fontSize:10}}>• As clean as possible - remove all noise</Text>
                                <Text style={{fontWeight:"400",fontSize:10}} >• Lighting is simular to this image</Text>
                                <Text style={{fontWeight:"400",fontSize:10}}>• Birthmark is on the spotlight with the same ration as in this image</Text>
                            </View>
                            </View>
                            <TouchableOpacity style={spotUpdateStyle.uploadButton} onPress={handlePictureUpload}>
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
                        spotUpdateStyle.saveButtonActive : spotUpdateStyle.saveButtonInActive
                    } onPress={handleMoreBirthmark}>

                    <Text style={{color:"white"}}>Save</Text>
                </TouchableOpacity>
                {firstSelectedPart != "" && redDotLocation.x != -100 && uploadedSpotPicture != null ? (
                    <Text style={{color:"green",fontWeight:"300",fontSize:10}}>3/3 - All Steps Completed</Text> 
                ):(
                    <Text style={{fontWeight:"300",opacity:0.5,fontSize:10}}>Not All Steps Completed</Text>
                )}
            </View>
            </View>
        </ScrollView>
        </View>
    )
}



export default MelanomaAdd;


const PickerSection  = ({
    spotId,
    redDotLocation,
    bodyPart,
    skin_type,
    userData
}) => {
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
                                        bodyPart.slug == "right-arm" ? `translate(-"300" -230)`
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
                                        bodyPart.slug == "right-arm" ? `translate(-"300" -230)`
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
    return(
        <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
        <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
            <Text>First Step <Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:"600"}}>1/2</Text></Text>
            <Text style={{fontSize:20,fontWeight:"600"}}>{spotId.id}</Text>
        </View>
            <View style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}}>
                {dotSelectOnPart() }
            </View>
    </View>
    )
}

