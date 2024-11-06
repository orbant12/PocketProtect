import { View,Text,ScrollView} from "react-native"
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { melanomaSpotUpload,deleteSpot, checkUniqueBirthmarkId} from '../../../../services/server';
import { SureModal_MoleUpload } from "../../../../components/LibaryPage/Melanoma/modals";
import { CameraViewModal } from "../components/cameraModal";
import { SpotPicker } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotPicker";
import { SpotUpload, AlreadyUploadedSpots,UploadButtons } from "../../../../components/LibaryPage/Melanoma/SpotUpload/spotUpload";
import { spotUpload_2_styles } from "../../../../styles/libary_style";
import { useAuth } from "../../../../context/UserAuthContext";
import { NavBar_OneOption } from "../../../../components/Common/navBars";
import { BodyPart, Gender, SkinType, Slug, SpotArrayData } from "../../../../utils/types";
import { Progress } from "../../../../navigation/navigation";
import { location } from "../melanomaAdd";
import { SuccessAnimationSheet } from "../../../../components/Common/AnimationSheets/successAnimatedSheet";
import { convertImageToBase64 } from "../../../../utils/imageConvert";



export type ClientMemory_Spots = {
    location: {x:number,y:number},
    id:string,
    picture:string
}

const MelanomaSingleSlug = ({route,navigation}) => {

    //<==============> VARTIABLES <=============> 
    const { currentuser, melanoma } = useAuth()
    //ROUTE DATA
    const progress: Progress = route.params.progress
    const bodyPartSlug : SpotArrayData = route.params.bodyPartSlug
    const sessionMemory: {slug:Slug}[] = route.params.completedArray
    const skinColor:SkinType = melanoma.getSkinType()
    
    
    const [redDotLocation, setRedDotLocation] = useState<location>({ x: -100, y: 10 });
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState<string | null>(null);
    const [currentSlugMemory, setCurrentSlugMemory ] = useState<ClientMemory_Spots[]>([])
    const [highlighted, setHighlighted] = useState<string | null>(null)
    const [markedAsComplete ,setMarkedAsComplete] = useState<boolean>(false)
    const [isScreenLoading,setIsScreenLoading ]  = useState<boolean | string>(false)
    const [isModalUp, setIsModalUp] = useState<boolean>(false)
    const [moleToDeleteId,setMoleToDeleteId] = useState<string | "">("")
    const [isCameraOverlayVisible, setIsCameraOverlayVisible] = useState<boolean>(false);
    const [isStateModalActive, setIsStateModalActive] = useState<boolean>(false);


    const scrollViewRef = useRef(null);   

    //<==============> Functions <=============> 

    const handleMoreBirthmark = async () => {
        const BirthmarkIdGenerator = async () => {
            const pendingUID = `Birthmark#${generateNumericalUID(4)}`
            const response = await checkUniqueBirthmarkId({
                pendingUID: pendingUID,
                userId: currentuser.uid
            })
            if (response == false) {
                return pendingUID
            } else {
                return await BirthmarkIdGenerator()
            }
        }
        const ID =  await BirthmarkIdGenerator()

        const storageLocation = `users/${currentuser.uid}/melanomaImages/${ID}`;
        setIsScreenLoading(true)
        setIsStateModalActive(true)
        try{
       
            

            const pictureUrl = await convertImageToBase64(uploadedSpotPicture);

            const res = await melanoma.melanomaSpotUpload({
                userId: currentuser.uid,
                melanomaDocument: {spot: bodyPartSlug, location: redDotLocation},
                gender: currentuser.gender,
                melanomaPictureUrl: "",
                melanomaBlob: pictureUrl,
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
                        picture: uploadedSpotPicture,
                    }
                ])
            } else {
                setIsScreenLoading("Failed to connect to the server, please try again later !")
            }
        } catch(err) {
            alert("Something went wrong !")
            setIsScreenLoading(String(err))
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
            await melanoma.updateCompletedParts(updatedSessionMemory)
            navigation.goBack()
            
        }
    }

    const fetchSlugSpots = async () =>{
        const response = await melanoma.getMelanomaDataBySlug(bodyPartSlug.slug)

        const format = response.map((data,index) =>{
            return {
                location: data.melanomaDoc.location,
                id: data.melanomaId,
                picture: data.melanomaPictureUrl,
                key: index,
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

    function generateNumericalUID(length:number) {
        if (length <= 0) {
            throw new Error("Length must be a positive integer.");
        }
    
        let uid = '';
        for (let i = 0; i < length; i++) {
            uid += Math.floor(Math.random() * 10).toString();
        }
        return uid;
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
                <ScrollView ref={scrollViewRef}  style={[progress != null && {marginTop:30},{width:"100%",height:"100%"}]} showsVerticalScrollIndicator={false}>  
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
                            gender={currentuser.gender}
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
                            navigation={navigation}
                            skin_type={skinColor}
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
            {/* <LoadingOverlay 
                visible={isScreenLoading}
            />   */}
            {/* <SureModal_MoleUpload 
                visible={isModalUp}
                setIsModalUp={setIsModalUp}
                moleToDeleteId={moleToDeleteId}
                handleSpotDelete={handleSpotDelete}
            /> */}
            <SuccessAnimationSheet
                active={isStateModalActive}
                loading={isScreenLoading}
                setActive={setIsStateModalActive}
            />
        </View>
    )
}

export default MelanomaSingleSlug


const PartLabelBox = ({
    bodyPart
}:
{
    bodyPart:BodyPart

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


