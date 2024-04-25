import { useEffect,useState } from "react";
import { View, StyleSheet,Text } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

import { fetchMelanomaSpotData } from "../../../server";

const SinglePartAnalasis = ({ route }) => {

//<***************************  Variables ******************************************>

    const [melanomaData, setMelanomaData] = useState(null);
    const { currentuser } = useAuth();


//<***************************  Functions ******************************************>

    const fetchmelanomaData = async () => {
        if(currentuser){
            const melanomaId = route.params.data;
            const response = await fetchMelanomaSpotData({
                userId: currentuser.uid,
                melanomaId: melanomaId,
            });
            setMelanomaData(response);
            console.log(response);
        }
    }

    useEffect(() => {
        fetchmelanomaData();
    },[])


//<***************************  Components ******************************************>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" style={{borderWidth:1}} height={200} width={350} > 

                {melanomaData.melanomaDoc.spot.map(bodyPart => (
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
                                    null
                                }
                                transform={
            
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
                                    null}
                                scale={
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
                                    null}
                                
                            />
                    ))
                ))}
        
                    <Circle cx={melanomaData.melanomaDoc.location.x} cy={melanomaData.melanomaDoc.location.y} r="5" fill="red" />
            </Svg>
    
        )
    }


return(
    <View style={styles.container}>
        {melanomaData != null ? dotSelectOnPart():null}
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