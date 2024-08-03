import { View,Text,StyleSheet,Pressable,Image,ScrollView,TouchableOpacity,PixelRatio,Dimensions, Modal } from "react-native"
import React, {useState,useEffect,useCallback} from "react";
import { useAuth } from "../../../../context/UserAuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { melanomaMetaDataUpload, updateCompletedParts, fetchCompletedParts } from "../../../../services/server"
import { useFocusEffect } from '@react-navigation/native';
import { decodeParts } from "../../../../utils/melanoma/decodeParts";
import {Slug } from "../../../../utils/types";
import { MelanomaMetaData } from "../melanomaCenter";
import { styles_shadow } from "../../../../styles/shadow_styles";
import { Assist_Onboard } from "../../../../components/AddPage/onBoardings/assistantBoard";
import { ProgressRow } from "../../../../components/ExplainPages/explainPage";
import { FirstScreen } from "./Fullprocess/welcome_full";
import { FactScreen } from "./Fullprocess/dlFact_full";
import { SkinBurnScreen } from "./Fullprocess/burnInput";
import { SkinTypeScreen } from "./Fullprocess/skinSelect";
import { FamilyTreeScreen } from "./Fullprocess/family_full";
import { AlertScreen } from "./Fullprocess/checkPoint";
import { ThirdScreen } from "./Fullprocess/frontBody_full";
import { FourthScreen } from "./Fullprocess/backBody_full";
import { FifthScreen } from "./Fullprocess/final_full";

const { width } = Dimensions.get('window');
const scaleFactor = width < 380 ? 1 : 1.2;

type CompletedParts_Array = {slug:Slug}[]

const responsiveFontSize = (size:number) => {
    return size * PixelRatio.getFontScale();
};

