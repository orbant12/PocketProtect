import { View, Text, TouchableOpacity,Pressable,ScrollView,StyleSheet,RefreshControl } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/client/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import Body from "../../../components/BodyParts/index";
import { LinearGradient } from 'expo-linear-gradient';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import {bodyFemaleFront} from "../../../components/BodyParts/bodyFemaleFront.ts"
import {bodyFemaleBack} from "../../../components/BodyParts/bodyFemaleBack.ts"
import {bodyFront} from "../../../components/BodyParts/bodyFront.ts"
import {bodyBack} from "../../../components/BodyParts/bodyBack.ts"
import { useAuth } from '../../../context/UserAuthContext.jsx';
import { fetchAllMelanomaSpotData, fetchUserData,fetchCompletedParts, fetchNumberOfMolesOnSlugs } from '../../../server.js';
import { useFocusEffect } from '@react-navigation/native';

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

    const decodeParts = (parts) => {        
        let updatedSessionMemory = []        

        parts.forEach((doc) => {
            updatedSessionMemory.push({ slug: doc });
        })

        return updatedSessionMemory        
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
        navigation.navigate("MelanomaAllAdd", { gender: userData.gender, skin_type: melanomaMetaData.skin_type,sessionMemory:decodeParts(completedParts) });
    }

    const PrevandleAddMelanoma = () => {
        navigation.navigate("MelanomAdd", { data: userData, skin_type: melanomaMetaData.skin_type });
    }

    const getSlugCount = (slug) => {
        const slugObject = numberOfMolesOnSlugs.find(item => Object.keys(item)[0] === slug);
        return slugObject ? slugObject[slug] : 0;
    };

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

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);

