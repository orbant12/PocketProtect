import { useEffect,useState,useRef } from "react";
import { View, StyleSheet,Text,Image,TouchableOpacity,Pressable,ActivityIndicator } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchSpotHistory, deleteSpotWithHistoryReset, updateSpot, updateSpotData } from "../../../server";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Navigation_AddSlugSpot } from "../../../navigation/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../../firebase"
import moment from 'moment'

const SinglePartAnalasis = ({ route,navigation }) => {

//<==================<[ Variables ]>====================>

//Route Params
const bodyPart = route.params.bodyPart;
const gender = route.params.gender
const skin_type = route.params.skin_type
const userData = route.params.userData

const today = new Date();
const functions = getFunctions(app);
const format = moment(today).format('YYYY-MM-DD')

const moleDataRef = useRef(null)

const {currentuser} = useAuth()

const [melanomaHistory, setMelanomaHistory] = useState([])
const [selectedMelanoma, setSelectedMelanoma] = useState(null)
const [highlight, setHighlighted ]= useState("")
const [deleteModal,setDeleteModal] = useState(false)
const [moleToDelete,setMoleToDelete] = useState("")
const [diagnosisLoading ,setDiagnosisLoading] = useState(false)


//<==================<[ Functions ]>====================>

    const fetchAllSpotHistory = async () => {
        if(currentuser){
            const res = await fetchSpotHistory({
                userId: currentuser.uid,
                spotId: bodyPart.melanomaId,            
            })
            if (res == "NoHistory"){
                setMelanomaHistory([])
                setHighlighted(formatDate(bodyPart.created_at))
                setSelectedMelanoma(bodyPart)
            } else if (res == false){
                alert("Something went wrong !")
                setSelectedMelanoma(bodyPart)
                setHighlighted(formatDate(bodyPart.created_at))
            } else {
                setMelanomaHistory(res)
                setHighlighted(formatDate(bodyPart.created_at))
                setSelectedMelanoma(bodyPart)
            }
        }
    }

    function formatDate(timestamp) {        
        const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);    
        const date = new Date(milliseconds);    
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getUTCDate()).padStart(2, '0'); 
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    function formatDateToday(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function dateDistance(date1, date2) {
        const d1 = new Date(formatDate(date1))
        const d2 = new Date(formatDateToday(date2));
        const diffTime = d1 - d2;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 186;
    }

    const handleUpdateMole = async () => {        
        Navigation_AddSlugSpot({
            userData:userData,
            skin_type:skin_type,
            bodyPart:bodyPart.melanomaDoc.spot[0],
            type:{id:bodyPart.melanomaId,locationX:bodyPart.melanomaDoc.location.x,locationY:bodyPart.melanomaDoc.location.y},
            navigation
        })
    }

    useEffect(() => {
        fetchAllSpotHistory()
    },[])

    const handleSpotDelete = async (data) => {
        if(data.storage_name == bodyPart.storage_name){
            const response = await deleteSpotWithHistoryReset({
                userId:currentuser.uid,
                spotId: data.melanomaId,
                type:"change",
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
                type:"history",
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


    const handleCallNeuralNetwork = async (pictureURL) => {
        setDiagnosisLoading(true)
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
                const response = await fetch(photo);
                if (!response.ok) throw new Error('Failed to fetch image');                                
                const blob = await response.blob();                                
                const base64String = await blobToBase64(blob);                                
                const result = await generatePrediction({ input: base64String });                    
                console.log('Prediction result:', result.data);
                return result.data
            } catch (error) {
                console.error('Error:', error);
            }
        };
        try{            
            const prediction = await evaluate(pictureURL)      
            const response = await updateSpotData({
                userId: currentuser.uid,
                spotId: selectedMelanoma.melanomaId,
                dataToUpdate: {risk: prediction}
            })
            if(response == true){
                fetchAllSpotHistory()                
            }        
        } catch {
            return alert("Prediction failed")
        }
        setDiagnosisLoading(false)
    }



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

    function SureModal(){
        return(
            <View style={styles.modalOverlay}> 
            <View style={styles.modalBox}>
                <View style={{alignItems:"center",padding:20}}>
                    <Text style={{fontWeight:"700",fontSize:18,marginTop:10,textAlign:"center"}}>Are you sure about deleting {moleToDelete.storage_name}</Text>
                    <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>It will be lost forever !</Text>
                </View>
                <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                    <TouchableOpacity onPress={() => {moleToDelete != "" && handleSpotDelete(moleToDelete)}} style={styles.modalNoBtn}>
                        <Text style={{fontWeight:"700",color:"white"}}>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalYesBtn} onPress={() => setDeleteModal(!deleteModal)}>
                        <Text style={{fontWeight:"700",color:"black"}}>No</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        )
    }

    const Header = () => {
        return(
            <View style={styles.TopPart}>
            {bodyPart != null ? dotSelectOnPart():null}
        </View>
        )
    }

    const LoadingOverlay = () => {
        return(
            <View style={styles.loadingModal}>
                <ActivityIndicator size="large" color="white" />
            </View>      
        )
    }

//<==================<[ Main Return ]>====================>

    return(
        <>
        <View style={styles.container}>
        
            <Tabs.Container
            renderHeader={Header}
            headerContainerStyle={{backgroundColor:"black"}}
            containerStyle={{backgroundColor:"rgba(0,0,0,0.86)"}}
        >

            {/* CLIPS PAGE */}
            <Tabs.Tab 
                name="A"
                label={() => <Entypo name={'folder'} size={25} color={"white"} />}
            >
                <Tabs.ScrollView ref={moleDataRef}>
                    <View style={[styles.container]}>
                    {selectedMelanoma != null &&
                        selectedMelanoma.risk != 0 ?
                            <View style={[{marginTop:20,alignItems:"center",width:"100%"}]}>                             
                                <Text style={{color:"lightgreen",fontWeight:"800",marginTop:0,fontSize:30}}>Bening</Text>
                                <View style={styles.scoreCircle}>
                                    <Text style={[{fontSize:50,fontWeight:'bold'},{color:"lightgreen",opacity:0.5}]}>{selectedMelanoma.risk * 10}%</Text>
                                    <Text style={[{fontSize:9,fontWeight:700,maxWidth:"100%"},{color:"lightgreen",opacity:0.2}]}>Chance to be malignant</Text>
                                </View>
                            </View>
                            :
                            <View style={{width:"90%",alignItems:"center",paddingTop:30,backgroundColor:"black",borderBottomLeftRadius:30,borderBottomRightRadius:30}}>
                                <Text style={{width:"90%",textAlign:"center",fontSize:10,color:"white",fontWeight:"800",opacity:0.3,marginBottom:5}}>Not started yet...</Text>
                                <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6,marginBottom:40}}>Diagnosis</Text>                                
                                <TouchableOpacity onPress={() => handleCallNeuralNetwork(selectedMelanoma.melanomaPictureUrl)} style={{width:"80%",padding:20,backgroundColor:"lightgray",alignItems:"center",borderRadius:30,marginBottom:50,borderColor:"black",borderWidth:2}}>
                                    <Text style={{fontWeight:"600",color:"black",opacity:0.8}}>Start Deep Learning AI Model</Text>
                                </TouchableOpacity>
                            </View>                        
                        }         

                        <View style={[{marginTop:50,alignItems:"center",width:"100%"}]} >
                            <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>Mole Data</Text>
                            {selectedMelanoma != null &&
                            <>
                                <View style={[styles.melanomaBox, highlight != formatDate(selectedMelanoma.created_at) && {borderColor:"white"}]}>
                                    
                                    <Image 
                                        source={{ uri:selectedMelanoma.melanomaPictureUrl}}
                                        style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                    />
                                    <View style={styles.melanomaBoxL}>                            
                                        <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{selectedMelanoma.melanomaId}</Text>
                                        <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>{formatDate(selectedMelanoma.created_at)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {setDeleteModal(!deleteModal);setMoleToDelete(selectedMelanoma)}} style={{width:"30%",flexDirection:"row",alignItems:"center",borderWidth:1.5,borderColor:"red",padding:10,borderRadius:10,opacity:0.8}}>
                                        <MaterialCommunityIcons 
                                            name="delete"
                                            size={20}
                                            color={"red"}
                                        />
                                        <Text style={{color:"red",fontWeight:"700",marginLeft:5}}>Delete</Text>                         
                                    </TouchableOpacity>               
                                </View>
                                <View style={{backgroundColor:"black",padding:20,alignItems:"center",borderBottomLeftRadius:30,borderBottomRightRadius:30}}>
                                <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                                    <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>State:</Text>
                                    {dateDistance(selectedMelanoma.created_at,format) != 0 ? 
                                        dateDistance(selectedMelanoma.created_at,format) > 0 ?                           
                                        <Text style={{fontSize:15,fontWeight:"500",maxWidth:"70%",color:"white",opacity:0.5}}>Your mole is up to date for <Text style={{color:"lightgreen",fontWeight:"800",opacity:0.5}}>{dateDistance(selectedMelanoma.created_at,format)} days</Text></Text>                  
                                    :                         
                                        <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"white",opacity:0.5}}>This mole has been outdated for <Text style={{color:"red",fontWeight:"800",opacity:0.5}}>{dateDistance(selectedMelanoma.created_at,format) * -1} days</Text></Text>    
                                    :
                                        <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"white",opacity:0.5}}>This mole is getting outdated <Text style={{color:"lightgreen",fontWeight:"800",opacity:0.5}}>Today</Text></Text>                         
                                    }
                                </View>
                                <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                                    <Text style={{fontWeight:"600",fontSize:20,color:"white"}}>Prediction:</Text>
                                    <Text style={{fontWeight:"600",fontSize:16,color:"white",opacity:0.5}}>
                                        {selectedMelanoma.risk < 0.5 ? "bening" : "malignant"}
                                    </Text>
                                    
                                </View>   
                                <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                                    <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>Body Part:</Text>
                                    <Text style={{fontWeight:"600",fontSize:16,color:"white",opacity:0.5}}>{selectedMelanoma.melanomaDoc.spot[0].slug}</Text>
                                </View>   
                                <View style={{width:"100%",justifyContent:"center",alignItems:"center",marginTop:40}}>                               
                                    <Image 
                                        source={{uri:selectedMelanoma.melanomaPictureUrl}}
                                        style={{width:300,height:300,borderRadius:20}}
                                    />
                                </View>   
                                </View> 
                            </>         
                            }                                                                                     
                            <View style={[styles.container,{marginTop:50}]}>
                                <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>History</Text>    
                                <Text style={{color:"white",opacity:0.2,fontWeight:"600",marginTop:5}}>Latest to oldest</Text>                                  
                                    <TouchableOpacity onPress={() => {setHighlighted(formatDate(bodyPart.created_at)); setSelectedMelanoma(bodyPart); moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true }); }}  style={[styles.melanomaBox, highlight != formatDate(bodyPart.created_at) && {borderColor:"white"}]}>
                                    <Text style={[{color:"magenta",opacity:0.6, fontWeight:"700",top:-22,position:"absolute",left:0},highlight != formatDate(bodyPart.created_at) && {color:"white"}]}>Latest</Text>
                                    <Image 
                                        source={{ uri:bodyPart.melanomaPictureUrl}}
                                        style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                    />
                                    <View style={styles.melanomaBoxL}>                            
                                        <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{formatDate(bodyPart.created_at)}</Text>
                                        <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {bodyPart.risk}</Text>
                                    </View>              
                                    <View  style={styles.melanomaBoxR}>
                                        <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                        <MaterialCommunityIcons 
                                            name="arrow-right"
                                            size={25}
                                            color={"white"}
                                            opacity={"0.8"}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                    {melanomaHistory.length != 0 && 
                                        melanomaHistory.map((data,index) => (
                                        <TouchableOpacity key={index} onPress={() => {setHighlighted(formatDate(data.created_at));setSelectedMelanoma(data);moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true });}}  style={[styles.melanomaBox, highlight != formatDate(data.created_at) && {borderColor:"white"}]}>                                    
                                            <Image 
                                                source={{ uri:data.melanomaPictureUrl}}
                                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                            />
                                            <View style={styles.melanomaBoxL}>                            
                                                <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{formatDate(data.created_at)}</Text>
                                                <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {data.risk}</Text>
                                            </View>              
                                            <View  style={styles.melanomaBoxR}>
                                                <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                            <MaterialCommunityIcons 
                                                    name="arrow-right"
                                                    size={25}
                                                    color={"white"}
                                                    opacity={"0.8"}
                                                />
                                            </View>
                                            </TouchableOpacity>
                                        ))

                                    }                        
                            </View>                             
            
                        </View>

                        <View style={[{marginTop:50,width:"100%",alignItems:"center",zIndex:20,marginBottom:50,borderTopWidth:1,paddingTop:30}]}>
                            <TouchableOpacity onPress={() => handleUpdateMole(bodyPart.melanomaId)} style={{width:"80%",backgroundColor:"black",borderColor:"magenta",borderWidth:2,padding:20,marginTop:0,alignItems:"center",borderRadius:100}}>
                                <Text style={{color:"white",fontWeight:"800"}}>Update this mole</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Tabs.ScrollView>
            </Tabs.Tab>
                    {/* CLIPS PAGE */}
                    <Tabs.Tab 
                name="B"
                label={() => <Entypo name={'warning'} size={25} color={"white"} />}
            >
                <Tabs.ScrollView>
                    <Text>dsaads</Text>
                </Tabs.ScrollView>
            </Tabs.Tab>
        </Tabs.Container> 

        {deleteModal && SureModal()}      
        </View>
        {diagnosisLoading && LoadingOverlay()}
        </>
    )}


