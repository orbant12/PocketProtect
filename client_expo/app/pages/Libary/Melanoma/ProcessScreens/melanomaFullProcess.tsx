import { View,Image,PixelRatio,Dimensions, Modal } from "react-native"
import React, {useState,useEffect,useCallback} from "react";
import { useAuth } from "../../../../context/UserAuthContext";
import { melanomaMetaDataUpload, updateCompletedParts } from "../../../../services/server"
import { useFocusEffect } from '@react-navigation/native';
import { decodeParts } from "../../../../utils/melanoma/decodeParts";
import {Slug } from "../../../../utils/types";
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
        detected_relative:["none"],

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
                ...(type === "detected_relative" && { detected_relative: [...melanomaMetaData.detected_relative,data] })
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
        await melanoma.updateSkinType(metaDataPass.skin_type)
        await melanoma.updateDetectedRelative(metaDataPass.detected_relative)
        await melanoma.updateSunBurn(metaDataPass.sunburn)
        
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

    const handleMetaDataLoad = async () => {
        const skinResult = await melanoma.getSkinType()
        const sunResult = await melanoma.getSunBurn()
        const relativeResult = await melanoma.getDetectedRelative()
        if (skinResult != null && sunResult != null && relativeResult != null){
            setMelanomaMetaData({
                skin_type:skinResult,
                sunburn:sunResult,
                detected_relative:["none"]
            })
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
            handleMetaDataLoad()  
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