//<==================<[ COMPIINETNS ]>====================>

    const dotSelectOnPart = (bodyPart) => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
                {bodyPart != null ? (
                    bodyPart.pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.slug}_${index}`} 
                                d={path}
                                fill={"white"} 
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
                ):null}
                {melanomaData.map((data,index) => (
                        data.melanomaDoc.spot[0].slug == bodyPart.slug && data.gender == userData.gender  ? (
                            <>
                                <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="red" key={`${"circle"}_${index}`} />
                            </>
                        ):null
                    ))
                }
            </Svg>
    
        )
    }

    function SkinSelectModal(){
        return(
        <View style={Mstyles.modalOverlay}> 
        <View style={Mstyles.modalBox}>
            <View style={{marginTop:30,alignItems:"center"}}>  
                <Text style={{fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What is your skin type ?</Text>        
            </View>
            <View style={{flexDirection:"row",width:"85%",justifyContent:"space-between",alignItems:"center",marginBottom:10,marginTop:10}}>
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",0)} style={[{ backgroundColor:"#fde3ce"}, melanomaMetaData.skin_type == 0 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                    
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",1)} style={[{ backgroundColor:"#fbc79d"},melanomaMetaData.skin_type  == 1 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                                    
            </View>

            <View style={{flexDirection:"row",width:"85%",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",2)} style={[{ backgroundColor:"#934506"},melanomaMetaData.skin_type  == 2 ? Mstyles.skinTypeOptionButtonA: Mstyles.skinTypeOptionButton]} />                
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",3)} style={[{ backgroundColor:"#311702"},melanomaMetaData.skin_type == 3 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                
            </View>
            <TouchableOpacity onPress={() => setSkinModal(!skinModal)} style={Mstyles.startButton}>
                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Done</Text>
            </TouchableOpacity>
        </View>
    </View>
    )
    }

    function MelanomaMonitoring(){

        function MelanomaAdd(){
            return(
                <Pressable onPress={handleAddMelanoma} style={Mstyles.AddMelanomaBtn}>
                    <View style={{borderRadius:10,backgroundColor:"black",width:"100%",alignItems:"center",justifyContent:"center",height:"100%"}}>                                         
                        <Text style={{color:"white",opacity:0.5,fontWeight:"600",fontSize:10,marginBottom:5}}>Click to registe a new mole</Text>
                        <Text style={{color:"white",fontWeight:"700",fontSize:17,opacity:0.8}}>
                            + Add New Mole
                        </Text>
                    </View>
                </Pressable>
            )
        }
    
        return(
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
                <View style={Mstyles.ProgressBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        color={"white"}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})} style={{width:"60%",height:50,borderWidth:2,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10}}>
                        <Text style={{color:"white",opacity:0.7,fontWeight:"500",fontSize:10}}>Click to start</Text>
                        <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>                     
                        <Text style={{fontSize:14,fontWeight:"600",marginRight:10,color:"white"}}>Full Body Monitor Setup</Text>                        
                            <MaterialCommunityIcons 
                                name="liquid-spot"
                                size={15}
                                color={"white"}
                            />   
                        </View>                        
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => scrollRef.current.scrollTo({x:0,y:720,animated:true})} style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="monitor-eye"
                        size={20}
                        color={"white"}
                        style={{padding:9}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSkinModal(!skinModal)} style={{backgroundColor:melanomaMetaData.skin_type == 0 ? "#fde3ce" : melanomaMetaData.skin_type == 1 ? "#fbc79d" : melanomaMetaData.skin_type == 2 ? "#934506" : melanomaMetaData.skin_type == 3 ? "#311702":null,borderRadius:"100%",padding:15,borderWidth:2,position:"absolute",right:14,top:70}} />
                
                
                </View>                      
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
                            <MelanomaAdd />
                            <View style={[Mstyles.melanomaTitle,{marginTop:50,marginBottom:30}]}>
                                <View style={Mstyles.melanomaTitleLeft}>
                                    <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
                                    <Text style={{fontSize:20,fontWeight:'bold'}}>Your Moles</Text>                                    
                                </View>

                            </View>
                            <ScrollView horizontal >
            
            
                                {bodySlugs != null && affectedSlugs.length != 0 ? (
                                    bodySlugs.map((bodyPart,index) => (
                                        <View style={[Mstyles.melanomaBox,!completedParts.includes(bodyPart.slug) ? {borderColor:"red"} : {borderColor:"lightgreen"}]} key={`box_${bodyPart.slug}_${index}`}>
                                            <Text style={{fontSize:20,fontWeight:700,color:"white"}}>{bodyPart.slug}</Text>
                                            <Text style={{fontSize:15,fontWeight:500,opacity:0.7,color:"white",marginBottom:10}}>Birthmarks: {getSlugCount(bodyPart.slug)}</Text>
                                            
                                            <View>
                                                {dotSelectOnPart(bodyPart)}
                                            </View>
                                            <TouchableOpacity style={Mstyles.showMoreBtn} onPress={() => navigation.navigate("SlugAnalasis",{ data: bodyPart,userData: userData,skin_type:melanomaMetaData.skin_type,isCompleted:completedParts.includes(bodyPart.slug)})}>
                                                <Text style={{fontSize:15,fontWeight:500,opacity:0.7,color:"white"}}>Open Analasis</Text>
                                            </TouchableOpacity>
                                           {completedParts.includes(bodyPart.slug) ? <Text style={{color:"lightgreen",fontWeight:"500",opacity:0.5,fontSize:10,position:"absolute",bottom:10}}>Marked as complete</Text> : <Text style={{color:"red",fontWeight:"500",opacity:0.5,fontSize:10,position:"absolute",bottom:10}}>Not marked as complete</Text>}
                                            <View style={[Mstyles.redDotLabel,!completedParts.includes(bodyPart.slug) ? {backgroundColor:"red"} : {backgroundColor:"lightgreen"}]} />
            
                                        </View>
                                    ))
                                ):null}
                            
                            </ScrollView>
                        </View>
    
                        <View style={Mstyles.educationSection}>
                            <View style={{width:"90%",height:100,borderWidth:1,alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:20}}>
                                <Text style={{fontSize:15,fontWeight:"600"}}>How do we detect moles ?</Text>
                            </View>
    
                            <View style={{width:"90%",height:100,borderWidth:1,alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:20}}>
                                <Text style={{fontSize:15,fontWeight:"600"}}>How can you detect moles ?</Text>
                            </View>
    
                            <View style={{width:"90%",height:100,borderWidth:1,alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:20}}>
                                <Text style={{fontSize:15,fontWeight:"600"}}>How to protect yourself ?</Text>
                            </View>
                        </View>
                    </View>                
            </ScrollView>
        )
    }

    return(
        <>
            {MelanomaMonitoring()}
            {skinModal && SkinSelectModal()}
        </>
    )
}


const Mstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:10,
        width: '100%',
        alignItems: 'center',
    },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between",
        position:"absolute",
        top:50,
        zIndex:5   
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        textAlign:"center",
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    MelanomaMonitorSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '95%',
        paddingTop: 200,
        flex:1,
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'red',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#00FF00',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    colorExplain: {
        flexDirection: 'column',
        alignItems: 'left',
        position: 'absolute',
        marginTop: 10,
        top: 450,
        left: 20,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 100,
        left: 0,
    },
    melanomaTag: {
        flexDirection: 'column',
        justifyContent:"center",
        textAlign:"center",
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 0.6,
        opacity:0.6,
        padding: 3,
        borderRadius: 5,
        width: "50%",
        marginBottom: 5,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 0,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
        marginBottom:50
    
    },
    analasisSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 30,
    },
    melanomaBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 3,
        width: 250,
        height: 350,
        borderRadius: 5,
        backgroundColor:"rgba(0,0,0,0.92)",
        borderColor:"lightgreen",
        marginRight: 10,
        marginLeft:20,
        padding: 20,
        marginBottom: 70,
    },
    showMedicalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },
    melanomaTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '92%',
        marginTop:135
    },
    melanomaTitleLeft: {
        flexDirection: 'column',
        width: '80%',
        justifyContent:'space-between',
    },
    redDotLabel: {
        width: 40,
        height: 40,
        borderRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius:10,
        backgroundColor: 'lightgreen',
        position: 'absolute',        
        borderColor: 'gray',
        top: 0,
        right: 0,
    },
    showMoreBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
        borderColor:"white"
    },
    AddMelanomaBtn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:10, 
        borderColor:"#fc8bfb",  
        backgroundColor:"#fc8bfb",      
        borderStyle: 'solid',
        width: "90%",
        height: 80,
        borderRadius: 10, 
        position:"absolute",
        top:-70
    },
    educationSection:{
        width:"100%",
        alignItems:"center"
    },
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        borderWidth:6,
        borderRadius:5,
        padding:0,
        width:"85%",
        height:"65%",
        shadowColor: '#171717',
        shadowOffset: {width: 10, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 30,
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    skinTypeOptionButtonA:{
        flexDirection:"column",
        width:125,
        alignItems:"center",
        justifyContent:"center",
        height:125,
        borderWidth:5,
        borderColor:"magenta",
        borderRadius:15,
        padding:20,
    },
    skinTypeOptionButton:{
        flexDirection:"column",
        width:125,
        alignItems:"center",
        justifyContent:"center",
        height:125,
        borderRadius:30,
        padding:20,
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:30,
        backgroundColor:"black"
    },

})

export default SingleFeature;