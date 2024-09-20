import { View,Image,PixelRatio,Dimensions, Modal } from "react-native"
import React, {useState,useEffect,useCallback} from "react";
import { useAuth } from "../../../../context/UserAuthContext";
import { melanomaMetaDataUpload, updateCompletedParts } from "../../../../services/server"
import { useFocusEffect } from '@react-navigation/native';
import { decodeParts } from "../../../../utils/melanoma/decodeParts";
import {SkinType, Slug } from "../../../../utils/types";
import { MelanomaMetaData } from "../melanomaCenter";
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
import { styles } from "../../../../styles/full_melanoma_styles";


const { width } = Dimensions.get('window');
const scaleFactor = width < 380 ? 1 : 1.2;

type CompletedParts_Array = {slug:Slug}[]

const responsiveFontSize = (size:number) => {
    return size * PixelRatio.getFontScale();
};

const MelanomaFullProcess = ({navigation}) => {

    //<===============> Variables  <===============> 
    const alertTeam  = Image.resolveAssetSource(require('../../../../assets/skinburn/5.png')).uri;
    const {currentuser, melanoma} = useAuth()

    const [skinData, setSkinData] = useState(null)

    //Progress Trackers
    const [progress, setProgress] = useState(0.1)
    const [bodyProgress, setBodyProgress] = useState(1)
    const [bodyProgressBack, setBodyProgressBack] = useState(0)
    const [haveBeenBurned, setHaveBeenBurned] = useState<boolean>(false)

    const [ infoModal, setInfoModal] = useState<null | "assist">(null)
    //Body for Birthmark
    const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [completedParts, setCompletedParts] = useState<CompletedParts_Array>([])
    const [isModalUp, setIsModalUp] = useState<boolean>(false)

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
            await melanoma.updateCompletedParts(completedArray)
        }
    }

    const fetchCompletedSlugs = async () => {
        if(currentuser){
            const response = melanoma.getCompletedParts()
            const decoded = decodeParts(response)
            setCompletedParts(decoded)  
        }
    }

    // const handleMelanomaDataChange = (type:"slug" | "stage" | "skin_type" | "detected_relative", data:any) => {
    //     setMelanomaMetaData((prevState) => {
    //       let newSunburn = [...prevState.sunburn]; // Create a shallow copy of the sunburn array              
    //         if (newSunburn.length === 0) {
    //             newSunburn.push({ stage: 0, slug: "" }); 
    //         }                
    //         if (type === "slug") {
    //             newSunburn[0] = { ...newSunburn[0], slug: data };
    //         } else if (type === "stage") {
    //             newSunburn[0] = { ...newSunburn[0], stage: data };
    //         }                
    //         return {
    //             ...prevState,
    //             sunburn: newSunburn,
    //             ...(type === "skin_type" && { skin_type: data }),
    //             ...(type === "detected_relative" && { detected_relative: [...melanomaMetaData.detected_relative,data] })
    //         };
    //         });
    // };

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



    // const uploadMetaData = async (metaDataPass:MelanomaMetaData) => {   
    //     await melanoma.updateSkinType(metaDataPass.skin_type)
    //     await melanoma.updateDetectedRelative(metaDataPass.detected_relative)
    //     await melanoma.updateSunBurn(metaDataPass.sunburn)
    // }

    const handleSlugMemoryChange = async () => {
        if ( completedParts.length != 0){
            const response = await completedArea(completedParts)
            updateCompletedSlug(response)
        } else {
            await completedArea(completedParts)
        }
    }

    // const handleMetaDataLoad = async () => {
    //     const skinResult = await melanoma.getSkinType()
    //     const sunResult = await melanoma.getSunBurn()
    //     const relativeResult = await melanoma.getDetectedRelative()
    //     if (skinResult != null && sunResult != null && relativeResult != null){
    //         setMelanomaMetaData({
    //             skin_type:skinResult,
    //             sunburn:sunResult,
    //             detected_relative:relativeResult
    //         })
    //     }
    // }

    const handleLoad = async ()  => {
        await melanoma.fetchSkinType()

        setSkinData(melanoma.getSkinType())
    }

    const handleSaveSkin = async () => {

        await melanoma.updateSkinType(skinData)
    }

    useEffect(() => {
        if(round(progress,1) == 0.7 || round(progress,1) == 0.8){
        handleSlugMemoryChange()     
        }
    }, [completedParts,progress]); 

    useFocusEffect(
        useCallback(() => {
            fetchCompletedSlugs()
            handleLoad() 
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
                    setProgress={() => setProgress(0.5)} 
                    progress={progress}
                    haveBeenBurned={haveBeenBurned}
                    setHaveBeenBurned={setHaveBeenBurned}
                    addStyle={{height:"95%"}}
                    pageStyle={{height:"98%"}}
                />
            }
            {round(progress,1) === 0.4 && 
                <SkinTypeScreen 
                    setProgress={(e) => {setProgress(e);handleSaveSkin()}} 
                    progress={progress}
                    handleMelanomaDataChange={(e:string,n:SkinType) => setSkinData(n)}
                    melanomaMetaData={{skin_type:skinData}}
                />
            }
            {round(progress,1) === 0.5 && 
                <FamilyTreeScreen 
                    setProgress={setProgress} 
                    progress={progress}
                    styles={styles}
                />
            }
            {round(progress,1) === 0.6 && 
                <AlertScreen 
                    setProgress={setProgress} 
                    progress={progress}
                />
            }          
            {round(progress,1) === 0.7 && 
                <ThirdScreen 
                    userData={currentuser}
                    skinColor={skinData}
                    setProgress={(e) => {setProgress(e); setCurrentSide("back");handleSlugMemoryChange()}}
                    progress={progress}
                    completedParts={completedParts}
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
                    skinColor={skinData}
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
                    onFinish={() => navigation.goBack()}
                    boxDatas={[
                        {
                            title:"Analise with AI",
                            icon_name:"microscope",
                            desc:{
                                one:"Get a 90% accurate prediction",
                                two:"AI will predict wheter it finds your mole malignant or benign",
                                three:"We strive towards 100% transparency about our model so we made it open source which you can find on our github"
                            }
                        },
                        {
                            title:"Get Professional Help",
                            icon_name:"doctor",
                            desc:{
                                one:"Let a certified dermotologist look at your mole and make a professional analasis",
                                two:"You'll recive a pdf of the analasis explaining the process in detail",
                                three:"You will get access to chat with your selected dermotologist"
                            }
                        },
                        {
                            title:"Reminders for new imaging",
                            icon_name:"calendar",
                            desc:{
                                one:"Revaluating each mole's risk",
                                two:"Comparing their growth & change to past images",
                                three:"You can access and show your dermotologist about each mole's evolution over an endless period of time"
                            }
                        }
                    ]}
                />
            }
            <Information_Modal 
                infoModal={infoModal}
                setInfoModal={setInfoModal}
            />
        </View>                
    )
}



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






//SUNBURN FILE SYSTEM
