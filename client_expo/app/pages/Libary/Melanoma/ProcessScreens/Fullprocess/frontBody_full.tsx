import { View,Text,Pressable, Animated, Easing } from "react-native";

import Body from "../../../../../components/LibaryPage/Melanoma/BodyParts/index";
import ProgressBar from 'react-native-progress/Bar';
import { Navigation_MoleUpload_2 } from "../../../../../navigation/navigation";
import { useEffect, useRef, useState } from "react";
import { NotAllSlugModal } from "./modals/notAllSlugs";



export function ThirdScreen({
    userData,
    melanomaMetaData,
    setProgress,
    progress,
    completedParts,
    updateCompletedSlug,
    navigation,
    completedAreaMarker,
    currentSide,
    bodyProgress,
    setIsModalUp,
    isModalUp,
    setCurrentSide,
    scaleFactor,
    styles,
    setCompletedAreaMarker
}){
    // RANDOM BODY PART COLOR POP CHANGE FADE IN FADE OUT

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bodyPartysArray = ["abs","chest","left-arm","right-arm","upper-leg-right","upper-leg-left","lower-leg-right","lower-leg-left","right-feet","left-feet","right-hand","left-hand"]
    let index = 0

    useEffect(() => {
        // Function to trigger color change and animation
        const changeColor = () => {
            // Change to a random color
            
            if(bodyProgress == 0){
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

        // Change color every 3 seconds
        const interval = setInterval(changeColor, 1500);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [bodyProgress]);

    return(
        <>
                <View style={[styles.startScreen,{height:"85%",marginTop:"5%",justifyContent:"space-between"}]}>
                    <View style={{marginTop:0,alignItems:"center"}}>  
                        <View style={{alignItems:"center",padding:15,backgroundColor:"rgba(0,0,0,0.05)",borderRadius:10}}>
                            <Text style={{marginBottom:20,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                            <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                        </View>
                        <View style={{marginTop:20}}>
                        <Body
                            data={completedAreaMarker}
                            gender={userData.gender}
                            side={currentSide}
                            scale={scaleFactor}
                            colors={['#A6FF9B','#FFFFFF','#ff80db']} // Apply the animated color here
                            onBodyPartPress={(slug) =>
                                Navigation_MoleUpload_2({
                                    bodyPartSlug: slug,
                                    gender: userData.gender,
                                    skin_type: melanomaMetaData.skin_type,
                                    progress: progress,
                                    completedArray: completedParts,
                                    navigation: navigation,
                                })
                            }
                            skinColor={melanomaMetaData.skin_type}
                        />
                        </View>        

                            <View style={[styles.colorExplain,{bottom:0}]}>
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

                    <Pressable onPress={() => bodyProgress == 1 ? setProgress(progress + 0.1) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:1,borderWidth:1,alignItems:"center",width:"90%",borderRadius:10,marginBottom:10,backgroundColor:"rgba(0,0,0,0.5)",marginTop:0}}>
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>

                </View >
            {isModalUp &&
                <NotAllSlugModal 
                    isModalUp={isModalUp}
                    setCurrentSide={setCurrentSide}
                    setProgress={setProgress}
                    progress={progress}
                    setIsModalUp={setIsModalUp}
                />
            }
        </>
    )
}

