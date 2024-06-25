
import { View,Text,PixelRatio,Dimensions} from "react-native"
import React, {useState,useEffect,useCallback} from "react";
import { useAuth } from "../../../context/UserAuthContext";
import Body, { Slug } from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import {updateCompletedParts, fetchCompletedParts, fetchUserData,fetchSkinType } from '../../../services/server';
import { spotUploadStyle } from "../../../styles/libary_style";
import { SideSwitch } from "../../../components/LibaryPage/Melanoma/sideSwitch";
import { NavBar_Upload_1 } from "../../../components/LibaryPage/Melanoma/navBarRow";
import { decodeParts } from "../../../utils/melanoma/decodeParts";
import { useFocusEffect } from '@react-navigation/native';
import { Navigation_MoleUpload_2, SkinType, UserData } from "../../../navigation/navigation";
import { NavBar_OneOption } from "../../../components/Common/navBars";
import { styles_shadow } from "../../../styles/shadow_styles";
import { UserData_Default } from "../../../utils/initialValues";

const { width, height } = Dimensions.get('window');
const scaleFactor = width < 380 ? 1.1 : 1.4;

const AllMelanomaAdd = ({route,navigation}) => {

    const [selectedSide, setSelectedSide] = useState<"back" | "front">("front");
    const {currentuser} = useAuth()
    const [completedParts, setCompletedParts] = useState<{slug:Slug}[]>([])
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [bodyProgress, setBodyProgress] = useState(0)
    const [userData, setUserData] = useState<UserData>(UserData_Default)
    const [skinType, setSkinType] = useState<SkinType>(0)

    const completedArea = async (sessionMemory:{slug:Slug}[]) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)        
        setBodyProgress(response.length / 24)  
        return sessionMemory   
    }

    const updateCompletedSlug = async (completedArray:{slug:Slug}[]) => {
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
            if(response != null){
                const completedSlugs = response.map(part => part.slug); 
                const decoded = decodeParts(completedSlugs)
                setCompletedParts(decoded)  
            }
        }
    }

    const fetchAllUserData = async () =>{
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response)
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
                {
                    ...userData,
                    gender:route.params.gender
                }
            )
        } else {
            fetchAllUserData()
        }
    }

    const handleSlugMemoryChange = async () => {
        if (completedParts != null){
            const response = await completedArea(completedParts)
            updateCompletedSlug(response)
        } else if (completedParts != null) {
            await completedArea(completedParts)
        }
    }

    useEffect(() => { 
        handleSlugMemoryChange()
    }, [completedParts]); 

    useFocusEffect(
        useCallback(() => {
            fetchCompletedSlugs()
            conditionalFetching()
        return () => {};
        }, [])
    );

    return(        
        <View style={spotUploadStyle.startScreen}>
                <NavBar_OneOption 
                icon_left={{name:"arrow-left",size:30,action:() => navigation.goBack()}}
                title={"Press to select a body part"}
                styles={{marginTop:-50,marginBottom:30}}
            />  
            <View style={{marginTop:0,alignItems:"center",width:"100%",height:"100%",justifyContent:"space-between"}}>            
                <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                <View style={styles_shadow.shadowContainer}>
                <Body
                    data={completedAreaMarker}
                    gender={userData.gender}
                    side={selectedSide}
                    scale={scaleFactor}
                    colors={['#A6FF9B']}
                    onBodyPartPress={(slug) => Navigation_MoleUpload_2({
                        bodyPartSlug: slug,
                        gender: userData.gender,
                        completedArray:completedParts,
                        progress:null,
                        skin_type: skinType,
                        navigation: navigation
                    })}
                />
                </View>
                    <ColorLabels />
                    <SideSwitch 
                        selectedSide={selectedSide}
                        setSelectedSide={setSelectedSide}
                    />
            </View>
        </View>
    )
}

export default AllMelanomaAdd




const ColorLabels = () => {
    return(
        <View style={[spotUploadStyle.colorExplain,{top:100}]}>
        <View style={spotUploadStyle.colorExplainRow} >
        <View style={spotUploadStyle.redDot} />
            <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Empty</Text>
        </View>

        <View style={spotUploadStyle.colorExplainRow}>
            <View style={spotUploadStyle.greenDot} />
            <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Complete</Text>
        </View>
    </View>
    )
}

