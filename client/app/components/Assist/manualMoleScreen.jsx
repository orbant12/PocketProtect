import { View,Text,Image,TouchableOpacity } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { NavBar_TwoOption } from "../Common/navBars"
import { SideSwitch } from "../LibaryPage/Melanoma/sideSwitch"
import Body from "../../components/LibaryPage/Melanoma/BodyParts/index";
import React,{ useEffect, useState } from "react";
import { spotUploadStyle,Mstyles } from "../../styles/libary_style";
import { fetchUserData, fetchAllMelanomaSpotData, } from "../../services/server";
import { useAuth } from "../../context/UserAuthContext";
import { decodeParts } from "../../utils/melanoma/decodeParts";
import { Navigation_MoleUpload_1 } from "../../navigation/navigation";

export const ManualAdd_Moles = ({
    closeAction,
    navigation
}) => {

    const [ selectedSide, setSelectedSide] = useState("front")
    const [ userData, setUserData] = useState([])
    const [ selectedMoles, setSelectedMoles ] = useState(["1"])
    const [melanomaData, setMelanomaData] = useState([])
    const { currentuser } = useAuth()

    const handleBodyPartSelected = (slug) => {

    }


    const fetchAllUserData = async () => {
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response.data())
    }

    


    const fetchAllMelanomaData = async () => {
        if(currentuser && userData.length != 0){
            const response = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender:userData.gender
            });
            const melanomaData = response;
            if(melanomaData != false){
                setMelanomaData(melanomaData);            
            } else {
                setMelanomaData([])
            }
        }
    }

    useEffect(() => {
        fetchAllUserData()
        fetchAllMelanomaData()
    },[])

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <NavBar_TwoOption 
                title={"Select moles for review"}
                icon_left={{name:"arrow-left",size:30,action:closeAction}}
                icon_right={{name:"plus",size:30,action:() => {Navigation_MoleUpload_1({navigation:navigation});closeAction()} }}
            />
            <View style={{width:"100%",alignItems:"center",margin:30}}>
                <Text style={{fontWeight:"600"}}>0 Moles Selected</Text>
            </View>  
            <View style={{width:"100%",alignItems:"center"}}>
                <Text style={{alignSelf:"left",fontWeight:"700",margin:10,fontSize:20}}>Highly Recommended</Text>
                <SelectableMole_Bar 
                    selectedMoles={selectedMoles}
                    spotId={"1"}
                />
            </View>
            <View style={{width:"100%",alignItems:"center",marginTop:40}}>
                <Text style={{alignSelf:"left",fontWeight:"700",margin:10,fontSize:20}}>Other Moles</Text>
                <SelectableMole_Bar 
                    selectedMoles={selectedMoles}
                    spotId={"1"}
                />
            </View>
   
            <TouchableOpacity onPress={() => {}} style={{width:"90%",position:"absolute",padding:20,paddingVertical:15,bottom:30,justifyContent:"center",backgroundColor:"magenta",borderRadius:10,alignItems:"center",alignSelf:"center"}}>
                <Text style={{fontSize:"15",fontWeight:"700", color:"white"}}>Next ( 4 Selected )</Text>
            </TouchableOpacity>
        </View>
    )
}


const SelectableMole_Bar = ({
    spotId,
    selectedMoles
}) => {
    return(
        <View style={{width:"95%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10,borderWidth:0.3,marginTop:20,paddingVertical:20,borderRadius:10}}>
            <Image 
                style={{height:50,width:50,borderRadius:10,borderWidth:1}}
            />
            <View>
                <Text>RISK</Text>
                <Text>ID</Text>
            </View>
            <TouchableOpacity>

            </TouchableOpacity>
            {selectedMoles.includes(spotId) ? (
                <MaterialCommunityIcons 
                    name="checkbox-blank-outline"
                    size={30}
                />
            ) : (
                <MaterialCommunityIcons 
                    name="checkbox-intermediate"
                    size={30}
                />
            )

            }
        </View>
    )
}


    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={80} width={80} > 
        
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
                                        bodyPart.slug == "right-arm" ? `translate(-300 -230)`
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
                                        bodyPart.slug == "right-arm" ? `translate(-300 -230)`
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
