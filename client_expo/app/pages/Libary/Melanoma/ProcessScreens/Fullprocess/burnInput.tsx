import { ScrollView } from "react-native";
import { Pressable, Text, View,Image } from "react-native";
import { SelectionPage } from "../../../../../components/Common/SelectableComponents/selectPage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Body  from "../../../../../components/LibaryPage/Melanoma/BodyParts/index";

export function SkinBurnScreen({
    setProgress,
    progress,
    handleMelanomaDataChange,
    melanomaMetaData,
    setMelanomaMetaData,
    haveBeenBurned,
    setHaveBeenBurned,
    selectedBurnSide,
    setSelectedBurnSide,
    addMoreBurn,
    deleteSunburn,
    userData,
    styles
}){
    const Stage1SVG = Image.resolveAssetSource(require('../../../../../assets/skinburn/3.png')).uri;
    const stage2SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/2.png')).uri;
    const stage3SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/1.png')).uri;

    return(
        <>
        {!haveBeenBurned ?   
            <SelectionPage 
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                specialValues={[1,2,3]}
                desc="Sunburn is a form of radiation burn that affects living tissue, such as skin, that results from an overexposure to ultraviolet (UV) radiation, commonly from the sun."
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
                setProgress={(e) => setProgress(e)}
                pageStyle={{height:"85%",marginTop:"5%"}}
                handleEvent={() => setHaveBeenBurned(!haveBeenBurned)}
            />
            :
            <View style={styles.startScreen}>
                    <ScrollView centerContent style={{width:"100%"}}>
                        <View style={{width:"100%",alignItems:"center"}}>
                            <View style={{marginTop:10,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",padding:10,borderRadius:10}}>  
                                <Text style={{fontWeight:"800",fontSize:18,width:300}}>Select where the sunburn has occured ?</Text>
                            </View>
                            <View style={{flexDirection:"column",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0}}>
                                    <Body 
                                        data={[{slug: melanomaMetaData.sunburn[0].slug, color:"lightgreen",pathArray:[]}]}
                                        side={selectedBurnSide}
                                        gender={userData.gender}
                                        scale={1}
                                        onBodyPartPress={(slug) => handleMelanomaDataChange("slug",slug.slug)}
                                        skinColor={melanomaMetaData.skin_type}
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
                                {index == 0 && <Text style={{fontWeight:"800",opacity:0.2,top:5,color:"magenta"}}>Current</Text>}
                                <View key={index} style={[{width:"80%",borderWidth:0.3,padding:15,margin:10,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},index == 0 &&{ borderWidth:2,borderColor:"magenta"}]}>
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
                            <View style={{width:"100%",alignItems:"center",marginBottom:20,marginTop:30}}>
                                {melanomaMetaData.sunburn[0].slug != "" ? 
                                    <Pressable onPress={() => {setProgress(0.5)}} style={[styles.startButton,{marginBottom:0,position:"relative"}]}>
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
        </>
    )
}