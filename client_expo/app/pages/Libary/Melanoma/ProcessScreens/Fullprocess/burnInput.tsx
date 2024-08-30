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
    addStyle,
    change,
}:{
    setProgress?:(e:boolean) => void,
    progress?:number,
    publicHaveBeenBurned?:(arg:boolean) => void,
    selectionStyle?:any,
    setHaveBeenBurned:(arg:boolean) => void,
    haveBeenBurned:boolean,
    addStyle?:any;
    fetchAllBurns?:() => void,
    change?:boolean
}){
    const Stage1SVG = Image.resolveAssetSource(require('../../../../../assets/skinburn/3.png')).uri;
    const stage2SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/2.png')).uri;
    const stage3SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/1.png')).uri;

    const [burnData, setBurnData] = useState([])
    const [activeBurn, setActiveBurn] = useState([])    

    const selectableAdds = [
        {
            title:"Never",
            type:0,
            container:"add",
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
            container:"add",
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
            container:"add",
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
            container:"add",
            icon:{
                type:"image",
                metaData:{
                    name:stage2SVG,
                    size:100
                }
            }
        },
    ]

    const {currentuser} = useAuth()
    const burnObj = new Burns(currentuser.uid)

    

    const fetchAllBurns = async () => {
        await burnObj.fetchBurnsData()
        const resData = burnObj.getBurns()
        let formatDataArray = []
        resData.forEach((element,index) => {
            if(element.stage == 1){
                const formatData = {key:index,title:"Stage 1",icon:{type:"image",metaData:{name:Stage1SVG,size:30} },type:index,container:"stage_1"}
                formatDataArray.push(formatData)
                
            } else if(element.stage == 2){
                const formatData = {title:"Stage 2",icon:{type:"image",metaData:{name:stage2SVG,size:35} },type:"stage_",container:"stage_2"}
                formatDataArray.push(formatData)
                
            } else if(element.stage == 3){
                const formatData = {title:"Stage 3",icon:{type:"image",metaData:{name:stage3SVG,size:30} },type:"stage_3",container:"stage_3"}
                formatDataArray.push(formatData)
                
            }
        });
        setActiveBurn(formatDataArray)
        setBurnData(resData);
    }

    const handleSaveNew = async () => {
        await burnObj.updateBurnData(burnData)
    }

    useEffect(() => {
        fetchAllBurns();
    },[])

    useEffect(() => {
        fetchAllBurns();
    },[change])

    return(

            <AddBurnComponent 
                haveBeenBurned={haveBeenBurned}
                progress={progress}
                burnData={burnData}
                setBurnData={setBurnData}
                setHaveBeenBurned={setHaveBeenBurned}
                handleSaveNew={handleSaveNew}
                setProgress={setProgress}
                selectionStyle={selectionStyle}
                currentuser={currentuser}
                addStyle={addStyle}
                activeBurn={activeBurn}
                selectableAdds={selectableAdds}
                burnObj={burnObj}
                fetchAllBurns={fetchAllBurns}
            />
        
    )
}


// Prev added burns more interactive like a folder
// Only show stage and shit if we press add ( Not in Full Melanoma --> else None = back) 

const BurnsFolder = ({burnsData,setProgress,progress,activeBurn,selectableAdds,handleMelanomaDataChange, setHaveBeenBurned, haveBeenBurned,setBurnsData}) => {

    const BurnsArray = [
        {value:"add",title:"+ Add New"},
        {value:"stage_1",title:"Stage 1"},
        {value:"stage_2",title:"Stage 2"},
        {value:"stage_3",title:"Stage 3"},
    ];

    const [activeNavItem, setActiveNavItem] = useState(BurnsArray[0].value)
    const [addNewData,setAddNewData] = useState(0);

    return(
        <View style={{width:"100%",height:"90%",alignItems:"center"}}>
            
            <SelectionPage 
                pageTitle="Sun burns"
                selectableOption="box"
                desc="Please select the allergies you have"
                pageStyle={{height:"120%",marginTop:"5%"}}
                specialValues={[1,2,3]}
                selectableData={[...activeBurn,...selectableAdds]}
                setOptionValue={(type) => setAddNewData(type)}
                optionValue={addNewData}
                setProgress={() => {setHaveBeenBurned(!haveBeenBurned);setBurnsData([{stage:addNewData,slug:""},...burnsData])}}
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                showButton={true}
                isMap={false}
                handleEvent={() => {setHaveBeenBurned(!haveBeenBurned);setBurnsData([{stage:addNewData,slug:""},...burnsData])}}
                topPager={{
                    activeItem:activeNavItem,
                    setActiveItem: setActiveNavItem,
                    navItems:BurnsArray
                }}
            />
        </View>
    )
}

const AddBurnComponent = ({haveBeenBurned, progress, burnData, setBurnData, setHaveBeenBurned,handleSaveNew, setProgress, selectionStyle, currentuser, addStyle, activeBurn, selectableAdds,burnObj,fetchAllBurns}) => {
    const Stage1SVG = Image.resolveAssetSource(require('../../../../../assets/skinburn/3.png')).uri;
    const stage2SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/2.png')).uri;
    const stage3SVG  = Image.resolveAssetSource(require('../../../../../assets/skinburn/1.png')).uri;

    const [selectedBurnSide, setSelectedBurnSide] = useState<"front" | "back">("front")

    const handleMelanomaDataChange = (type: "slug" | "stage", data: any) => {
        setBurnData((prevState) => {
            let newSunburn = [...prevState]; //Create a shallow copy of the sunburn array
            
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

    const addMoreBurn = async () => {
        await burnObj.updateBurnData(burnData)
        fetchAllBurns();
        // Step 3: Set haveBeenBurned to false
        setHaveBeenBurned(false);
        
    };

    const manualDeletion = async (index) => {
        let returnOfNew = []
        setBurnData((prevState) => {
            const newBurnData = [...prevState];
            newBurnData.splice(index, 1);
            returnOfNew = newBurnData;
            return newBurnData;
        })
        returnOfNew.splice(0,1)
        return returnOfNew;
    }

    const deleteSunburn = async (index:number) => {
        if(index != 0){
            const response = await manualDeletion(index)
            await burnObj.updateBurnData(response)
        } else {
            setHaveBeenBurned(false);
        } 
    };


return(
    <>
    {!haveBeenBurned ?   
        <BurnsFolder 
            burnsData={burnData}
            setProgress={setProgress}
            activeBurn={activeBurn}
            progress={progress}
            selectableAdds={selectableAdds}
            handleMelanomaDataChange={handleMelanomaDataChange}
            haveBeenBurned={haveBeenBurned}
            setHaveBeenBurned={setHaveBeenBurned}
            setBurnsData={setBurnData}
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
                            {burnData.lenght != 0 &&  ( 
                                burnData[0].slug != "" ? 
                                    <Pressable onPress={() => {addMoreBurn()}} style={[styles.startButton,{marginBottom:0,position:"relative"}]}>
                                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Save</Text>
                                    </Pressable>
                                    :
                                    <Pressable style={styles.startButtonNA}>
                                        <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                                    </Pressable>
                                
                            )}
                        </View>
                    </View>
                </ScrollView>
        </View> 
        
    }
    </>
)
}