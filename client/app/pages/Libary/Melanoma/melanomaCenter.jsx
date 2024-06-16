import { View, Text, TouchableOpacity,Pressable,ScrollView,StyleSheet,RefreshControl } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Body from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import { LinearGradient } from 'expo-linear-gradient';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import {bodyFemaleFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleFront"
import {bodyFemaleBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleBack"
import {bodyFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFront"
import {bodyBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyBack"
import { useAuth } from '../../../context/UserAuthContext.jsx';
import { fetchAllMelanomaSpotData, fetchUserData,fetchCompletedParts, fetchNumberOfMolesOnSlugs } from '../../../services/server.js';
import { useFocusEffect } from '@react-navigation/native';
import { SkinModal } from "../../../components/LibaryPage/Melanoma/modals";
import { Mstyles } from "../../../styles/libary_style";
import { NavBar_Main } from "../../../components/LibaryPage/Melanoma/navBarRow";
import { SlugCard } from "../../../components/LibaryPage/Melanoma/slugCard";
import { Navigation_MoleUpload_1 } from "../../../navigation/navigation";
import { AssistantAdvertBox } from "../../../components/LibaryPage/Melanoma/Assistance/assistantAdvert";



const SingleFeature = ({route,navigation}) => {

//<==================<[ Variables ]>====================>

    const { currentuser } = useAuth();
    const [userData , setUserData] = useState([]);
    const [bodySlugs, setBodySlugs] = useState(null)
    const [ affectedSlugs,setAffectedSlugs ] = useState([])
    const [selectedSide, setSelectedSide] = useState("front");
    const [melanomaData, setMelanomaData] = useState([])
    const [ completedParts, setCompletedParts] = useState([])
    const [numberOfMolesOnSlugs,setNumberOfMolesOnSlugs] = useState([])
    const [ melanomaMetaData, setMelanomaMetaData] = useState({
        sunburn:[{
            stage:0,
            slug:""
        }],
        skin_type: 0,
        detected_relative:"none",

    })
    const [ skinModal,setSkinModal] = useState(false)
    const scrollRef = useRef(null)
    const [refreshing, setRefreshing] = useState(false);


//<==================<[ Functions ]>====================>

    const fetchAllMelanomaData = async (gender) => {
        if(currentuser){
            const response = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender
            });
            const melanomaData = response;
            if(melanomaData != false){
                setMelanomaData(melanomaData);
            } else {
                setMelanomaData([])
            }
        }
    }

    const fetchAllUserData = async () => {
        if(currentuser){
            const response = await fetchUserData({
                userId: currentuser.uid,
            });
            const docSnapshot = response;
            const elementData = docSnapshot.data();
            setUserData(elementData);
            fetchAllMelanomaData(elementData.gender)
        }
    }

    const fetchAllCompletedParts = async () => {
        if(currentuser){
            const response = await fetchCompletedParts({
                userId: currentuser.uid,
            });
            const completedSlugs = response.map(part => part.slug);     
            setCompletedParts(completedSlugs)
            console.log(response)
        }
    }

    const fetchAllNumberOfMoleOnSlug = async () => {
        if(currentuser){
            const response = await fetchNumberOfMolesOnSlugs({
                userId: currentuser.uid,
            });
            setNumberOfMolesOnSlugs(response)
            console.log(response)
        }
    }

    const BodySvgSelector = () => {
        if(userData.gender == "male" && selectedSide == 'front'){
            setBodySlugs(bodyFront);
        } else if ( userData.gender == "female" && selectedSide == 'front' ){
            setBodySlugs(bodyFemaleFront);
        } else if ( userData.gender == "male" && selectedSide == 'back' ){
            setBodySlugs(bodyBack);
        } else if ( userData.gender == "female" && selectedSide == 'back' ){
            setBodySlugs(bodyFemaleBack);
        }
    }
    
    const AffectedSlugMap = () => {
        if(melanomaData != null){
            const affectedSlug = melanomaData.map((data, index) => {
                const spotSlug = data.melanomaDoc.spot[0]?.slug;
                const intensity = data.risk >= 0.3 ? (data.risk >= 0.8 ? 1 : 3) : 2;
                return { slug: spotSlug, intensity, key: index }; // Adding a unique key
            });
            setAffectedSlugs(affectedSlug);
            console.log(affectedSlug[0])
        }
    }

    const handleAddMelanoma = () => {
        Navigation_MoleUpload_1({
            gender:userData.gender,
            skin_type: melanomaMetaData.skin_type,
            navigation: navigation
        })
    }

    const handleMelanomaDataChange = (type, data) => {
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
                ...(type === "detected_relative" && { detected_relative: data })
            };
            });
    };

    const handleRefresh = () => {
        BodySvgSelector()
        AffectedSlugMap(); 
        fetchAllUserData();
        fetchAllCompletedParts();
        fetchAllNumberOfMoleOnSlug();
    }

    const handleNavigation = (path,data) => {
        if ( path ==  "SlugAnalasis"){
            navigation.navigate("SlugAnalasis",{ data: data,userData: userData,skin_type:melanomaMetaData.skin_type,isCompleted:completedParts.includes(data.slug)})
        }
    }

    useFocusEffect(
        React.useCallback(() => {
        handleRefresh();
        return () => {};
        }, [])
    );

    useEffect(() => {
        BodySvgSelector()
        AffectedSlugMap()
    }, [userData, selectedSide,melanomaData]);
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []); 


