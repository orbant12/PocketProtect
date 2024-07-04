import { StyleSheet, View, ScrollView,Text } from "react-native"
import { SelectionPage } from "../../../../components/Common/SelectableComponents/selectPage"
import { useState } from "react"
import Body from "../../../../components/LibaryPage/Melanoma/BodyParts/index"
import { Pressable } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Stage1SVG from "../../../../assets/skinburn/3.png"
import stage2SVG from "../../../../assets/skinburn/2.png"
import stage3SVG from "../../../../assets/skinburn/1.png"

export const SunBurnScreen = ({
    melanomaMetaData,
    handleMelanomaDataChange,
    setMelanomaMetaData,
    setSelectedModalItem,
    gender,
}) => {

    const [haveBeenBurned,setHaveBeenBurned] = useState<boolean>(false);
    const [selectedBurnSide,setSelectedBurnSide] = useState<"front" | "back">("front");


    const deleteSunburn = (index:number) => {
        if(index != 0){
        setMelanomaMetaData((prevState) => {
            const newSunburn = [...prevState.sunburn];
            newSunburn.splice(index, 1);     
        return {
            ...prevState,
            sunburn: newSunburn 
        };
        });
        } else {
            setHaveBeenBurned(false)
        } 
    };

    const addMoreBurn = () => {
        setMelanomaMetaData(prevState => ({
            ...prevState,
            sunburn: [{ stage: 3, slug: "" }, ...prevState.sunburn]
        }));
        // Step 3: Set haveBeenBurned to false
        setHaveBeenBurned(false);
    };


        return(
        <View style={styles.container}>
            {!haveBeenBurned ?   
                <SelectionPage 
                    buttonAction={{type:"next",actionData:{progress:0.3,increment_value:0.1}}}
                    specialValues={[1,2,3]}
                    pageTitle={"Have you been sunburnt ?"}
                    selectableOption="box"
                    selectableData={
                        [
                            {
                                title:"Never",
                                type:0,
                                icon:{
                                    type:"icon",
                                    metaData:{
                                        name:"cancel",
                                        size:50
                                    }
                                }
                            },
                            {
                                title:"Stage 1",
                                type:1,
                                icon:{
                                    type:"image",
                                    metaData:{
                                        name:Stage1SVG,
                                        size:100
                                    }
                                }
                            },
                            {
                                title:"Stage 2",
                                type:2,
                                icon:{
                                    type:"image",
                                    metaData:{
                                        name:stage3SVG,
                                        size:100
                                    }
                                }
                            },
                            {
                                title:"Stage 3",
                                type:3,
                                icon:{
                                    type:"image",
                                    metaData:{
                                        name:stage2SVG,
                                        size:100
                                    }
                                }
                            },
                        ]
                    }
                    setOptionValue={(type) => handleMelanomaDataChange("stage",type)}
                    optionValue={melanomaMetaData.sunburn[0]?.stage}
                    setProgress={(e) => {console.log(e)}}
                    handleEvent={() => setHaveBeenBurned(!haveBeenBurned)}
                />
                :
                <View style={styles.startScreen}>
                        <ScrollView centerContent style={{width:"100%"}}>
                            <View style={{width:"100%",alignItems:"center"}}>
                                <View style={{marginTop:50,alignItems:"center"}}>  
                                    <Text style={{marginBottom:10,fontWeight:"800",fontSize:18,backgroundColor:"white",textAlign:"center"}}>Select where the sunburn has occured ?</Text>
                                </View>
                                <View style={{flexDirection:"column",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:-10}}>
                                        <Body
                                            data={[{slug: melanomaMetaData.sunburn[0].slug, color:"lightgreen",pathArray:[]}]}
                                            side={selectedBurnSide}
                                            gender={gender}
                                            scale={0.8}
                                            onBodyPartPress={(slug) => handleMelanomaDataChange("slug",slug.slug)}
                                            skinColor={melanomaMetaData.skinType}
                                        />
                                        <View style={styles.positionSwitch}>
                                            <Pressable onPress={() => setSelectedBurnSide("front")}>
                                                <Text style={selectedBurnSide == "front" ? {fontWeight:"600"}:{opacity:0.5}}>Front</Text>
                                            </Pressable>
                                            <Text>|</Text>
                                            <Pressable onPress={() => setSelectedBurnSide("back")}>
                                                <Text style={selectedBurnSide == "back" ? {fontWeight:"600"}:{opacity:0.5}}>Back</Text>
                                            </Pressable>
                                        </View>
                                </View>                  
                    {melanomaMetaData.sunburn.map((data,index) => (                  
                        <>
                    {index == 0 && <Text style={{fontWeight:"800",opacity:0.2,top:15,color:"magenta"}}>Current</Text>}
                        <View key={index} style={[{width:"80%",borderWidth:0.3,padding:15,margin:20,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},index == 0 &&{ borderWidth:2,borderColor:"magenta"}]}>
                            <MaterialCommunityIcons
                                name="chart-box"
                                size={25}
                            />
                            <View style={{marginLeft:0}}> 
                            <Text style={{marginBottom:8,fontWeight:"400"}}>Stage: <Text style={{opacity:1,fontWeight:"800"}}>{data.stage}</Text></Text>
                            <Text style={{fontWeight:"400",}}>Where: <Text style={{opacity:1,fontWeight:"800"}}>{data.slug}</Text></Text>
                            </View>   
                            <MaterialCommunityIcons 
                                name="delete"
                                size={25}
                                color={"red"}
                                style={{opacity:0.4}}
                                onPress={() => deleteSunburn(index)}
                            />                
                        </View>
                        </>  
                    ))}
                    <View style={{width:"100%",alignItems:"center",marginBottom:20,marginTop:50}}>
                        {melanomaMetaData.sunburn[0].slug != "" ? 
                            <Pressable onPress={() => {}} style={[styles.startButton,{marginBottom:0,position:"relative"}]}>
                                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Done</Text>
                            </Pressable>
                            :
                            <Pressable style={styles.startButtonNA}>
                                <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                            </Pressable>
                        }
                        <Pressable onPress={() => addMoreBurn()} style={{marginTop:0}}>
                            <Text style={{padding:13,fontWeight:"600",color:"black",fontSize:17 }}>+ Add More</Text>
                        </Pressable>
                    </View>
                    </View>
                    </ScrollView>
                </View> 
                
            }
            </View>
        )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        width:"100%",
        height:"100%",
        borderWidth:0,
        justifyContent:"center",
        backgroundColor:"white"
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        marginBottom:0,
        backgroundColor:"white",
        zIndex:-1,
        marginTop:0,
        justifyContent:"space-between"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"relative",
        marginTop:20,
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:20,
        opacity:0.3
    },
    backButton:{
        borderWidth:0,
        alignItems:"center",
        width:"40%",
        borderRadius:20,
    },
    bar: {
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        },
    ProgressBar:{
        width:"95%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    saveButtonActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
    },
    saveButtonInActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
        opacity:0.5
    },
    uploadButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        marginTop: 30,
        marginBottom:30,
    },
    OwnSlugAddBtn: {
        width: "80%",
        height: 50,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft:"auto",
        marginRight:"auto",
    },
    MoreSpotButton:{
        backgroundColor:"magenta",
        borderRadius:10,
        marginBottom:20,
        width:250,
        alignItems:"center",
        borderWidth:1
    },
    AllSpotButton:{
        backgroundColor:"white",
        borderRadius:10,
        borderWidth:1,
        width:250,
        alignItems:"center",
        opacity:0.8
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'gray',
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
        alignItems: 'flex-start',
        position: 'absolute',
        marginTop: 10,
        top: 100,
        left: 0,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 300,
        left: 0,
    },
    genderOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:0.3,
        borderRadius:10,
        padding:20,
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:2,
        borderRadius:15,
        padding:20,
        backgroundColor:"rgba(0,0,0,0.03)",
        borderColor:"magenta"
    },
    skinTypeOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:5,
        borderColor:"magenta",
        borderRadius:15,
        padding:20,
    },
    skinTypeOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderRadius:30,
        padding:20,
    },
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        width:300,
        height:180,
        borderWidth:1,
        borderRadius:10,
        padding:0,
        shadowColor: '#171717',
        shadowOffset: {width: 4, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    modalYesBtn:{
        padding:5,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:60,
        height:40,
        alignItems:"center",
        marginLeft:30,

    },
    modalNoBtn:{
        padding:5,
        backgroundColor:"white",
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        marginBottom:20    
    },
    selectableBubble:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderWidth:1,
        borderRadius:20,
        marginLeft:20,
        marginRight:20
    },
    selectableBubbleA:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        marginLeft:20,
        marginRight:20,
        borderWidth:2,
        borderColor:"lightblue",
        borderRadius:20,
    },
    progressDot:{
        width:6,
        height:6,
        borderRadius:100,
        backgroundColor:"black",
        position:"absolute",
        bottom:70
    }
})

