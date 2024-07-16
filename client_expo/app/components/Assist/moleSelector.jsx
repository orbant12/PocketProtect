import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { View,Text,Image,TouchableOpacity,ScrollView,Alert } from "react-native"
import { Navigation_MoleUpload_1 } from "../../navigation/navigation";
import { NavBar_TwoOption } from "../Common/navBars"
import { useState } from "react";
import Svg, { Circle, Path } from 'react-native-body-highlighter/node_modules/react-native-svg';
import { styles_shadow } from "../../styles/shadow_styles";


export const MoleSelectorScreen = ({
    closeAction,
    navigation,
    handleSelect,
    selectedMoles,
    melanomaData,
    riskyMelanomaData,
    unfinishedMelanomaData,
    setProgress,
    userData,
    allMelanomaData
}) => {

    const [ overlayVisible,setOverlayVisible] = useState(false)
    const [ overlayHighlightedSpot, setOverlayHihghlightedSpot] = useState(null)

    return(
        <>
        <NavBar_TwoOption 
            title={"Select moles for review"}
            icon_left={{name:"arrow-left",size:30,action:closeAction}}
            icon_right={{name:"plus",size:30,action:() => {Navigation_MoleUpload_1({navigation:navigation});closeAction()} }}
        />

        <MolesSelectContainerScreen 
            handleSelect={handleSelect}
            selectedMoles={selectedMoles}
            melanomaData={melanomaData}
            riskyMelanomaData={riskyMelanomaData}
            unfinishedMelanomaData={unfinishedMelanomaData}
            setOverlayHihghlightedSpot={setOverlayHihghlightedSpot}
            setOverlayVisible={setOverlayVisible}
        />
        {selectedMoles.length != 0 ? (
            <TouchableOpacity onPress={() => setProgress(1)} style={{width:"90%",position:"absolute",padding:20,paddingVertical:15,bottom:30,justifyContent:"center",backgroundColor:"magenta",borderRadius:10,alignItems:"center",alignSelf:"center"}}>
                <Text style={{fontSize:"15",fontWeight:"700", color:"white"}}>Next ( {selectedMoles.length} Selected )</Text>
            </TouchableOpacity>
        )
        :
        (
            <TouchableOpacity onPress={() => Alert.alert("You have 0 selected moles !")} style={{width:"90%",position:"absolute",padding:20,paddingVertical:15,bottom:30,justifyContent:"center",backgroundColor:"magenta",borderRadius:10,alignItems:"center",alignSelf:"center",opacity:0.5}}>
                <Text style={{fontSize:"15",fontWeight:"700", color:"white"}}> {selectedMoles.length} Selected </Text>
            </TouchableOpacity>
        )
        }
        <BodyPartOverlay 
            visible={overlayVisible}
            setOverlayVisible={setOverlayVisible}
            userData={userData}
            overlaySpot={overlayHighlightedSpot != null && overlayHighlightedSpot}
            melanomaData={allMelanomaData}
        />
        </>
    )
}

const MolesSelectContainerScreen = ({
    riskyMelanomaData,
    melanomaData,
    unfinishedMelanomaData,
    selectedMoles,
    handleSelect,
    setOverlayHihghlightedSpot,
    setOverlayVisible
}) => {
    return(
        <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:"center",paddingBottom:100}}>
        <View style={{width:"100%",alignItems:"center",margin:30}}>
            <Text style={{fontWeight:"600"}}>{selectedMoles.length} Moles Selected</Text>
        </View>  
        <View style={{width:"100%",alignItems:"center"}}>
            <Text style={{alignSelf:"left",fontWeight:"700",margin:10,fontSize:20}}>Highly Recommended</Text>
            {riskyMelanomaData.length != 0 ? (
                riskyMelanomaData.map((data,index) =>(
                    <SelectableMole_Bar 
                        selectedMoles={selectedMoles}
                        data={data}
                        handleSelect={handleSelect}
                        setOverlayHihghlightedSpot={setOverlayHihghlightedSpot}
                        setOverlayVisible={setOverlayVisible}
                        key={index}
                    />
                ))
            ) : (
                <View style={{width:"40%",alignItems:"center",justifyContent:"center",padding:10,opacity:0.3,backgroundColor:"lightgray",borderRadius:100,marginTop:30}}>
                    <Text style={{fontWeight:"600",fontSize:18}}>None found</Text>
                </View>
            )}
        </View>
        <View style={{width:"100%",alignItems:"center",marginTop:40}}>
            <Text style={{alignSelf:"left",fontWeight:"700",margin:10,fontSize:20}}>Other Moles</Text>
            {melanomaData.length != 0 ? (
                melanomaData.map((data,index) =>(
                    <SelectableMole_Bar 
                        selectedMoles={selectedMoles}
                        data={data}
                        handleSelect={handleSelect}
                        setOverlayHihghlightedSpot={setOverlayHihghlightedSpot}
                        setOverlayVisible={setOverlayVisible}
                        key={index}
                    />
                ))
            ) : (
                <View style={{width:"40%",alignItems:"center",justifyContent:"center",padding:10,opacity:0.3,backgroundColor:"lightgray",borderRadius:100,marginTop:30}}>
                    <Text style={{fontWeight:"600",fontSize:18}}>None found</Text>
                </View>
            )}
        </View>
        <View style={{width:"100%",alignItems:"center",marginTop:40}}>
            <Text style={{alignSelf:"left",fontWeight:"700",margin:10,fontSize:20}}>AI - Risk Analasis Missing</Text>
            {unfinishedMelanomaData.length != 0 ? (
                unfinishedMelanomaData.map((data,index) =>(
                    <SelectableMole_Bar 
                        selectedMoles={selectedMoles}
                        data={data}
                        handleSelect={handleSelect}
                        setOverlayHihghlightedSpot={setOverlayHihghlightedSpot}
                        setOverlayVisible={setOverlayVisible}
                        key={index}
                    />
                ))
            ) : (
                <View style={{width:"40%",alignItems:"center",justifyContent:"center",padding:10,opacity:0.3,backgroundColor:"lightgray",borderRadius:100,marginTop:30}}>
                    <Text style={{fontWeight:"600",fontSize:18}}>None found</Text>
                </View>
            )}
        </View>
        </ScrollView>
    )
}


