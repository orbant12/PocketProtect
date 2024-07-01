import { useState,useRef,useCallback } from "react";
import { View } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/client/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchSpotHistory, deleteSpotWithHistoryReset, updateSpotRisk,fetchSelectedMole } from "../../../services/server";
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../../services/firebase"
import { SingleSlugStyle } from "../../../styles/libary_style";
import { SureModal } from "../../../components/LibaryPage/Melanoma/modals";
import { MoleTab } from "../../../components/LibaryPage/Melanoma/SingleMole/tabs/moleTab";
import { AssistTab } from "../../../components/LibaryPage/Melanoma/SingleMole/tabs/assistTab";
import { useFocusEffect } from '@react-navigation/native';
import { Navigation_AddSlugSpot } from "../../../navigation/navigation";
import { NavBar_OneOption } from "../../../components/Common/navBars";
import { Gender, SkinType, SpotData, UserData } from "../../../utils/types";


const SinglePartAnalasis = ({ route,navigation }) => {

//<==================<[ Variables ]>====================>

//Route Params
const bodyPartID:string = route.params.melanomaId;
const gender:Gender = route.params.gender
const skin_type:SkinType = route.params.skin_type
const userData:UserData = route.params.userData

const functions = getFunctions(app);
const moleDataRef = useRef(null)
const {currentuser} = useAuth()
const [melanomaHistory, setMelanomaHistory] = useState([])
const [bodyPart , setBodyPart ] = useState<SpotData | null>(null)
const [selectedMelanoma, setSelectedMelanoma] = useState<SpotData | null>(null)
const [highlight, setHighlighted ]= useState<string | null>(null)
const [deleteModal,setDeleteModal] = useState<boolean>(false)
const [moleToDelete,setMoleToDelete] = useState<SpotData | null>(null)
const [diagnosisLoading ,setDiagnosisLoading] = useState(false)


//<==================<[ Functions ]>====================>

    const fetchAllSpotHistory = async (bPart:SpotData) => {
        if(currentuser){
            const res = await fetchSpotHistory({
                userId: currentuser.uid,
                spotId: bodyPartID,            
            })
            if (res == "NoHistory"){
                setMelanomaHistory([])
                setHighlighted(bPart.storage_name)                
            } else if (res == false){
                alert("Something went wrong !")
                setHighlighted(bPart.storage_name)
            } else {
                setMelanomaHistory(res)
                setHighlighted(bPart.storage_name)            
            }
        }
    }

    const fetchDataSelectedMole = async () => {
        const response: SpotData = await fetchSelectedMole({
            userId:currentuser.uid,
            spotId: bodyPartID
        })
        if( response != null ) {
            setBodyPart(response)
            setSelectedMelanoma(response)
            fetchAllSpotHistory(response)
        }
    }

    const handleSpotDelete = async (data:SpotData) => {
        if(data.storage_name == bodyPart.storage_name){
            const response = await deleteSpotWithHistoryReset({
                userId:currentuser.uid,
                spotId: data.melanomaId,
                deleteType:"latest",
                storage_name:data.storage_name
            })
            if( response.firestore.success == true && response.storage.success == true){
                alert("Mole Deleted Sucessfully !")
                navigation.goBack()
            } else if ( response.firestore.success != true || response.storage.success != true) {
                alert("Deletion failed ...")
            }
        } else {
            const response = await deleteSpotWithHistoryReset({
                userId:currentuser.uid,
                spotId: data.melanomaId,
                deleteType:"history",
                storage_name:data.storage_name
            })
            if( response.firestore.success == true && response.storage.success == true){
                alert("Mole Deleted Sucessfully !")
                navigation.goBack()
            } else if ( response.firestore.success != true || response.storage.success != true) {
                alert("Deletion failed ...")
            }
        }
    }

    const handleCallNeuralNetwork = async (pictureURL:string) => {
        setDiagnosisLoading(true)
        const blobToBase64 = (blob: Blob): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(String(reader.result).split(',')[1]); 
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };
        const evaluate = async (photo:string) => {
            const generatePrediction = httpsCallable(functions, 'predict');
            try {            
                const response = await fetch(photo);
                if (!response.ok) throw new Error('Failed to fetch image');                                
                const blob = await response.blob();                                
                const base64String = await blobToBase64(blob);                                
                const result = await generatePrediction({ input: base64String }) as { data: { prediction: { "0": number } } };                 
                console.log('Prediction result:', result.data);
                return result.data
            } catch (error) {
                console.error('Error:', error);
            }
        };
        try{            
            const prediction = await evaluate(pictureURL)      
            const response = await updateSpotRisk({
                userId: currentuser.uid,
                spotId: selectedMelanoma.melanomaId,
                riskToUpdate: {risk: prediction.prediction["0"].toFixed(2)}
            })
            if(response == true && bodyPart != null){
                fetchAllSpotHistory(bodyPart) 
                fetchDataSelectedMole()
            }        
        } catch {
            return alert("Prediction failed")
        }
        setDiagnosisLoading(false)
    }

    const handleUpdateMole = async () => {        
        Navigation_AddSlugSpot({
            userData:userData,
            skin_type:skin_type,
            bodyPartSlug:bodyPart.melanomaDoc.spot[0],
            type:{id:bodyPart.melanomaId,locationX:bodyPart.melanomaDoc.location.x,locationY:bodyPart.melanomaDoc.location.y},
            navigation
        })
    }

    useFocusEffect(
        useCallback(() => {
            fetchDataSelectedMole()
        return () => {};
        }, [])
    );


