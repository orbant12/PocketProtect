
import { View,Text} from "react-native"
import React, {useState,useEffect} from "react";
import { useAuth } from "../../../context/UserAuthContext.jsx";
import Body from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import {updateCompletedParts, fetchCompletedParts, fetchUserData,fetchSkinType } from '../../../services/server.js';
import { spotUploadStyle } from "../../../styles/libary_style.jsx";
import { SideSwitch } from "../../../components/LibaryPage/Melanoma/sideSwitch.jsx";
import { NavBar_Upload_1 } from "../../../components/LibaryPage/Melanoma/navBarRow.jsx";
import { decodeParts } from "../../../utils/melanoma/decodeParts.js";

const AllMelanomaAdd = ({route,navigation}) => {

    const [selectedSide, setSelectedSide] = useState("front");
    const {currentuser} = useAuth()
    const [completedParts, setCompletedParts] = useState([])
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [bodyProgress, setBodyProgress] = useState(0)
    const [userData, setUserData] = useState([])
    const [skinType, setSkinType] = useState(0)

    const completedArea = async (sessionMemory) => {
        setCompletedAreaMarker([])
        const response = await sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)        
        setBodyProgress(response.length / 24)  
        return sessionMemory   
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

    const fetchAllUserData = async () =>{
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response.data())
    }

    const fetchUserSkinType = async () => {
        const response = await fetchSkinType({
            userId: currentuser.uid
        })
        setSkinType(response)
    }

    const conditionalFetching = () => {
        if ( route.params.skin_type != undefined){
            setSkinType(route.params.skin_type)
        } else {
            fetchUserSkinType()
        }

        if (route.params.gender != undefined){
            setUserData(
                {gender:route.params.gender}
            )
        } else {
            fetchAllUserData()
        }
    }

    const handleSlugMemoryChange = async () => {
        if ( completedParts.length != 0){
            const response = await completedArea(completedParts)
            updateCompletedSlug(response)
        }
    }

    useEffect(() => { 
        handleSlugMemoryChange()
    }, [completedParts]); 

    useEffect(() => {
        fetchCompletedSlugs()
        conditionalFetching()
    },[])

    return(        
        <View style={spotUploadStyle.startScreen}>
            <NavBar_Upload_1 navigation={navigation} />
            <View style={{marginTop:0,alignItems:"center",width:"100%",height:"100%",justifyContent:"space-between"}}>            
                <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={completedAreaMarker}
                        gender={userData.gender}
                        side={selectedSide}
                        scale={1.2}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender:userData.gender, userId: currentuser.uid, sessionMemory:completedParts, progress:null,skinColor: skinType })}
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

