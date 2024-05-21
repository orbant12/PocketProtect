
import { View, Text, Pressable, ScrollView,StyleSheet,TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//BASICS

import React, {useEffect, useState} from 'react';

//SVG
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

//Time
import moment from 'moment'

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Body from "../components/BodyParts/index";

import {bodyFemaleFront} from "../components/BodyParts/bodyFemaleFront.ts"
import {bodyFemaleBack} from "../components/BodyParts/bodyFemaleBack.ts"
import {bodyFront} from "../components/BodyParts/bodyFront.ts"
import {bodyBack} from "../components/BodyParts//bodyBack.ts"

import { fetchAllMelanomaSpotData, fetchUserData } from '../server';

const DetectionLibary = ({navigation}) => {

    //<********************VARIABLES************************>        
    const { currentuser } = useAuth();

    const [isSelected, setIsSelected ] = useState("Melanoma")
    const [userData , setUserData] = useState([]);
    const [selectedSide, setSelectedSide] = useState("front");
    const [melanomaData, setMelanomaData] = useState([])
    const [bodySlugs, setBodySlugs] = useState(null)
    const [ affectedSlugs,setAffectedSlugs ] = useState([])
    const [ isFirstMelanoma, setIsFirstMelanoma ] = useState(true)

//<********************FUNCTIONS************************>

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
            setIsFirstMelanoma(false)
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
    }
}

const handleAddMelanoma = () => {
    navigation.navigate("MelanomaAdd", { data: userData });
}

useEffect(() => {
    fetchAllUserData();
    BodySvgSelector()
    AffectedSlugMap()
}, []);

useEffect(() => {
    BodySvgSelector()
    AffectedSlugMap()
}, [userData, selectedSide,melanomaData]);


//<=====> COMPONENTS <==========>