//<==================<[ Components ]>====================>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 

                    {bodyPart.melanomaDoc.spot[0].pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.melanomaDoc.spot[0].slug}_${index}`} 
                                d={path}
                                fill={skin_type == 0 ? "#fde3ce" : skin_type == 1 ? "#fbc79d" : skin_type == 2 ? "#934506" : skin_type == 3 ? "#311702":null}
                                stroke={bodyPart.melanomaDoc.spot[0].color} 
                                strokeWidth="2"
                                rotation={
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? "-20"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? "20"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "-20"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "20"
                                    :
                                    null
                                }
                                transform={
                                    gender == "male" ? (
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? `translate(-180 -270)` 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? `translate(-140 -70)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "legs" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "torso" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "feet" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "abs" ? `translate(-60 -390)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? `translate(40 -670)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? `translate(-480 -670)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? `translate(120 -420)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? `translate(-300 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? `translate(0 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? `translate(-170 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? `translate(-20 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? `translate(-170 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? `translate(-130 -1200)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? `translate(-290 -1200)`
                                        :
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? `translate(-860 -80)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? `translate(-800 -290)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? `translate(-600 -430)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? `translate(-1000 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? `translate(-900 -590)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? `translate(-1190 -675)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? `translate(-680 -670)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? `translate(-550 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? `translate(-840 -1230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? `translate(-1000 -1230)`
                                        :
                                        null
                                        ):(
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? `translate(-145 -270)` 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? `translate(-50 -10)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "legs" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "torso" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "feet" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "abs" ? `translate(-20 -380)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? `translate(100 -630)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? `translate(-460 -640)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? `translate(180 -420)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? `translate(-300 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? `translate(0 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? `translate(-110 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? `translate(-20 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? `translate(-120 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? `translate(-130 -1280)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? `translate(-220 -1280)`
                                        :
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? `translate(-900 -30)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? `translate(-850 -280)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? `translate(-650 -450)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? `translate(-1100 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? `translate(-960 -590)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? `translate(-1270 -620)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? `translate(-730 -630)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? `translate(-600 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? `translate(-940 -1330)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? `translate(-1050 -1330)`
                                        
                                        :null
                                        )
                                }
                                scale={
                                    gender == "male" ? (
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? "1.3" 
                                        : 
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? "1" 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "legs" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "torso" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "feet" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "abs" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? "0.65"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? "0.65"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? "0.7"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? "0.7"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? "1.2 "
                                        :
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? "1"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? "1.2"
                                        :
                                        null):(
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? "1.3" 
                                        : 
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? "1" 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? "0.65"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "legs" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "torso" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "feet" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "abs" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? "0.65"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? "0.65"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? "0.7"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? "0.7"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? "1.2 "
                                        :
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? "1"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? "1.2"
                                        :
                                        null)
                                }
                            />
                    ))}
        
                    <Circle cx={bodyPart.melanomaDoc.location.x} cy={bodyPart.melanomaDoc.location.y} r="5" fill="red" />
            </Svg>
    
        )
    }

    const Header = () => {
        return(
            <View style={[SingleSlugStyle.TopPart]}>
            {bodyPart != null ? dotSelectOnPart():null}
            </View>
        )
    }

//<==================<[ Main Return ]>====================>

    return(
        <>
        <View style={SingleSlugStyle.container}>
            <NavBar_OneOption 
                icon_left={{name:"arrow-left",size:25, action:() => navigation.goBack()}}
                title={bodyPart != null && bodyPart.melanomaId}
            />
            <Tabs.Container
                renderHeader={Header}
                headerContainerStyle={{backgroundColor:"black"}}
                containerStyle={{backgroundColor:"rgba(0,0,0,0.86)"}}
            >
            <Tabs.Tab 
                name="A"
                label={() => <Entypo name={'folder'} size={25} color={"white"} />}
            >
                <Tabs.ScrollView ref={moleDataRef}>
                    <MoleTab 
                        handleCallNeuralNetwork={handleCallNeuralNetwork}
                        bodyPart={bodyPart}
                        selectedMelanoma={selectedMelanoma}
                        highlight={highlight}
                        setHighlighted={setHighlighted}
                        deleteModal={deleteModal}
                        setSelectedMelanoma={setSelectedMelanoma}
                        melanomaHistory={melanomaHistory}
                        setMoleToDelete={setMoleToDelete}
                        diagnosisLoading={diagnosisLoading}
                        setDeleteModal={setDeleteModal}
                        moleDataRef={moleDataRef}
                        handleUpdateMole={handleUpdateMole}
                    />
                </Tabs.ScrollView>
            </Tabs.Tab>

            <Tabs.Tab 
                name="B"
                label={() => <Entypo name={'warning'} size={25} color={"white"} />}
            >
                <Tabs.ScrollView>
                    <AssistTab
                        bodyPart={bodyPart != null ? [bodyPart] : null}
                        navigation={navigation}
                    />
                </Tabs.ScrollView>
            </Tabs.Tab>
        </Tabs.Container> 
        </View>
        <SureModal 
            visible={deleteModal}
            setDeleteModal={setDeleteModal}
            handleSpotDelete={handleSpotDelete}
            moleToDelete={moleToDelete}
        />
        </>
    )}


export default SinglePartAnalasis;
