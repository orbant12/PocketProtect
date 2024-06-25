import { View,Text,ScrollView} from "react-native"
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { fetchSlugMelanomaData ,melanomaSpotUpload,melanomaUploadToStorage ,deleteSpot} from '../../../../services/server';
import LoadingOverlay from "../../../../components/Common/Loading/processing"
import { SureModal_MoleUpload } from "../../../../components/LibaryPage/Melanoma/modals";
import { CameraViewModal } from "../components/cameraModal";
import { SpotPicker } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotPicker";
import { SpotUpload, AlreadyUploadedSpots,UploadButtons } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotUpload";
import { spotUpload_2_styles } from "../../../../styles/libary_style";
import { updateCompletedParts } from "../../../../services/server";
import { useAuth } from "../../../../context/UserAuthContext";
import { NavBar_OneOption } from "../../../../components/Common/navBars";
import { BodyPart, Slug, SpotArrayData, SpotData } from "../../../../components/LibaryPage/Melanoma/BodyParts";


const MelanomaSingleSlug = ({route,navigation}) => {

    //<==============> VARTIABLES <=============> 

    //ROUTE DATA
    const progress = route.params.progress
    const bodyPartSlug : BodyPart = route.params.bodyPartSlug
    const gender = route.params.gender
    const sessionMemory: {slug:Slug}[] = route.params.completedArray
    const skinColor = route.params.skin_type
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
        const storageLocation = `users/${currentuser.uid}/melanomaImages/${ID}`;
        setIsScreenLoading(true)
        try{
            const uploadToStorage = async(uri:string) => {
                const blob: Blob = await new Promise((resolve, reject) => {
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
                userId: currentuser.uid,
                melanomaDocument: {spot: [bodyPartSlug], location: redDotLocation},
                gender: gender,
                melanomaPictureUrl: pictureUrl,
                spotId: ID,
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

    const handleMarkeAsComplete = async (action:"add" | "remove") => {
        let updatedSessionMemory: {slug:Slug}[];

        if (action === "add" || action === "remove") {
            updatedSessionMemory = [...sessionMemory];

            if (action === "add") {
                updatedSessionMemory.push({ slug: bodyPartSlug.slug });
            } else if (action === "remove") {
                updatedSessionMemory = updatedSessionMemory.filter(item => item.slug !== bodyPartSlug.slug);
            }
            await updateCompletedParts({
                userId:currentuser.uid,
                completedArray:updatedSessionMemory
            })
            navigation.goBack()
            
        }
    }

    const fetchSlugSpots = async () =>{
        const response = await fetchSlugMelanomaData({
            userId: currentuser.uid,
            gender,
            slug: bodyPartSlug.slug
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

    const isThisPartCompleted = async (sessionMemory:{slug:Slug}[]) => {
        if( sessionMemory != null ){
            const isCompleted = sessionMemory.some((session) => session.slug === bodyPartSlug.slug);
            setMarkedAsComplete(!isCompleted);
        }
    }

    function generateNumericalUID(lengt:number) {
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
            userId:currentuser.uid,
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
            <View style={spotUpload_2_styles.startScreen}>
                <ScrollView ref={scrollViewRef} style={progress != null && {marginTop:30}} showsVerticalScrollIndicator={false}>  
                <NavBar_OneOption 
                    icon_left={{name:"arrow-left",size:25, action:() => navigation.goBack()}}
                    title={bodyPartSlug.slug}
                />
                {progress != null &&
                <View style={spotUpload_2_styles.ProgressBar}>
                    <ProgressBar progress={progress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                </View>
                }
                    <View style={{width:"100%",alignItems:"center",marginBottom:30,marginTop:35}} >
                        <SpotPicker 
                            redDotLocation={redDotLocation}
                            setRedDotLocation={setRedDotLocation}
                            bodyPart={bodyPartSlug}
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