const SelectableMole_Bar = ({
    data,
    selectedMoles,
    handleSelect,
    setOverlayHihghlightedSpot,
    setOverlayVisible
}) => {
    return(
        <View style={[{width:"95%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10,borderWidth:0.3,marginTop:20,paddingVertical:10,borderRadius:10,backgroundColor:"black"},selectedMoles.includes(data.melanomaId) && {borderWidth:3,borderColor:"magenta"},styles_shadow.shadowContainer]}>
            <Image 
                style={{height:70,width:70,borderRadius:10,borderWidth:0.5}}
                source={{uri: data.melanomaPictureUrl}}
            />
            <View style={{marginLeft:-20}}>
                <Text style={{color:"white",fontWeight:"800"}}>{data.risk != null ? "Risk: " + data.risk : "Not analised"}</Text>
                <Text style={{color:"white",fontWeight:"700",opacity:0.7,marginTop:5,fontSize:10}}>{data.melanomaId}</Text>
                <Text style={{fontWeight:"800",color:"white",fontSize:11,marginTop:5}}>{data.melanomaDoc.spot[0].slug}</Text>
            </View>
            <TouchableOpacity onPress={() => {setOverlayHihghlightedSpot(data);setOverlayVisible(true)}} style={{alignItems:"center",backgroundColor:"white",padding:5,borderRadius:5,paddingHorizontal:10,opacity:0.9}}>
            
                <Text style={{fontWeight:"600",color:"black",fontSize:10}}>See Where</Text>
                <MaterialCommunityIcons 
                    name="eye"
                    size={10}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect(data.melanomaId) }>
                {selectedMoles.includes(data.melanomaId) ? (
                    <MaterialCommunityIcons 
                        name="checkbox-intermediate"
                        size={30}
                        color={"white"}
                    />
                ) : (
                    <MaterialCommunityIcons 
                        name="checkbox-blank-outline"
                        size={30}
                        color={"white"}
                    />
                )
                }
            </TouchableOpacity>
        </View>
    )
}

const BodyPartOverlay = ({
    visible,
    setOverlayVisible,
    overlaySpot,
    userData,
    melanomaData
}) => {
    const dotSelectOnPart = ({bodyPart,userData,melanomaData,highlighted}) => {
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
                        data.melanomaDoc.spot[0].slug == bodyPart.slug && data.gender == userData.gender  && (
                            data.melanomaId == highlighted ? (
                                
                                    <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="red" key={`${"circle"}_${index}`} />

                            ):(
                                
                                    <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="black" key={`${"circle"}_${index}`} />
                                
                            )
                        )
                    ))
                }
            </Svg>
    
        )
    }
    
    return(
        <>
        {visible &&
            <View style={[{flex:1,position:"absolute",zIndex:30,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.8)",alignItems:"center",justifyContent:"center",padding:0}]}>
        
                <View style={[{width:"85%",height:"80%",backgroundColor:"white",borderRadius:30,alignItems:"center",justifyContent:"space-between",padding:10, borderColor:"black",borderWidth:3},styles_shadow.shadowContainer]}>
                <MaterialCommunityIcons 
                    name="close"
                    size={25}
                    style={{position:"absolute",right:20,top:20,zIndex:80}}
                    onPress={() => setOverlayVisible(!visible)}
                />
                <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:"center"}}>
                <Text style={{fontWeight:"800",fontSize:20,marginTop:30}}>{overlaySpot.melanomaId}</Text>
                <View style={[styles_shadow.shadowContainer,{width:"100%",alignItems:"center",marginTop:10}]}>
                    <Image 
                        source={{ uri: overlaySpot.melanomaPictureUrl }}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 20,
                        }}
                    />
                </View>
                <View style={{width:"100%",borderWidth:0.5,margin:30}} />
                    <View style={[styles_shadow.shadowContainer,{marginTop:-20}]} >
                    {dotSelectOnPart({
                        bodyPart:overlaySpot.melanomaDoc.spot[0],
                        userData,
                        melanomaData,
                        highlighted:overlaySpot.melanomaId
                    })}
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => setOverlayVisible(!visible)} style={{width:"90%",justifyContent:"center",alignItems:"center",padding:10, borderWidth:2,borderRadius:100}}>
                    <Text style={{fontWeight:"600"}}>Close</Text>
                </TouchableOpacity>
                </View>
            </View>
        }
        </>
    )
}


