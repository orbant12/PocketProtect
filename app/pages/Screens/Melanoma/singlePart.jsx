import { useEffect,useState } from "react";
import { View, StyleSheet,Text } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

import { fetchMelanomaSpotData } from "../../../server";

const SinglePartAnalasis = ({ route }) => {

//<***************************  Variables ******************************************>


const bodyPart = route.params.data;

//<***************************  Functions ******************************************>




//<***************************  Components ******************************************>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" style={{borderWidth:1}} height={200} width={350} > 

                    {bodyPart.melanomaDoc.spot[0].pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.melanomaDoc.spot[0].slug}_${index}`} 
                                d={path}
                                fill="blue" 
                                stroke={bodyPart.melanomaDoc.spot[0].color} 
                                strokeWidth="2"
                                rotation={
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? "-20"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? "20"
                                    :
                                    null
                                }
                                transform={
            
                                    bodyPart.melanomaDoc.spot[0].slug == "chest" ? `translate(-180 -270)` 
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "head" ? `translate(-140 -70)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "legs" ? `translate(-140 -100)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "torso" ? `translate(-140 -100)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "feet" ? `translate(-140 -100)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "abs" ? `translate(-60 -390)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? `translate(40 -670)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? `translate(-480 -670)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? `translate(120 -420)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? `translate(-300 -230)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? `translate(0 -650)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? `translate(-170 -650)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? `translate(-20 -950)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? `translate(-170 -950)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? `translate(-130 -1200)`
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? `translate(-290 -1200)`
                                    :
                                    null}
                                scale={
                                    bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? "1.3" 
                                    : 
                                    bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? "1.3"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "chest" ? "1" 
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "head" ? "0.8"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "legs" ? "0.8"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "torso" ? "0.8"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "feet" ? "0.8"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "abs" ? "0.6"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? "0.6"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? "0.6"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? "0.65"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? "0.65"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? "0.7"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? "0.7"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? "1.2"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? "1.2 "
                                    :
                                    null}
                                
                            />
                    ))}
        
                    <Circle cx={bodyPart.melanomaDoc.location.x} cy={bodyPart.melanomaDoc.location.y} r="5" fill="red" />
            </Svg>
    
        )
    }


return(
    <View style={styles.container}>
        {bodyPart != null ? dotSelectOnPart():null}
    </View>
)}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    }
})

export default SinglePartAnalasis;