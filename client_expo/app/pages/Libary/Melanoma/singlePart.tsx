import { useState,useRef,useCallback } from "react";
import { View } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle } from 'react-native-body-highlighter/node_modules/react-native-svg';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchSpotHistory, deleteSpotWithHistoryReset, updateSpotRisk,fetchSelectedMole, FLASK_DOMAIN } from "../../../services/server";
import { getFunctions } from "firebase/functions";
import {app} from "../../../services/firebase"
import { SingleSlugStyle } from "../../../styles/libary_style";
import { SureModal } from "../../../components/LibaryPage/Melanoma/modals";
import { MoleTab } from "../../../components/LibaryPage/Melanoma/SingleMole/tabs/moleTab";
import { AssistTab } from "../../../components/LibaryPage/Melanoma/SingleMole/tabs/assistTab";
import { useFocusEffect } from '@react-navigation/native';
import { Navigation_AddSlugSpot } from "../../../navigation/navigation";
import { NavBar_OneOption } from "../../../components/Common/navBars";
import { Gender, SkinType, SpotData, UserData } from "../../../utils/types";
import { convertImageToBase64 } from "../../../utils/imageConvert";
import { SuccessDeleteAnimationSheet } from "../../../components/Common/AnimationSheets/deleteSuccAnimation";
import { BodyPartPath } from "./components/selectedSlugDots";



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
const [diagnosisLoading ,setDiagnosisLoading] = useState<"loading" | "first_loaded" | "repeat_loaded" | null>(null)

const [melanomaDeleteState, setMelanomaDeleteState] = useState<boolean | string | null>(null)


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
        } else {
            navigation.goBack()
        }
    }

    const handleSpotDelete = async (data:SpotData) => {
        setMelanomaDeleteState(false)
        if(data.storage_name == bodyPart.storage_name){
            const response = await deleteSpotWithHistoryReset({
                userId:currentuser.uid,
                spotId: data.melanomaId,
                deleteType:"latest",
                storage_name:data.storage_name
            })
            if( response.firestore.success == true && response.storage.success == true){
                setMelanomaDeleteState(true)
                fetchDataSelectedMole()
                setDeleteModal(false)
            } else if ( response.firestore.success != true || response.storage.success != true) {
                if(response.firestore.success == false){
                    setMelanomaDeleteState(response.firestore.message)
                } else if (response.storage.success == false){
                    setMelanomaDeleteState(response.storage.message)
                }
            }
        } else {
            const response = await deleteSpotWithHistoryReset({
                userId:currentuser.uid,
                spotId: data.melanomaId,
                deleteType:"history",
                storage_name:data.storage_name
            })
            if( response.firestore.success == true && response.storage.success == true){
                setMelanomaDeleteState(true)
                fetchDataSelectedMole()
                setDeleteModal(false)
                
            } else if ( response.firestore.success != true || response.storage.success != true) {
                if(response.firestore.success == false){
                    setMelanomaDeleteState(response.firestore.message)
                } else if (response.storage.success == false){
                    setMelanomaDeleteState(response.storage.message)
                }
            }
        }
    }

    const evaluate = async (pictureUrl:string):Promise<{'prediction': 'Malignant' | 'Bening', 'confidence': number} | null> => {
        try{
        const pictureBase64 = await convertImageToBase64(pictureUrl);
        const flaskResponse = await fetch(`${FLASK_DOMAIN}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: pictureBase64
            }),
        });
        const response: {'prediction': 'Malignant' | 'Bening', 'confidence': number} = await flaskResponse.json();
        return response
        } catch {
            return null
        }
    };

    const handleCallNeuralNetwork = async (pictureURL:string,type:"first_loaded" | "repeat_loaded") => {
        setDiagnosisLoading("loading")
        try{            
            const prediction = await evaluate(pictureURL)   
            console.log(prediction.confidence)   
            const response = await updateSpotRisk({
                userId: currentuser.uid,
                spotId: selectedMelanoma.melanomaId,
                
                riskToUpdate: {risk: Math.floor(prediction.confidence * 100) / 100},
            })
            if(response == true && bodyPart != null){
                fetchAllSpotHistory(bodyPart) 
                fetchDataSelectedMole()
                setTimeout(() => {
                    setDiagnosisLoading(type)
                }, 5000);
            }        
        } catch(err) {
            setDiagnosisLoading(err.message)
            return alert("Prediction failed")
        }
    }

    const handleUpdateMole = async () => {        
        Navigation_AddSlugSpot({
            userData:userData,
            skin_type:skin_type,
            bodyPartSlug:bodyPart.melanomaDoc.spot,
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


    const simulateDiagnosis = async () => {
        setDiagnosisLoading("loading")
        setTimeout(() => {
            setDiagnosisLoading("first_loaded")
        }, 5000);
    }

//<==================<[ Components ]>====================>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 

                    {bodyPart.melanomaDoc.spot.pathArray.map((path, index) => (
                            <BodyPartPath
                                path={path}
                                index={index}
                                bodyPart={bodyPart.melanomaDoc.spot}
                                userData={userData}
                                skin_type={skin_type}
                                stroke={"black"}
                            />
                    ))}
        
                    <Circle cx={bodyPart.melanomaDoc.location.x} cy={bodyPart.melanomaDoc.location.y} r="5" fill="red" />
            </Svg>
    
        )
    }

    const Header = () => {
        return(
            <>
                <View style={[SingleSlugStyle.TopPart]}>
                {bodyPart != null ? dotSelectOnPart():null}
                </View>
            </>
        )
    }

//<==================<[ Main Return ]>====================>

    return(
        <>
        <NavBar_OneOption 
            icon_left={{name:"arrow-left",size:25, action:() => navigation.goBack()}}
            title={bodyPart != null && bodyPart.melanomaId}
            styles={{padding:10,zIndex:100}}
            outerBg={"black"}
        />
        <View style={SingleSlugStyle.container}>
            <Tabs.Container
                renderHeader={Header}
                headerContainerStyle={{backgroundColor:"black",zIndex:1}}
                containerStyle={{backgroundColor:"rgba(240,240,240,0.9)",zIndex:-1}}
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
                        navigation={navigation}
                        setDiagnosisLoading={setDiagnosisLoading}
                        simulateDiagnosis={simulateDiagnosis}
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
        <SuccessDeleteAnimationSheet 
            loading={melanomaDeleteState}
            setActive={setMelanomaDeleteState}
        />
        </>
    )}


export default SinglePartAnalasis;