//<==================<[ Main Return ]>====================>

    return(
        <>
            <ScrollView 
                style={{backgroundColor:"white"}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']} 
                        tintColor={'magenta'}       
                    />
                }
                scrollEventThrottle={16}
                ref={scrollRef}
            >
                <View style={Mstyles.container}>
                    <NavBar_Main 
                        setSkinModal={setSkinModal}
                        skinModal={skinModal}
                        navigation={navigation}
                        scrollRef={scrollRef}
                        melanomaMetaData={melanomaMetaData}
                    />                   
                    <LinearGradient
                        colors={['white', '#fc8bfb','white']}
                        locations={[0.2,0.9,0.2]}        
                        style={{width:"100%",alignItems:"center"}}
                    >      
                    <View style={Mstyles.melanomaTitle}>
                        <View style={Mstyles.melanomaTitleLeft}>
                            <Text style={Mstyles.melanomaTag}>Computer Vision</Text>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Melanoma Monitoring</Text>
                            <Text style={{fontSize:12,maxWidth:"100%",opacity:0.4,marginTop:5,fontWeight:"500"}}>Click on the body part for part analasis</Text>   
                        </View>       
                    </View>
                    <Body
                        data={affectedSlugs}
                        gender={userData.gender}
                        side={selectedSide}
                        scale={1.1}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#FF0000', '#A6FF9B','#FFA8A8']}
                        onBodyPartPress={(slug) => navigation.navigate("SlugAnalasis", { data: slug,userData:userData, skin_type: melanomaMetaData.skin_type })}
                        zoomOnPress={true}
                    />
        
                    <View style={Mstyles.colorExplain}>
                        <View style={Mstyles.colorExplainRow} >
                            <View style={Mstyles.redDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Higher risk</Text>
                        </View>
        
                        <View style={Mstyles.colorExplainRow}>
                            <View style={Mstyles.greenDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>No risk</Text>
                        </View>
                    </View>
        
                    <View style={Mstyles.positionSwitch}>
                        <Pressable onPress={() => setSelectedSide("front")}>
                            <Text style={selectedSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                        </Pressable>
                        <Text>|</Text>
                        <Pressable onPress={() => setSelectedSide("back")}>
                            <Text style={selectedSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                        </Pressable>
                    </View>                      
                    </LinearGradient>                    
            
                    <View style={Mstyles.analasisSection}>
                        <Pressable onPress={handleAddMelanoma} style={Mstyles.AddMelanomaBtn}>
                            <View style={{borderRadius:10,backgroundColor:"black",width:"100%",alignItems:"center",justifyContent:"center",height:"100%"}}>                                         
                                <Text style={{color:"white",opacity:0.5,fontWeight:"600",fontSize:10,marginBottom:5}}>Click to registe a new mole</Text>
                                <Text style={{color:"white",fontWeight:"700",fontSize:17,opacity:0.8}}>
                                    + Add New Mole
                                </Text>
                            </View>
                        </Pressable>
                        <View style={[Mstyles.melanomaTitle,{marginTop:50,marginBottom:30}]}>
                            <View style={Mstyles.melanomaTitleLeft}>
                                <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
                                <Text style={{fontSize:20,fontWeight:'bold'}}>Your Moles</Text>                                    
                            </View>

                        </View>
                        <ScrollView horizontal >
                            {bodySlugs != null && affectedSlugs.length != 0 ? (
                                bodySlugs.map((bodyPart,index) => (
                                    <SlugCard 
                                        handleNavigation={handleNavigation}
                                        bodyPart={bodyPart}
                                        completedParts={completedParts}
                                        numberOfMolesOnSlugs={numberOfMolesOnSlugs}
                                        userData={userData}
                                        melanomaData={melanomaData}
                                        index={index}
                                    />
                                ))
                            ):null}
                        </ScrollView>
                    </View>
    
                    <View style={Mstyles.educationSection}>
                        <AssistantAdvertBox 
                            navigation={navigation}
                        />
                        <View style={{width:"90%",height:100,borderWidth:1,alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:20,marginTop:20}}>
                            <Text style={{fontSize:15,fontWeight:"600"}}>How can you detect moles ?</Text>
                        </View>

                        <View style={{width:"90%",height:100,borderWidth:1,alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:20}}>
                            <Text style={{fontSize:15,fontWeight:"600"}}>How to protect yourself ?</Text>
                        </View>
                    </View>
                </View>                
            </ScrollView>
            <SkinModal 
                setSkinModal={setSkinModal}
                visible={skinModal}
                handleMelanomaDataChange={handleMelanomaDataChange}
                melanomaMetaData={melanomaMetaData}
            />
        </>
    )
}



export default SingleFeature;