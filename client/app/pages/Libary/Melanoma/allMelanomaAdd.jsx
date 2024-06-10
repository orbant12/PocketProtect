
import { View,Text} from "react-native"
import React, {useState,useEffect} from "react";
import { useAuth } from "../../../context/UserAuthContext.jsx";
import Body from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import {updateCompletedParts} from '../../../services/server.js';
import { spotUploadStyle } from "../../../styles/libary_style.jsx";
import { SideSwitch } from "../../../components/LibaryPage/Melanoma/sideSwitch.jsx";
import { NavBar_Upload_1 } from "../../../components/LibaryPage/Melanoma/navBarRow.jsx";

const AllMelanomaAdd = ({route,navigation}) => {

    const [selectedSide, setSelectedSide] = useState("front");
    const gender = route.params.gender
    const skin_type = route.params.skin_type
    const {currentuser} = useAuth()
    const sessionMemory  = route.params.sessionMemory
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [bodyProgress, setBodyProgress] = useState(0)


    const completedArea = async (sessionMemory) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)        
        setBodyProgress(response.length / 24)        
    }

    const updateCompletedSlug = async (completedArray) => {
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
    
    useEffect(() => {
        completedArea(sessionMemory);    
        
        console.log(sessionMemory)
        updateCompletedSlug(sessionMemory)
    }, [sessionMemory,]); 

    return(        
        <View style={spotUploadStyle.startScreen}>
            <NavBar_Upload_1 navigation={navigation} />
            <View style={{marginTop:0,alignItems:"center",width:"100%",height:"100%",justifyContent:"space-between"}}>            
                <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={completedAreaMarker}
                        gender={gender}
                        side={selectedSide}
                        scale={1.2}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender:gender, userId: currentuser.uid, sessionMemory:sessionMemory, progress:null,skinColor: skin_type })}
                        zoomOnPress={true}
                    />
                    <ColorLabels />
                    <SideSwitch 
                        selectedSide={selectedSide}
                        setSelectedSide={setSelectedSide}
                        spotUploadStyle={spotUploadStyle}
                    />
            </View>
        </View>
    )
}

export default AllMelanomaAdd




const ColorLabels = () => {
    return(
        <View style={spotUploadStyle.colorExplain}>
        <View style={spotUploadStyle.colorExplainRow} >
        <View style={spotUploadStyle.redDot} />
            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Empty</Text>
        </View>

        <View style={spotUploadStyle.colorExplainRow}>
            <View style={spotUploadStyle.greenDot} />
            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Complete</Text>
        </View>
    </View>
    )
}

