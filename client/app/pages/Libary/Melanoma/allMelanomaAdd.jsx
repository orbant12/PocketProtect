
import { View,Text,StyleSheet,Pressable,TouchableOpacity } from "react-native"
import React, {useState,useEffect} from "react";
import { useAuth } from "../../../context/UserAuthContext.jsx";
import Body from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import {updateCompletedParts} from '../../../services/server.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { spotUploadStyle } from "../../../styles/libary_style.jsx";

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
            <NavBar navigation={navigation} />
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
                    <View style={spotUploadStyle.positionSwitch}>
                    <Pressable onPress={() => setSelectedSide("front")}>
                        <Text style={selectedSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                    </Pressable>
                    <Text>|</Text>
                    <Pressable onPress={() => setSelectedSide("back")}>
                        <Text style={selectedSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                    </Pressable>
                </View>    
            </View>
        </View>
    )
}

export default AllMelanomaAdd


export const NavBar = ({navigation}) => {
    return(
        <View style={spotUploadStyle.ProgressBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={25}
                color={"white"}
                style={{padding:5}}
            />
        </TouchableOpacity> 
        <View style={{width:"85%",backgroundColor:"rgba(0,0,0,0.05)",alignItems:"center",justifyContent:"center",marginBottom:0,padding:10,borderRadius:10}}>
                <Text style={{fontWeight:"700",fontSize:18}}>Press the body part to monitor</Text>    
            </View>                                
        </View> 
    )
}