function MelanomaMonitoring(){

    function MelanomaAdd(){
        return(
            <Pressable onPress={handleAddMelanoma} style={Mstyles.AddMelanomaBtn}>
                <Text>
                    + Add Melanoma
                </Text>
            </Pressable>
        )
    }

    return(
        <ScrollView>
            <View style={Mstyles.container}>
                <View style={Mstyles.MelanomaMonitorSection}>
                    <View style={Mstyles.melanomaTitle}>
                        <View style={Mstyles.melanomaTitleLeft}>
                            <Text style={Mstyles.melanomaTag}>Computer Vision</Text>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Melanoma Monitoring</Text>
                            <Text style={{fontSize:15}}>Click on the body part for part analasis</Text>   
                        </View>
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{marginLeft:10}}
                        />
                    </View>
                    <Body
                        data={affectedSlugs}
                        gender={userData.gender}
                        side={selectedSide}
                        scale={1.1}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#FF0000', '#A6FF9B','#FFA8A8']}
                        onBodyPartPress={(slug) => navigation.navigate("SlugAnalasis", { data: slug,gender:userData.gender })}
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
        
                    <MelanomaAdd />
        
                    <View style={Mstyles.analasisSection}>
                        <View style={Mstyles.melanomaTitle}>
                            <View style={Mstyles.melanomaTitleLeft}>
                                <Text style={Mstyles.titleTag}>Artifical Inteligence</Text>
                                <Text style={{fontSize:20,fontWeight:'bold'}}>Analasis</Text>
                                <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                            </View>
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={30}
                                color="black"
                                style={{marginLeft:10}}
                            />
                        </View>
                        <ScrollView horizontal >
        
        
                            {bodySlugs != null ? (
                                bodySlugs.map((bodyPart,index) => (
                                    <View style={Mstyles.melanomaBox} key={`box_${bodyPart.slug}_${index}`}>
                                        <Text style={{fontSize:20,fontWeight:700}}>{bodyPart.slug}</Text>
                                        <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Birthmarks: 21</Text>
                                        
                                        <View>
                                            {dotSelectOnPart(bodyPart)}
                                        </View>
                                        <Pressable style={Mstyles.showMoreBtn} onPress={() => navigation.navigate("SlugAnalasis",{ data: bodyPart,gender: userData.gender})}>
                                            <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Show Analasis</Text>
                                        </Pressable>
                                        <View style={Mstyles.redDotLabel} />
        
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
            </View>
        </ScrollView>
    )
}

function HealthScore(){
    return(
        <ScrollView style={styles.container}>
        <View style={styles.personalScoreSection}>
            <View style={styles.scoreTitle}>
                <View style={styles.scoreTitleLeft}>
                    <Text style={styles.titleTag}>Artifical Inteligence</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Personal Score</Text>
                    <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
            <View style={styles.scoreCircle}>
                <Text style={{fontSize:50,fontWeight:'bold'}}>17</Text>
                <Text style={{fontSize:15,fontWeight:700}}>out of 100</Text>

            </View>

            <View style={styles.ResultsScoreSection}>
                <View style={styles.ResultsScoreTitleRow}>
                    <Text style={{fontSize:18,fontWeight:700}}>Results</Text>
                    <Pressable onPress={() => navigation.navigate("Assistant")}>
                        <Text style={{fontSize:13,fontWeight:500,opacity:0.7}}>My Data</Text>
                    </Pressable>
                </View>
                <ScrollView horizontal style={{paddingBottom:20}} >
                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.DetectionSection}>
                <View style={styles.ResultsScoreTitleRow}>
                <View style={styles.scoreTitle}>
                <View style={styles.scoreTitleLeft}>
                    <Text style={styles.titleTag}>Artifical Inteligence</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Diases Detection</Text>
                    <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
                </View>
                    <View style={styles.DetectBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>     
            </View>

        </View>

    </ScrollView>
    )
}

const dotSelectOnPart = (bodyPart) => {
    return (
        <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
            {bodyPart != null ? (
                bodyPart.pathArray.map((path, index) => (
                        <Path
                            key={`${bodyPart.slug}_${index}`} 
                            d={path}
                            fill="blue" 
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

function Navbar(){
    return(
        <ScrollView horizontal style={{position:"absolute",marginTop:60,paddingLeft:80,marginRight:"auto",flexDirection:"row",width:"100%",zIndex:5}}>
            <TouchableOpacity onPress={() => setIsSelected("HealthScore")} style={isSelected == "HealthScore" ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                <Text style={isSelected == "HealthScore"?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:800,color:"black"}}>Health Score</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("Melanoma")} style={isSelected == "Melanoma" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30} : {marginLeft:30}}>
                <Text style={isSelected == "Melanoma" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Melanoma</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}


return(
    <>
        <Navbar />
        {isSelected == "HealthScore" ? 
            <HealthScore />
        :isSelected == "Melanoma" ? 
            (isFirstMelanoma ?
                <MelanomaMonitoring />
                :
                <View style={Mstyles.container} >
                    <Text>DSDS</Text>
                </View>
            )
        :null
        }
    </>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:100
    },
    personalScoreSection: {
        padding: 20,
        borderBottomColor: 'black',
        alignItems: 'center',
        width: '100%',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    scoreTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    scoreTitleLeft: {
        flexDirection: 'column',
        width: '55%',
        justifyContent:'space-between',
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'black',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    //RESULTS
    ResultsScoreSection: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        marginTop: 20,
    },
    ResultsScoreTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    ResultsScoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    ResultBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },
    BoxTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    BoxPoint: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom:10
    },
    //DETECTION
    DetectionSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
    },
    DetectBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },

});

const Mstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:100,
        width: '100%',
        alignItems: 'center',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
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
        width: '100%',
        marginTop: 20,
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
        top: 280,
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
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
        width: "43%",
        marginBottom: 5,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 10,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
    
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
        borderWidth: 1,
        width: 250,
        height: 350,
        borderRadius: 10,
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
        marginBottom: 20,
        width: '95%',
    },
    melanomaTitleLeft: {
        flexDirection: 'column',
        width: '60%',
        justifyContent:'space-between',
    },
    redDotLabel: {
        width: 40,
        height: 40,
        borderRadius: 0,
        borderTopRightRadius: 10,
        borderBottomLeftRadius:20,
        backgroundColor: 'red',
        position: 'absolute',
        borderWidth: 1,
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
    },
    AddMelanomaBtn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        width: "70%",
        height: 80,
        borderRadius: 10,
        margin: 10,
        marginTop:30
    },
    educationSection:{
        width:"100%",
        alignItems:"center"
    }

})

export default DetectionLibary;