import { ScrollView } from "react-native";
import { Pressable, Text, View,Image } from "react-native";
import { SelectionPage } from "../../../../../components/Common/SelectableComponents/selectPage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Body  from "../../../../../components/LibaryPage/Melanoma/BodyParts/index";
import { styles } from "../../../../../styles/full_melanoma_styles"
import { useEffect, useState } from "react";
import { UserData } from "../../../../../utils/types";
import { fetchBurns } from "../../../../../services/server";
import { Burns } from "../../../../../models/Burns";
import { useAuth } from "../../../../../context/UserAuthContext";

export function SkinBurnScreen({
    setProgress,
    progress,
    setHaveBeenBurned,
    haveBeenBurned,
    selectionStyle,
    addStyle
}:{
    setProgress?:(e:boolean) => void,
    progress?:number,
    publicHaveBeenBurned?:(arg:boolean) => void,
    selectionStyle?:any,
    setHaveBeenBurned:(arg:boolean) => void,
    haveBeenBurned:boolean,
    addStyle?:any;
}){
    const Stage1SVG = Image.resolveAssetSource(require('../../../../../assets/skinburn/3.png')).uri;
    const stage2SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/2.png')).uri;
    const stage3SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/1.png')).uri;

    const [burnData, setBurnData] = useState([{stage:0,slug:""}])
    const [selectedBurnSide, setSelectedBurnSide] = useState<"front" | "back">("front")
    const {currentuser} = useAuth()
    const burnObj = new Burns(currentuser.uid)

    const addMoreBurn = () => {
        setBurnData(prevState => (
           [{ stage: 0, slug: "" }, ...prevState]
        ));
        // Step 3: Set haveBeenBurned to false
        setHaveBeenBurned(false);
        
    };

    const deleteSunburn = (index:number) => {
        if(index != 0){
            setBurnData((prevState) => {
                const newBurnData = [...prevState];
                newBurnData.splice(index, 1);
                return newBurnData;
            })
        } else {
            setHaveBeenBurned(false);
        } 
    };

    const fetchAllBurns = async () => {
        await burnObj.fetchBurnsData()
        const resData = burnObj.getBurns()
        setBurnData([{stage:0,slug:""},...resData]);
    }

    const handleSaveNew = async () => {
        await burnObj.updateBurnData(burnData)
    }

    const handleMelanomaDataChange = (type: "slug" | "stage", data: any) => {
        setBurnData((prevState) => {
            let newSunburn = [...prevState]; // Create a shallow copy of the sunburn array
            
            if (newSunburn.length === 0) {
                newSunburn.push({ stage: 0, slug: "" }); 
            }
    
            if (type === "slug") {
                newSunburn[0] = { ...newSunburn[0], slug: data };
            } else if (type === "stage") {
                newSunburn[0] = { ...newSunburn[0], stage: data };
            }
            return newSunburn; 
        });
    };

    useEffect(() => {
        fetchAllBurns();
    },[])

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
                optionValue={burnData[0]?.stage}
                setProgress={(e) => setProgress(true)}
                pageStyle={[{height:"85%",marginTop:"5%"},selectionStyle]}
                handleEvent={() => {setHaveBeenBurned(!haveBeenBurned)}}
            />
            :
            <View style={[styles.startScreen,addStyle]}>
                    <ScrollView centerContent style={{width:"100%"}}>
                        <View style={{width:"100%",alignItems:"center"}}>
                            <View style={{marginTop:10,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",padding:10,borderRadius:10}}>  
                                <Text style={{fontWeight:"800",fontSize:18,width:300}}>Select where the sunburn has occured ?</Text>
                            </View>
                            <View style={{flexDirection:"column",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0}}>
                                    <Body 
                                        data={[{slug: burnData[0]?.slug, color:"lightgreen",pathArray:[]}]}
                                        side={selectedBurnSide}
                                        gender={currentuser.gender}
                                        scale={1}
                                        onBodyPartPress={(slug) => handleMelanomaDataChange("slug",slug.slug)}
                                        skinColor={1}
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
                            {burnData.map((data,index) => (                  
                            <>
                                {index == 0 && <Text style={{fontWeight:"800",opacity:0.2,top:5,color:"magenta"}}>Current</Text>}
                                <View key={index} style={[{width:"80%",borderWidth:0.3,padding:15,margin:10,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"black"},index == 0 &&{ borderWidth:2,borderColor:"magenta"}]}>
                                    <MaterialCommunityIcons 
                                        name="fire"
                                        size={25}
                                        color={"white"}
                                    />
                                    <View style={{marginLeft:0}}> 
                                    <Text style={{marginBottom:8,fontWeight:"400",color:"white"}}>Stage: <Text style={{opacity:1,fontWeight:"800"}}>{data.stage}</Text></Text>
                                    <Text style={{fontWeight:"400",color:"white"}}>Where: <Text style={{opacity:1,fontWeight:"800"}}>{data.slug}</Text></Text>
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
                                {burnData[0].slug != "" ? 
                                    <Pressable onPress={() => {setProgress(true);handleSaveNew()}} style={[styles.startButton,{marginBottom:0,position:"relative"}]}>
                                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Save</Text>
                                    </Pressable>
                                    :
                                    <Pressable style={styles.startButtonNA}>
                                        <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                                    </Pressable>
                                }
                                <Pressable onPress={() => addMoreBurn()} style={{marginTop:10,marginBottom:0, borderWidth:0.3,borderRadius:10,paddingHorizontal:20}}>
                                    <Text style={{padding:13,fontWeight:"700",color:"black",fontSize:15 }}>+ Add More</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
            </View> 
            
        }
        </>
    )
}


// Prev added burns more interactive like a folder
// Only show stage and shit if we press add ( Not in Full Melanoma --> else None = back) 