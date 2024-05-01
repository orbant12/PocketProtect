
//BASICS
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image  } from 'react-native';
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//SVG
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

//Time
import moment from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import CalendarNoLabel from '../components/HomePage/HorizontalCallendarNoLabel';
import Body from "react-native-body-highlighter";

import {bodyFemaleFront} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFemaleFront.ts"
import {bodyFemaleBack} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFemaleBack.ts"
import {bodyFront} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyFront.ts"
import {bodyBack} from "/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/assets/bodyBack.ts"

import { fetchAllMelanomaSpotData, fetchUserData } from '../server';

const ForYouPage = ({navigation}) => {


//<********************VARIABLES************************>
    const today = new Date();

    const format = moment(today).format('YYYY-MM-DD')

    const { currentuser } = useAuth();

    const [selectedDate, setSelectedDate] = useState(format);

    const [swipeActive, setSwipeActive] = useState("data");

    const [userData , setUserData] = useState([]);

    const [selectedSide, setSelectedSide] = useState("front");

    const [melanomaData, setMelanomaData] = useState([])

    const [bodySlugs, setBodySlugs] = useState(null)


//<********************FUNCTIONS************************>

const fetchAllMelanomaData = async () => {
    if(currentuser){
        const response = await fetchAllMelanomaSpotData({
            userId: currentuser.uid,
        });
        const melanomaData = response;
        setMelanomaData(melanomaData);
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
    }
}

const BodySvgSelector = () => {
    if(userData.gender == "male" && selectedSide == 'front'){
        setBodySlugs(bodyFront);
    } else if ( userData.gender == "female" && selectedSide == 'front' ){
        setBodySlugs(bodyFemaleFront);
        console.log(bodyFemaleFront)
    } else if ( userData.gender == "male" && selectedSide == 'back' ){
        setBodySlugs(bodyBack);
    } else if ( userData.gender == "female" && selectedSide == 'back' ){
        setBodySlugs(bodyFemaleBack);
    }
}

useEffect(() => {
    fetchAllMelanomaData();
    fetchAllUserData();
    BodySvgSelector()
}, []);

useEffect(() => {
    BodySvgSelector()
}, [userData, selectedSide]);

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
            {melanomaData.map((data) => (
                    data.melanomaDoc.spot[0].slug == bodyPart.slug ? (
                        <>
                            <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="red" />
                        </>
                    ):null
                ))
            }
        </Svg>

    )
}


//<******************** MELANOMA ************************>

function MelanomaMonitoring(){
    return(
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
                data={[
                { slug: "chest", intensity: 1 },
                { slug: "neck", intensity: 2 },
                ]}
                gender={userData.gender}
                side={selectedSide}
                scale={1.1}
                //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                colors={{ 0: "#FF0000", 1: "#00FF00", 2: "#0000FF" }}
                onBodyPartPress={(slug) => navigation.navigate("BodyPartAnalasis", { data: userData })}
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

            <View style={Mstyles.analasisSection}>
                <View style={Mstyles.melanomaTitle}>
                    <View style={Mstyles.melanomaTitleLeft}>
                        <Text style={styles.titleTag}>Artifical Inteligence</Text>
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
                        bodySlugs.map(bodyPart => (
                            <View style={Mstyles.melanomaBox}>
                            <Text style={{fontSize:20,fontWeight:700}}>{bodyPart.slug}</Text>
                            <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Birthmarks: 21</Text>
                            <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Risky ones: 2</Text>
                            <View>
                                {dotSelectOnPart(bodyPart)}
                            </View>
                            <Pressable style={Mstyles.showMoreBtn} onPress={() => navigation.navigate("SlugAnalasis",{ data: bodyPart})}>
                                <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Show Analasis</Text>
                            </Pressable>
                            <View style={Mstyles.redDotLabel} />

                        </View>
                        ))
                    ):null}
                
                </ScrollView>
            </View>
        </View>
    )
}

const Mstyles = StyleSheet.create({
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
        width: 300,
        height: 400,
        borderRadius: 10,
        marginRight: 20,
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


})


//<******************** SCORE ************************>

function DataSection(){
    return(
        <View>
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
        </View>


        <View style={styles.DetectionSection}>
            <View style={styles.ResultsScoreTitleRow}>
            <View style={styles.scoreTitle}>
            <View style={styles.scoreTitleLeft}>
                <Text style={styles.titleTag}>Digital and Downloadable</Text>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Medical Data</Text>
                <Text style={{fontSize:15}}>Find your medical records any time all in one place</Text>   
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
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Blood Work</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.DetectBox}>
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Allergies</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.DetectBox}>
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Allergies</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>
        </View>
        </View>
    )
}


//<******************** BASE ************************>

return(

    <ScrollView style={styles.container}>
        <CalendarNoLabel onSelectDate={setSelectedDate} selected={selectedDate} />
        <StatusBar style="auto" />
        {!swipeActive == "data" ?
            <DataSection />
            :
            <MelanomaMonitoring />
        }
            
    </ScrollView>

)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:50,
        width: '100%',
    },
    personalScoreSection: {
        padding: 20,
        borderBottomColor: 'black',
        alignItems: 'center',
        maxWidth: '100%',
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom:5,
        margin: 5,
    },
    BoxPoint: {
        fontSize: 12,
        fontWeight: 'bold',
        margin:5
    },
    //DETECTION
    DetectionSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
    },
    DataCol: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        margin:5,
        marginLeft:20,
    },
    DetectBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginBottom: 30,
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

});



export default ForYouPage;