//<==================<[ Style Sheet ]>====================>

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: "100%",        
        alignItems: "center",
        height:"100%",
        flexDirection: "column",
    },
    loadingModal:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    TopPart: {
        width: "100%",
        borderWidth: 0.3,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding:10,
        backgroundColor:"white"
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'lightgreen',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    melanomaBox: {
        maxWidth: "95%",
        width: "95%",
        height: 100,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor:"magenta",
        backgroundColor:"black",
        flexDirection: "row",
        borderRadius:10,
        marginRight:"auto",
        marginLeft:"auto",
        marginTop:20
    },
    melanomaBoxL: {
        width: "40%",
        height: "100%",
        justifyContent: "center",
        marginLeft:10,
        marginRight:10
    },
    melanomaBoxR: {

        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        borderRadius: 10,
        marginLeft: 10,
        paddingVertical:10,
        paddingHorizontal:10,
        borderColor:"white",
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1
    },
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        width:300,
        height:180,
        borderWidth:0.3,
        borderRadius:10,
        padding:0,
        shadowColor: '#171717',
        shadowOffset: {width: 4, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    modalYesBtn:{
        padding:5,
        backgroundColor:"white",
        justifyContent:"center",
        borderRadius:10,
        width:60,
        height:40,
        alignItems:"center",
        marginRight:30,
        borderWidth:1,
    },
    modalNoBtn:{
        padding:5,
        backgroundColor:"black",
        borderRadius:10,
        alignItems:"center",
        borderWidth:1,
        width:60,
        height:40,
        justifyContent:"center",
    },
    modalOverlay:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
})

export default SinglePartAnalasis;