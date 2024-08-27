import { View,Text,Pressable, Animated, Easing } from "react-native";

import Body from "../../../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import { Navigation_MoleUpload_2 } from "../../../../../navigation/navigation";
import { useEffect, useRef, useState } from "react";
import { NotAllSlugModal } from "./modals/notAllSlugs";

export function FourthScreen({
    bodyProgressBack,
    setProgress,
    progress,
    completedParts,
    skinColor,
    completedAreaMarker,
    userData,
    currentSide,
    navigation,
    setIsModalUp,
    isModalUp,
    setCurrentSide,
    styles,
    scaleFactor,
    setCompletedAreaMarker
}){

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bodyPartysArray = ["back","left-arm(back)","right-arm(back)","upper-leg-right(back)","upper-leg-left(back)","lower-leg-right(back)","lower-leg-left(back)","right-feet(back)","left-feet(back)","right-palm","left-palm","gluteal"]
    let index = 0

    useEffect(() => {
        
        const changeColor = () => {     
            if(bodyProgressBack == 0){
                setCompletedAreaMarker([ {slug:bodyPartysArray[index],intensity:3} ])
                if(index >= bodyPartysArray.length - 1){
                    index = 0
                } else {
                    index++
                }
            } else {
                return
            }
        };

        const interval = setInterval(changeColor, 1500);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [bodyProgressBack]);

    return(
        <>
        <View style={[styles.startScreen,{height:"85%",marginTop:"5%",justifyContent:"space-between"}]}>
            <View style={{marginTop:0,alignItems:"center"}}>  
                <Text style={{marginBottom:20,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                <ProgressBar progress={bodyProgressBack} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                <View style={{marginTop:20}}>
                <Body
                    data={completedAreaMarker}
                    gender={userData.gender}
                    side={currentSide}
                    scale={scaleFactor}
                    //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                    colors={['#A6FF9B','#FFFFFF','#ff80db']}                       
                    onBodyPartPress={(slug) => 
                        Navigation_MoleUpload_2({
                            bodyPartSlug:slug,
                            gender: userData.gender,
                            skin_type: skinColor,
                            progress: progress,
                            completedArray: completedParts,
                            navigation: navigation
                        })}
                    skinColor={skinColor}
                />
                </View>

            <View style={styles.colorExplain}>
                <View style={styles.colorExplainRow} >
                    <View style={styles.redDot} />
                        <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Empty</Text>
                    </View>

                    <View style={styles.colorExplainRow}>
                        <View style={styles.greenDot} />
                        <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Complete</Text>
                    </View>
                </View>
            </View>

            <Pressable onPress={() => bodyProgressBack == 1 ? setProgress(1) : setIsModalUp(!isModalUp)} style={bodyProgressBack == 1 ? styles.startButton : {opacity:1,borderWidth:1,alignItems:"center",width:"90%",borderRadius:10,marginBottom:10,backgroundColor:"rgba(0,0,0,0.5)",marginTop:0}}>
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
            </Pressable>
        </View>
        {isModalUp ?
            <NotAllSlugModal 
                isModalUp={isModalUp}
                setCurrentSide={setCurrentSide}
                setProgress={setProgress}
                progress={progress}
                setIsModalUp={setIsModalUp}
            />
        :null
        }
    </>
    )
}