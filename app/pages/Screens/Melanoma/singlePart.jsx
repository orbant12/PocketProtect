import { useEffect,useState } from "react";
import { View, StyleSheet,Text } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchMelanomaSpotData } from "../../../server";

const SinglePartAnalasis = ({ route }) => {

//<***************************  Variables ******************************************>


const bodyPart = route.params.data;

const gender = route.params.gender

//<***************************  Functions ******************************************>




//<***************************  Components ******************************************>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 

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
                                    bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "-20"
                                    :
                                    bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "20"
                                    :
                                    null
                                }
                                transform={
                                    gender == "male" ? (
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
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? `translate(-860 -80)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? `translate(-800 -290)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? `translate(-600 -430)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? `translate(-1000 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? `translate(-900 -590)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? `translate(-1190 -675)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? `translate(-680 -670)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? `translate(-550 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? `translate(-840 -1230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? `translate(-1000 -1230)`
                                        :
                                        null
                                        ):(
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? `translate(-145 -270)` 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? `translate(-50 -10)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "legs" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "torso" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "feet" ? `translate(-140 -100)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "abs" ? `translate(-20 -380)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? `translate(100 -630)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? `translate(-460 -640)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm" ? `translate(180 -420)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm" ? `translate(-300 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-left" ? `translate(0 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "upper-leg-right" ? `translate(-110 -650)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-left" ? `translate(-20 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "lower-leg-right" ? `translate(-120 -950)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet" ? `translate(-130 -1280)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet" ? `translate(-220 -1280)`
                                        :
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? `translate(-900 -30)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? `translate(-850 -280)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? `translate(-650 -450)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? `translate(-1100 -230)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? `translate(-960 -590)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? `translate(-1270 -620)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? `translate(-730 -630)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? `translate(-600 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? `translate(-700 -750)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? `translate(-940 -1330)`
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? `translate(-1050 -1330)`
                                        
                                        :null
                                        )
                                }
                                scale={
                                    gender == "male" ? (
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
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? "1"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? "1.2"
                                        :
                                        null):(
                                        bodyPart.melanomaDoc.spot[0].slug == "left-hand" ? "1.3" 
                                        : 
                                        bodyPart.melanomaDoc.spot[0].slug == "right-hand" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "chest" ? "1" 
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "head" ? "0.65"
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
                                        //BACK
                                        bodyPart.melanomaDoc.spot[0].slug == "head(back)" ? "0.8"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "back" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-arm(back)" ? "0.6"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "gluteal" ? "1"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-palm" ? "1.3"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-leg(back)" ? "0.37"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "left-feet(back)" ? "1.2"
                                        :
                                        bodyPart.melanomaDoc.spot[0].slug == "right-feet(back)" ? "1.2"
                                        :
                                        null)
                                }
                            />
                    ))}
        
                    <Circle cx={bodyPart.melanomaDoc.location.x} cy={bodyPart.melanomaDoc.location.y} r="5" fill="red" />
            </Svg>
    
        )
    }

    const Header = () => {
        return(
            <View style={styles.TopPart}>
            {bodyPart != null ? dotSelectOnPart():null}
        </View>
        )
    }

return(
    <View style={styles.container}>
    
        <Tabs.Container
        renderHeader={Header}
        style={{backgroundColor:"white"}}
    >

        {/* CLIPS PAGE */}
        <Tabs.Tab 
            name="A"
            label={() => <Entypo name={'folder'} size={25} color={"black"} />}
        >
            <Tabs.ScrollView>
                <Text>dsaads</Text>
            </Tabs.ScrollView>
        </Tabs.Tab>
                {/* CLIPS PAGE */}
                <Tabs.Tab 
            name="B"
            label={() => <Entypo name={'warning'} size={25} color={"black"} />}
        >
            <Tabs.ScrollView>
                <Text>dsaads</Text>
            </Tabs.ScrollView>
        </Tabs.Tab>
    </Tabs.Container>   
    </View>
)}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex:1,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    TopPart: {
        width: "100%",
        borderWidth: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default SinglePartAnalasis;