const MelanomaFullProcess = ({navigation}) => {

    //<===============> Variables  <===============> 
    const alertTeam  = Image.resolveAssetSource(require('../../../../assets/skinburn/5.png')).uri;
    
    const {currentuser} = useAuth()
    //Progress Trackers
    const [progress, setProgress] = useState(0.1)
    const [bodyProgress, setBodyProgress] = useState(1)
    const [bodyProgressBack, setBodyProgressBack] = useState(0)

    const [ infoModal, setInfoModal] = useState<null | "assist">(null)
    //Body for Birthmark
    const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [completedParts, setCompletedParts] = useState<CompletedParts_Array>([])
    const [isModalUp, setIsModalUp] = useState<boolean>(false)
    const [ melanomaMetaData, setMelanomaMetaData] = useState<MelanomaMetaData>({
        sunburn:[{
            stage:0,
            slug:"" as Slug
        }],
        skin_type: null,
        detected_relative:"none",

    })

    //SKIN BURN
    const [haveBeenBurned, setHaveBeenBurned] = useState(false)
    const [selectedBurnSide, setSelectedBurnSide] = useState<"front" | "back">("front")

    const frontParts = [
        "abs",
        "head",
        "left-arm",
        "right-arm",
        "chest",
        "upper-leg-right",
        "upper-leg-left",
        "lower-leg-right",
        "lower-leg-left",
        "left-feet",
        "right-feet",
        "right-hand",
        "left-hand",
    ]; // 13

    const backParts = [
        "back",
        "head(back)",
        "left-arm(back)",
        "right-arm(back)",
        "left-leg(back)",
        "right-leg(back)",
        "left-feet(back)",
        "right-feet(back)",
        "right-palm",
        "left-palm",
        "gluteal",
    ]; // 11
    

//<===============> Functions  <===============> 


    const completedArea = async (sessionMemory: CompletedParts_Array) => {
        setCompletedAreaMarker([]);
    
        let response;
        let totalParts;
    
        if (round(progress, 1) === 0.7) {
            // Filtering front parts
            response = sessionMemory.filter(data => frontParts.includes(data.slug))
            totalParts = 13;
        } else if (round(progress, 1) === 0.8) {
            // Filtering back parts
            response = sessionMemory.filter(data => backParts.includes(data.slug))
            totalParts = 11;
        }
    
        if (response) {
            setCompletedAreaMarker(response.map((data, index) => ({
                slug: data.slug,
                intensity: 0,
                key: index
            })));
            const progressFraction = response.length / totalParts;
            if (totalParts === 13) {
                setBodyProgress(progressFraction);
            } else if (totalParts === 11) {
                setBodyProgressBack(progressFraction);
            }
        }
        return sessionMemory  
    };

    const updateCompletedSlug = async (completedArray:CompletedParts_Array) => {
        if(currentuser){
            const response = await updateCompletedParts({
                userId:currentuser.uid,
                completedArray
            })
            if (response != true){
                alert("something went wrong")
            }
        }
    }

    const fetchCompletedSlugs = async () => {
        if(currentuser){
            const response = await fetchCompletedParts({
                userId: currentuser.uid,
            });
            const completedSlugs = response.map(part => part.slug); 
            const decoded = decodeParts(completedSlugs)
            setCompletedParts(decoded)  
        }
    }

    const handleMelanomaDataChange = (type:"slug" | "stage" | "skin_type" | "detected_relative", data:any) => {
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

    function round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    const handleBack = (permission:boolean) => {
        if (round(progress,1) == 0.1 || permission == true){
            navigation.goBack()
        } else if (haveBeenBurned != true && round(progress,1) != 0.8) {    
            setProgress(progress - 0.1)                          
        }  else if (round(progress,1) == 0.8){
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

    const deleteSunburn = (index:number) => {
        if(index != 0){
        setMelanomaMetaData((prevState) => {
            const newSunburn = [...prevState.sunburn];
            newSunburn.splice(index, 1);     
        return {
            ...prevState,
            sunburn: newSunburn 
        };
        });
        } else {
            setHaveBeenBurned(false)
        } 
    };

    const uploadMetaData = async (metaDataPass:MelanomaMetaData) => {   
        const res = await melanomaMetaDataUpload({
            userId: currentuser.uid,
            metaData: metaDataPass
        })
        if (res != true){
            alert("Something Went Wrong. Please check your intenet connection or restart the app !")
        }
    }

    const handleSlugMemoryChange = async () => {
        if ( completedParts.length != 0){
            const response = await completedArea(completedParts)
            updateCompletedSlug(response)
        } else {
            await completedArea(completedParts)
        }
    }

    useEffect(() => {
        if(round(progress,1) == 0.7 || round(progress,1) == 0.8){
        handleSlugMemoryChange()     
        }
    }, [completedParts,progress]); 

    useFocusEffect(
        useCallback(() => {
            fetchCompletedSlugs()       
        return () => {};
        }, [])
    );


    //<==============> Components  <=============> 

     //<==============> Main Component Return <=============> 


    return(    
        <View style={styles.container}>
            <ProgressRow 
                handleBack={(e) => handleBack(e)} 
                progress={progress}
            />
            {round(progress,1) === 0.1 && 
                <FirstScreen 
                    setProgress={setProgress} 
                    progress={progress}
                /> 
            }
            {round(progress,1) === 0.2 && 
                <FactScreen 
                    alertTeam={alertTeam}
                    setProgress={setProgress} 
                    progress={progress}
                />
            }
            {round(progress,1) == 0.3 && 
                <SkinBurnScreen 
                    setProgress={setProgress} 
                    progress={progress}
                    handleMelanomaDataChange={handleMelanomaDataChange}
                    melanomaMetaData={melanomaMetaData}
                    setMelanomaMetaData={setMelanomaMetaData}
                    haveBeenBurned={haveBeenBurned}
                    setHaveBeenBurned={setHaveBeenBurned}
                    selectedBurnSide={selectedBurnSide}
                    setSelectedBurnSide={setSelectedBurnSide}
                    addMoreBurn={addMoreBurn}
                    deleteSunburn={deleteSunburn}
                    userData={currentuser}
                    styles={styles}
                />
            }
            {round(progress,1) === 0.4 && 
                <SkinTypeScreen 
                    setProgress={setProgress} 
                    progress={progress}
                    handleMelanomaDataChange={handleMelanomaDataChange}
                    melanomaMetaData={melanomaMetaData}
                    styles={styles}
                />
            }
            {round(progress,1) === 0.5 && 
                <FamilyTreeScreen 
                    setProgress={setProgress} 
                    progress={progress}
                    handleMelanomaDataChange={handleMelanomaDataChange}
                    melanomaMetaData={melanomaMetaData}
                    styles={styles}
                />
            }
            {round(progress,1) === 0.6 && 
                <AlertScreen 
                    setProgress={setProgress} 
                    progress={progress}
                    uploadMetaData={uploadMetaData}
                    melanomaMetaData={melanomaMetaData}
                />
            }          
            {round(progress,1) === 0.7 && 
                <ThirdScreen 
                    userData={currentuser}
                    melanomaMetaData={melanomaMetaData}
                    setProgress={(e) => {setProgress(e); setCurrentSide("back");handleSlugMemoryChange()}}
                    progress={progress}
                    completedParts={completedParts}
                    updateCompletedSlug={updateCompletedSlug}
                    navigation={navigation}
                    completedAreaMarker={completedAreaMarker}
                    currentSide={currentSide}
                    bodyProgress={bodyProgress}
                    setIsModalUp={setIsModalUp}
                    isModalUp={isModalUp}
                    setCurrentSide={setCurrentSide}
                    styles={styles}
                    scaleFactor={scaleFactor}
                    setCompletedAreaMarker={setCompletedAreaMarker}
                />
            }
            {round(progress,1) === 0.8 && 
                <FourthScreen 
                    bodyProgressBack={bodyProgressBack}
                    setProgress={setProgress}
                    progress={progress}
                    completedParts={completedParts}
                    melanomaMetaData={melanomaMetaData}
                    completedAreaMarker={completedAreaMarker}
                    userData={currentuser}
                    currentSide={currentSide}
                    navigation={navigation}
                    setIsModalUp={setIsModalUp}
                    isModalUp={isModalUp}
                    setCurrentSide={setCurrentSide}
                    styles={styles}
                    scaleFactor={scaleFactor}
                    setCompletedAreaMarker={setCompletedAreaMarker}
                />
            }
            {round(progress,1) === 0.9 && 
                <FifthScreen 
                    navigation={navigation}
                    styles={styles}
                />
            }
            <Information_Modal 
                infoModal={infoModal}
                setInfoModal={setInfoModal}
            />
        </View>                
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        height:"100%",
        alignItems:"center",
        flexDirection:"column",   
        backgroundColor:"white" 
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        marginBottom:0,
        backgroundColor:"white",
        zIndex:-1,
        marginTop:0,
        justifyContent:"space-between"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"relative",
        marginTop:20,
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
        position:"relative",
        flexDirection:"row",
        justifyContent:"space-between",
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
        alignItems: 'flex-start',
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
        height:130,
        width:130,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderWidth:1,
        borderRadius:20,
        marginLeft:20,
        marginRight:20,
        backgroundColor:"rgba(0,0,0,1)",
    },
    selectableBubbleA:{
        height:130,
        width:130,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        marginLeft:20,
        marginRight:20,
        borderWidth:3,
        borderColor:"magenta",
        backgroundColor:"rgba(0,0,0,0.8)",
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



const Information_Modal = ({infoModal,setInfoModal}) => {
    return(
        <Modal visible={infoModal != null} presentationStyle="formSheet" animationType="fade">
            {infoModal == "assist" &&(
                <Assist_Onboard 
                />
            )}
        </Modal>
    )
}