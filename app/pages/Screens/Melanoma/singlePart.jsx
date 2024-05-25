import { useEffect,useState,useRef } from "react";
import { View, StyleSheet,Text,Image,TouchableOpacity,Pressable } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import Svg, { Circle, Path } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchSpotHistory } from "../../../server";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SinglePartAnalasis = ({ route }) => {

//<***************************  Variables ******************************************>


const bodyPart = route.params.data;

const gender = route.params.gender

const skin_type = route.params.skin_type

const moleDataRef = useRef(null)

const {currentuser} = useAuth()

const [melanomaHistory, setMelanomaHistory] = useState([])
const [selectedMelanoma, setSelectedMelanoma] = useState(null)
const [highlight, setHighlighted ]= useState("")

//<***************************  Functions ******************************************>


const fetchAllSpotHistory = async () => {
    if(currentuser){
        const res = await fetchSpotHistory({
            userId: currentuser.uid,
            spotId: bodyPart.melanomaId,            
        })

        if (res == "NoHistory"){
            setMelanomaHistory([])
            setHighlighted(bodyPart.created_at)
            setSelectedMelanoma(bodyPart)
        } else if (res == false){
            alert("Something went wrong !")
            setSelectedMelanoma(bodyPart)
            setHighlighted(bodyPart.created_at)
        } else {
            setMelanomaHistory(res)
            setHighlighted(bodyPart.created_at)
            setSelectedMelanoma(bodyPart)
        }
    }
}

useEffect(() => {
    fetchAllSpotHistory()
},[])



//<***************************  Components ******************************************>

    const dotSelectOnPart = () => {
        return (
            <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 

                    {bodyPart.melanomaDoc.spot[0].pathArray.map((path, index) => (
                            <Path
                                key={`${bodyPart.melanomaDoc.spot[0].slug}_${index}`} 
                                d={path}
                                fill={skin_type == 0 ? "#fde3ce" : skin_type == 1 ? "#fbc79d" : skin_type == 2 ? "#934506" : skin_type == 3 ? "#311702":null}
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
        headerContainerStyle={{backgroundColor:"black"}}
        containerStyle={{backgroundColor:"rgba(0,0,0,0.86)"}}
    >

        {/* CLIPS PAGE */}
        <Tabs.Tab 
            name="A"
            label={() => <Entypo name={'folder'} size={25} color={"white"} />}
        >
            <Tabs.ScrollView ref={moleDataRef}>
                <View style={[styles.container]}>
                    <View style={[{marginTop:20,alignItems:"center",width:"100%"}]}>
                        <Text style={{width:"90%",textAlign:"center",fontSize:20,color:"white",fontWeight:"800",opacity:0.6}}>Our deep learning model analasis result:</Text>
                        <Text style={{color:"lightgreen",fontWeight:"800",marginTop:20,fontSize:30}}>Bening</Text>
                        <View style={styles.scoreCircle}>
                            <Text style={[{fontSize:50,fontWeight:'bold'},{color:"lightgreen",opacity:0.5}]}>17%</Text>
                            <Text style={[{fontSize:15,fontWeight:700},{color:"lightgreen",opacity:0.8}]}>Accuracy</Text>
                        </View>
                    </View>

                    <View style={[styles.container,{marginTop:50}]} >
                        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>Mole Data</Text>
                        {selectedMelanoma != null &&
                            <View style={[styles.melanomaBox, highlight != selectedMelanoma.created_at && {borderColor:"white"}]}>
                                
                                <Image 
                                    source={{ uri:selectedMelanoma.melanomaPictureUrl}}
                                    style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                />
                                <View style={styles.melanomaBoxL}>                            
                                    <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{selectedMelanoma.created_at}</Text>
                                    <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {selectedMelanoma.risk}</Text>
                                </View>
                                <TouchableOpacity style={{width:"30%",flexDirection:"row",alignItems:"center",borderWidth:1.5,borderColor:"red",padding:10,borderRadius:10,opacity:0.8}}>
                                    <MaterialCommunityIcons 
                                        name="delete"
                                        size={20}
                                        color={"red"}
                                    />
                                    <Text style={{color:"red",fontWeight:"700",marginLeft:5}}>Delete</Text>                         
                                </TouchableOpacity>               
                            </View>
                        }
                        <View>

                    <View style={[styles.container,{marginTop:50}]}>
                        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>History</Text>                                      
                            <TouchableOpacity onPress={() => {setHighlighted(bodyPart.created_at); setSelectedMelanoma(bodyPart); moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true }); }}  style={[styles.melanomaBox, highlight != bodyPart.created_at && {borderColor:"white"}]}>
                            <Text style={[{color:"magenta",opacity:0.6, fontWeight:"700",top:-22,position:"absolute",left:0},highlight != bodyPart.created_at && {color:"white"}]}>Latest</Text>
                            <Image 
                                source={{ uri:bodyPart.melanomaPictureUrl}}
                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                            />
                            <View style={styles.melanomaBoxL}>                            
                                <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{bodyPart.created_at}</Text>
                                <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {bodyPart.risk}</Text>
                            </View>              
                            <View  style={styles.melanomaBoxR}>
                                <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                <MaterialCommunityIcons 
                                    name="arrow-right"
                                    size={25}
                                    color={"white"}
                                    opacity={"0.8"}
                                />
                            </View>
                            </TouchableOpacity>
                            {melanomaHistory.length != 0 && 
                                melanomaHistory.map((data,index) => (
                                <TouchableOpacity key={index} onPress={() => {setHighlighted(data.created_at);setSelectedMelanoma(data);moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true });}}  style={[styles.melanomaBox, highlight != data.created_at && {borderColor:"white"}]}>                                    
                                    <Image 
                                        source={{ uri:data.melanomaPictureUrl}}
                                        style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                    />
                                    <View style={styles.melanomaBoxL}>                            
                                        <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{data.created_at}</Text>
                                        <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {data.risk}</Text>
                                    </View>              
                                    <View  style={styles.melanomaBoxR}>
                                        <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                    <MaterialCommunityIcons 
                                            name="arrow-right"
                                            size={25}
                                            color={"white"}
                                            opacity={"0.8"}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                ))

                            }                        
                    </View>
     
                        </View>
                    </View>
                </View>
            </Tabs.ScrollView>
        </Tabs.Tab>
                {/* CLIPS PAGE */}
                <Tabs.Tab 
            name="B"
            label={() => <Entypo name={'warning'} size={25} color={"white"} />}
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
        alignItems: "center",
        flexDirection: "column",
    },
    TopPart: {
        width: "100%",
        borderWidth: 0.3,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding:10,
        backgroundColor:"white"
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'lightgreen',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    melanomaBox: {
        maxWidth: "95%",
        width: "95%",
        height: 100,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor:"magenta",
        backgroundColor:"black",
        flexDirection: "row",
        borderRadius:10,
        marginRight:"auto",
        marginLeft:"auto",
        marginTop:20
    },
    melanomaBoxL: {
        width: "40%",
        height: "100%",
        justifyContent: "center",
        marginLeft:10,
        marginRight:10
    },
    melanomaBoxR: {

        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        borderRadius: 10,
        marginLeft: 10,
        paddingVertical:10,
        paddingHorizontal:10,
        borderColor:"white",
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1
    },
})

export default SinglePartAnalasis;