import { View,Text,ScrollView} from "react-native"
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { fetchSlugMelanomaData ,melanomaSpotUpload,melanomaUploadToStorage ,deleteSpot} from '../../../../services/server.js';
import LoadingOverlay from "../../../../components/Common/Loading/processing.jsx"
import { SureModal_MoleUpload } from "../../../../components/LibaryPage/Melanoma/modals.jsx";
import { CameraViewModal } from "../components/cameraModal.jsx";
import { SpotPicker } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotPicker.jsx";
import { SpotUpload, AlreadyUploadedSpots,UploadButtons } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotUpload.jsx";
import { spotUpload_2_styles } from "../../../../styles/libary_style.jsx";
import { updateCompletedParts } from "../../../../services/server.js";
import { useAuth } from "../../../../context/UserAuthContext.jsx";

const MelanomaSingleSlug = ({route,navigation}) => {

    //<==============> VARTIABLES <=============> 

    //ROUTE DATA
    const progress = route.params.progress
    const bodyPart = route.params.data
    const gender = route.params.gender
    const sessionMemory = route.params.sessionMemory
    const currentuserUID = route.params.userId
    const skinColor = route.params.skinColor
    const { currentuser } = useAuth()
    //Add Melanoma Data
    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    //Slug Birthmark Data
    const [currentSlugMemory, setCurrentSlugMemory ] = useState([])
    const [highlighted, setHighlighted] = useState("")
    //Toggles
    const [markedAsComplete ,setMarkedAsComplete] = useState(false)
    const [isScreenLoading,setIsScreenLoading ]  = useState(false)
    const [isModalUp, setIsModalUp] = useState(false)
    const [moleToDeleteId,setMoleToDeleteId] = useState("")
    //Ref for Top Animation
    const scrollViewRef = useRef(null);    
    const [isCameraOverlayVisible, setIsCameraOverlayVisible] = useState(false);


    //<==============> Functions <=============> 

    const handleMoreBirthmark = async () => {
        const BirthmarkIdGenerator = () => {
            return `Birthmark#${generateNumericalUID(4)}`
        }
        const ID =  BirthmarkIdGenerator()
        const storageLocation = `users/${currentuserUID}/melanomaImages/${ID}`;
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
                    userId: currentuserUID,
                    birthmarkId: ID,
                    storageLocation: storageLocation,
                })
                return response;
            }

            const pictureUrl = await uploadToStorage(uploadedSpotPicture);

            const res = await melanomaSpotUpload({
                userId: currentuserUID,
                melanomaDocument: {"spot": [bodyPart], "location": redDotLocation},
                gender: gender,
                melanomaPictureUrl: pictureUrl,
                birthmarkId: ID,
                storageLocation: storageLocation,
                risk:null,
                storage_name: ID,
                created_at: new Date()
            })
            if (res == true) {
                setIsScreenLoading(false)
                setRedDotLocation({ x: -100, y: 10 });
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });                
                setUploadedSpotPicture(null)
                setCurrentSlugMemory([...currentSlugMemory,
                    {
                        location: redDotLocation,
                        id: ID,
                        picture: pictureUrl,
                    }
                ])
            }
        } catch {
            alert("Something went wrong !")
        }
    }

    const handleMarkeAsComplete = async (action) => {
        let updatedSessionMemory;

        if (action === "add" || action === "remove") {
            updatedSessionMemory = [...sessionMemory];

            if (action === "add") {
                updatedSessionMemory.push({ slug: bodyPart.slug });
            } else if (action === "remove") {
                updatedSessionMemory = updatedSessionMemory.filter(item => item.slug !== bodyPart.slug);
            }
            if(progress != null){
                navigation.navigate("FullMelanomaProcess", { sessionMemory: updatedSessionMemory });
            } else {
                await updateCompletedParts({
                    userId:currentuser.uid,
                    completedArray:updatedSessionMemory
                })
                navigation.goBack()
            }
        }
    }

    const fetchSlugSpots = async () =>{
        const response = await fetchSlugMelanomaData({
            userId: currentuserUID,
            gender,
            slug: bodyPart.slug
        })

        const format = response.map((data) =>{
            return {
                location: data.melanomaDoc.location,
                id: data.melanomaId,
                picture: data.melanomaPictureUrl
            }
        })

        setCurrentSlugMemory(format)
    }

    const isThisPartCompleted = async (sessionMemory) => {
        const isCompleted = sessionMemory.some((session) => session.slug === bodyPart.slug);
        setMarkedAsComplete(!isCompleted);
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

    const handleSpotDelete = async (id) => {
        const response = await deleteSpot({
            userId:currentuserUID,
            spotId: id
        })
        if( response.firestore.success == true && response.storage.success == true){
            alert("Mole Deleted Sucessfully !")
            fetchSlugSpots()
            setHighlighted("")
            setMoleToDeleteId("")
            setIsModalUp(!isModalUp)
        } else if ( response.firestore.success != true || response.storage.success != true) {
            alert("Deletion failed ...")
        }
    }

    const toggleCameraOverlay = () => {
        setIsCameraOverlayVisible(!isCameraOverlayVisible);
    };
    
    useEffect(() => {
        fetchSlugSpots()
        isThisPartCompleted(sessionMemory)
    },[])


    //<==============> Main Component Return <=============> 

    return(
        <View style={spotUpload_2_styles.container}>
            {progress != null &&
                <View style={spotUpload_2_styles.ProgressBar}>
                    <ProgressBar progress={progress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                </View>
            }
            <View style={spotUpload_2_styles.startScreen}>
                <ScrollView ref={scrollViewRef} style={progress != null && {marginTop:30}} showsVerticalScrollIndicator={false}>  
                    <View style={{width:"100%",alignItems:"center",marginBottom:30}} >
                        <PartLabelBox 
                            bodyPart={bodyPart}
                        /> 

                        <SpotPicker 
                            redDotLocation={redDotLocation}
                            setRedDotLocation={setRedDotLocation}
                            bodyPart={bodyPart}
                            highlighted={highlighted}
                            skinColor={skinColor}
                            gender={gender}
                            currentSlugMemory={currentSlugMemory}
                        />

                        <SpotUpload 
                            highlighted={highlighted}                                                                                    
                            setUploadedSpotPicture={setUploadedSpotPicture}
                            uploadedSpotPicture={uploadedSpotPicture}                                                    
                            toggleCameraOverlay={toggleCameraOverlay}         
                        />

                        <AlreadyUploadedSpots
                            isModalUp={isModalUp}
                            setMoleToDeleteId={setMoleToDeleteId}
                            setIsModalUp={setIsModalUp}
                            setHighlighted={setHighlighted}
                            highlighted={highlighted}
                            currentSlugMemory={currentSlugMemory}
                            scrollViewRef={scrollViewRef}
                        />

                        <UploadButtons 
                            handleMarkeAsComplete={handleMarkeAsComplete}
                            handleMoreBirthmark={handleMoreBirthmark}
                            markedAsComplete={markedAsComplete}
                            redDotLocation={redDotLocation}
                            uploadedSpotPicture={uploadedSpotPicture}
                        />
                    </View>
                </ScrollView>
                <CameraViewModal 
                    isCameraOverlayVisible={isCameraOverlayVisible}
                    setUploadedSpotPicture={setUploadedSpotPicture}
                    toggleCameraOverlay={toggleCameraOverlay}
                />
            </View>
            <LoadingOverlay 
                visible={isScreenLoading}
            />  
            <SureModal_MoleUpload 
                visible={isModalUp}
                setIsModalUp={setIsModalUp}
                moleToDeleteId={moleToDeleteId}
                handleSpotDelete={handleSpotDelete}
            />
        </View>
    )
}

export default MelanomaSingleSlug


const PartLabelBox = ({
    bodyPart
}) => {
    return(
        <Text 
        style={{
            fontWeight:"400",
            marginTop:10,
            padding:10,
            backgroundColor:"lightgray",
            alignSelf:"flex-end"
        }}
    >
        Part: <Text style={{fontWeight:"600"}}>{bodyPart.slug}</Text>
    </Text>
    )
}


