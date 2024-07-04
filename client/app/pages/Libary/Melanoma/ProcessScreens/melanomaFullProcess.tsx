import { View,Text,StyleSheet,Pressable,Image,ScrollView,TouchableOpacity,PixelRatio,Dimensions } from "react-native"
import React, {useState,useEffect,useRef,useCallback} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { useAuth } from "../../../../context/UserAuthContext";
import Body from "../../../../components/LibaryPage/Melanoma/BodyParts/index";
import doctorImage from "../../../../assets/doc.jpg"
import Stage1SVG from "../../../../assets/skinburn/3.png"
import stage2SVG from "../../../../assets/skinburn/2.png"
import stage3SVG from "../../../../assets/skinburn/1.png"
import alertMelanoma from "../../../../assets/skinburn/Melanoma.png";
import alertTeam from '../../../../assets/skinburn/5.png';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { melanomaMetaDataUpload, updateCompletedParts, fetchCompletedParts } from "../../../../services/server"
import { SelectionPage } from "../../../../components/Common/SelectableComponents/selectPage";
import { SelectionPage_Binary } from "../../../../components/Common/SelectableComponents/selectPage_Binary";
import { FactScreenType_1 } from "../../../../components/Common/FactScreenComponents/factScreenType1";
import { FactScreenType_2 } from "../../../../components/Common/FactScreenComponents/factScreenType2";
import { useFocusEffect } from '@react-navigation/native';
import { decodeParts } from "../../../../utils/melanoma/decodeParts";
import { Navigation_MoleUpload_2 } from "../../../../navigation/navigation";
import { BodyPart, Slug } from "../../../../utils/types";
import { MelanomaMetaData } from "../melanomaCenter";

const { width } = Dimensions.get('window');
const scaleFactor = width < 380 ? 1 : 1.2;

type CompletedParts_Array = {slug:Slug}[]

const responsiveFontSize = (size:number) => {
    return size * PixelRatio.getFontScale();
};

const MelanomaFullProcess = ({navigation}) => {

    //<===============> Variables  <===============> 

    const {currentuser} = useAuth()
    //Progress Trackers
    const [progress, setProgress] = useState(0.1)
    const [bodyProgress, setBodyProgress] = useState(1)
    const [bodyProgressBack, setBodyProgressBack] = useState(0)
    //Body for Birthmark
    const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
    const [gender, setGender]= useState(null)
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [completedParts, setCompletedParts] = useState<CompletedParts_Array>([])
    const [isModalUp, setIsModalUp] = useState<boolean>(false)
    const [ melanomaMetaData, setMelanomaMetaData] = useState<MelanomaMetaData>({
        sunburn:[{
            stage:0,
            slug:"" as Slug
        }],
        skin_type: null,
        detected_relative:"none",

    })
    //SKIN BURN
    const [haveBeenBurned, setHaveBeenBurned] = useState(false)
    const [selectedBurnSide, setSelectedBurnSide] = useState<"front" | "back">("front")

    //PARENT DIAGNOSED
    const familyMemberOptions = [
        {
            member:"father",
        },
        {
            member:"grandfather",
        },
        {
            member:"mother",
        },
        {
            member:"sibling",
        },
        {
            member:"grandmother",
        },
        {
            member:"other",
        }
    ]
    //Bottom Sheet
    const bottomSheetRef = useRef(null);
    const snapPoints = ['90%'];


//<===============> Functions  <===============> 

    const completedArea = async (sessionMemory:CompletedParts_Array) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)
        if(currentSide == "front"){
            setBodyProgress(response.length / 13)
        } else if (currentSide == "back"){
            setBodyProgressBack(response.length / 11)
        }
        return sessionMemory   
    }

    const updateCompletedSlug = async (completedArray:CompletedParts_Array) => {
        if(currentuser){
            const response = await updateCompletedParts({
                userId:currentuser.uid,
                completedArray
            })
            if (response != true){
                alert("something went wrong")
            }
        }
    }

    const fetchCompletedSlugs = async () => {
        if(currentuser){
            const response = await fetchCompletedParts({
                userId: currentuser.uid,
            });
            const completedSlugs = response.map(part => part.slug); 
            const decoded = decodeParts(completedSlugs)
            setCompletedParts(decoded)  
        }
    }
    
    const handleOpenBottomSheet = (state:"open" | "hide") => {
        if(state == "open"){
            bottomSheetRef.current.present();
        } else if (state == "hide"){
            bottomSheetRef.current.close();
            setProgress(progress + 0.1)
        }
    }

    const handleMelanomaDataChange = (type:"slug" | "stage" | "skin_type" | "detected_relative", data:any) => {
        setMelanomaMetaData((prevState) => {
          let newSunburn = [...prevState.sunburn]; // Create a shallow copy of the sunburn array              
            if (newSunburn.length === 0) {
                newSunburn.push({ stage: 0, slug: "" }); 
            }                
            if (type === "slug") {
                newSunburn[0] = { ...newSunburn[0], slug: data };
            } else if (type === "stage") {
                newSunburn[0] = { ...newSunburn[0], stage: data };
            }                
            return {
                ...prevState,
                sunburn: newSunburn,
                ...(type === "skin_type" && { skin_type: data }),
                ...(type === "detected_relative" && { detected_relative: data })
            };
            });
    };

    function round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    const handleBack = (permission:boolean) => {
        if (round(progress,1) == 0.1 || permission == true){
            navigation.goBack()
        } else if (haveBeenBurned != true && round(progress,1) != 0.9) {    
            setProgress(progress - 0.1)                          
        }  else if (round(progress,1) == 0.9){
            setCurrentSide("front")
            setProgress(progress - 0.1)   
        } else {
            setHaveBeenBurned(false)
        }
    }

    const addMoreBurn = () => {
        setMelanomaMetaData(prevState => ({
            ...prevState,
            sunburn: [{ stage: 3, slug: "" }, ...prevState.sunburn]
        }));
        // Step 3: Set haveBeenBurned to false
        setHaveBeenBurned(false);
    };

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

    const uploadMetaData = async (metaDataPass:MelanomaMetaData) => {   
        const res = await melanomaMetaDataUpload({
            userId: currentuser.uid,
            metaData: metaDataPass
        })
        if (res != true){
            alert("Something Went Wrong. Please check your intenet connection or restart the app !")
        }
    }

    const handleSlugMemoryChange = async () => {
        if ( completedParts.length != 0){
            const response = await completedArea(completedParts)
            updateCompletedSlug(response)
        } else {
            await completedArea(completedParts)
        }
    }

    useEffect(() => {
        handleSlugMemoryChange()     
    }, [completedParts]); 

    useFocusEffect(
        useCallback(() => {
            fetchCompletedSlugs()            
        return () => {};
        }, [])
    );


    //<==============> Components  <=============> 

    function FirstScreen(){
        return(
            <FactScreenType_2 
                title={"Why complete this report ?"}
                descriptionRows={[
                    {
                        icon_name:"magnify-scan",
                        icon_size:20,
                        text:"Most diaseses can be detected by tracking reccourant symtoms daily"
                    },
                    {
                        icon_name:"creation",
                        icon_size:20,
                        text:"Designed by medical researchers and doctors"
                    },
                    {
                        icon_name:"calendar-today",
                        icon_size:20,
                        text:"We can monitor and keep track of your health and potential reoccuring symptoms"
                    },
                    {
                        icon_name:"doctor",
                        icon_size:20,
                        text:"Our Ai Model can see your daily reports and use them for more accurate analasis and health advice"
                    }
                ]}
                boxText={"Imagine visiting your doctor daily, reporting your health that can be used to make analasis today and can be used in the future"}
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                setProgress={setProgress}

            />
        )
    }

    function FactScreen(){
        return(
            <FactScreenType_1 
                title={"Deep Learning Neural Network"}
                descriptionRows={
                    [
                        {desc:() => <Text style={{fontWeight:"600",fontSize:12,maxWidth:"90%",opacity:0.7,marginTop:20,textAlign:"justify"}}>Our AI model can detect malignant moles with a <Text style={{color:"magenta",fontWeight:"600"}}>95%</Text> accuracy which is <Text style={{color:"magenta",fontWeight:"600"}}>+20% </Text>better then the accuracy of dermotologists </Text>},
                        {desc:() => <Text style={{fontWeight:"600",fontSize:12,maxWidth:"90%",opacity:0.7,marginTop:30,textAlign:"justify"}}>Your moles can be supervised by both <Text style={{color:"magenta",fontWeight:"800"}}>AI & Dermotologist</Text> to be as protected as possible and alert you to consult a possible removal with your dermotologist</Text>},
                    ]
                }
                imageSource={alertTeam}
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                setProgress={setProgress}
            />
        )
    }

    function SecoundScreen(){
        return(            
            <SelectionPage 
                buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                selectableOption={"box"}
                selectableData={
                    [
                        {
                            title:"Female",
                            type:"female",
                            icon:{
                                type:"icon",
                                metaData:{
                                    name:"gender-female",
                                    size:30,
                                    color:"magenta"
                                }
                            }
                        },
                        {
                            title:"Male",
                            type:"male",
                            icon:{
                                type:"icon",
                                metaData:{
                                    name:"gender-male",
                                    size:30,
                                    color:"blue"
                                }
                            }
                        },                                                                                                                                                        
                    ]
                }                    
                setOptionValue={setGender}
                optionValue={gender}
                pageTitle={"What body type do you have ?"}
                setProgress={setProgress}
            />
        )
    }

    function SkinBurnScreen(){
        return(
            <>
            {!haveBeenBurned ?   
                <SelectionPage 
                    buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
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
                    setProgress={(e) => setProgress(e)}
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

    function SkinTypeScreen(){
        return(          
            <View style={styles.startScreen}>                                    
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:50,fontWeight:"800",fontSize:20,backgroundColor:"white"}}>What is your skin type ?</Text>
                        
                    </View>
                    <View style={{marginBottom:0}}>
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                                <Pressable onPress={() => handleMelanomaDataChange("skin_type",0)} style={[{ backgroundColor:"#fde3ce"}, melanomaMetaData.skin_type == 0 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                
                                <Pressable onPress={() => handleMelanomaDataChange("skin_type",1)} style={[{ backgroundColor:"#fbc79d"},melanomaMetaData.skin_type  == 1 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                    
                        </View>

                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",2)} style={[{ backgroundColor:"#934506"},melanomaMetaData.skin_type  == 2 ? styles.skinTypeOptionButtonA: styles.skinTypeOptionButton]} />                            
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",3)} style={[{ backgroundColor:"#311702"},melanomaMetaData.skin_type == 3 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                        
                        </View>
                    </View>

                    <View style={{width:"100%",alignItems:"center",marginBottom:0}}>
                    {melanomaMetaData.skin_type != null ? 
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative",marginBottom:10}]}>
                            <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={[styles.startButtonNA]}>
                            <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }        
                    </View>

                </View>                
            
            
        )
    }

    function FamilyTreeScreen(){
        return(
        <GestureHandlerRootView style={{ flex: 1,zIndex:-1,width:"100%" }}>
            <BottomSheetModalProvider>
                <SelectionPage_Binary 
                    pageTitle={{text:() => <Text style={{fontWeight:"700",fontSize:21,textAlign:"center",}}>Has anyone in your family been diagnosed with <Text style={{color:"magenta"}}>Melanoma </Text> before ?</Text>}}                    
                    setProgress={(e) => e == true ? handleOpenBottomSheet("open"):setProgress(progress + 0.1)}
                />

                <BottomSheetModal
                        ref={bottomSheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:20,borderTopRightRadius:20,borderBottomWidth:2,height:30}}
                        handleIndicatorStyle={{backgroundColor:"white"}}
                    >
                        <View style={{width:"100%",alignItems:"center",flexDirection:"column",backgroundColor:"#fff",padding:10,marginTop:30}}>
                            <Text style={{fontWeight:"700",textAlign:"center",fontSize:20}}>Please select whom from your family had been diagnosed ...</Text>
                            <ScrollView horizontal style={{width:"100%",marginTop:50}} showsHorizontalScrollIndicator={false}>
                                {familyMemberOptions.map((data) => (
                                    <Pressable key={data.member} onPress={() => handleMelanomaDataChange("detected_relative",data.member)} style={melanomaMetaData.detected_relative == data.member ? styles.selectableBubbleA : styles.selectableBubble} >
                                        <MaterialCommunityIcons
                                            name="heart"
                                        />
                                        <Text>{data.member}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <Pressable onPress={() => handleOpenBottomSheet("hide")} style={{marginTop:50,borderWidth:1,borderRadius:8,width:130,height:40,alignItems:"center",justifyContent:"center",backgroundColor:"black"}}>
                                <Text style={{fontWeight:"700",color:"white"}}>Done</Text>
                            </Pressable>
                        </View>
                    </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
        )
    }

    function AlertScreen(){
        return(
            <ScrollView style={{marginTop:30,marginBottom:20}}>
            <View style={{width:"100%",alignItems:"center",marginTop:20}}>
                    <View style={{width:"100%",alignItems:"center"}}>
                    <Image 
                        source={{uri:alertMelanoma}} 
                        style={{width:230,height:230,borderRadius:120,borderWidth:0.5,borderColor:"lightgray"}}                                               
                    />
                    <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:20}}>Great ! Now let's build your body's mole map</Text>  
                    <Text style={{fontWeight:"600",fontSize:12,maxWidth:"95%",textAlign:"center",marginTop:20,opacity:0.7}}>You will mark the location of your mole and upload them to Pocket Protect Cloud. Where our <Text style={{fontWeight:"700",color:"magenta"}}>AI model</Text> and <Text style={{fontWeight:"700",color:"magenta"}}>Professional Dermotologists</Text> can determine wheter your moles are malignant or beningn</Text> 
                    </View>
                        
                    <TouchableOpacity onPress={() => {setProgress(progress + 0.1);uploadMetaData(melanomaMetaData)}} style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,marginTop:80}}>
                        <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="account-arrow-right"
                                size={25}
                                color={"black"}
                            />
                        </View>         
                        <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"600",opacity:0.9,textAlign:"center"}}>Ready !</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0.3,backgroundColor:"white",borderRadius:40,marginTop:15}}>
                        <View style={{backgroundColor:"black",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="account-arrow-right"
                                size={25}
                                color={"white"}
                            />
                        </View>                             
                        <Text style={{marginLeft:20,fontSize:15,color:"black",fontWeight:"700",opacity:0.9,textAlign:"center"}}>How the process works ?</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        )
    }

    function ThirdScreen(){
        return(
            <>
                    <View style={[styles.startScreen,{height:"90%",marginTop:20,justifyContent:"space-between"}]}>
                        <View style={{marginTop:0,alignItems:"center"}}>  
                            <Text style={{marginBottom:20,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                            <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                            <View style={{marginTop:20}}>
                                <Body
                                        data={completedAreaMarker}
                                        gender={gender}
                                        side={currentSide}
                                        scale={scaleFactor}
                                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                                        colors={['#A6FF9B']}
                                        onBodyPartPress={(slug) => 
                                            Navigation_MoleUpload_2({
                                                bodyPartSlug:slug,
                                                gender: gender,
                                                skin_type: melanomaMetaData.skin_type,
                                                progress: progress,
                                                completedArray: completedParts,
                                                navigation: navigation
                                            })}                             
                                    />
                            </View>        

                                <View style={styles.colorExplain}>
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

                        <Pressable onPress={() => bodyProgress == 1 ? setProgress(progress + 0.1) : setIsModalUp(!isModalUp)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.85,borderWidth:1,alignItems:"center",width:"90%",borderRadius:30,marginBottom:10,backgroundColor:"black",marginTop:20}}>
                            <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>

                    </View >
                {isModalUp ?
                    NotAllSlugModal()
                :null
                }
            </>
        )
    }

    function FourthScreen(){
        return(
            <>
            <View style={[styles.startScreen,{height:"90%",marginTop:20,justifyContent:"space-between"}]}>
                <View style={{marginTop:0,alignItems:"center"}}>  
                    <Text style={{marginBottom:20,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                    <ProgressBar progress={bodyProgressBack} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <View style={{marginTop:20}}>
                    <Body
                        data={completedAreaMarker}
                        gender={gender}
                        side={currentSide}
                        scale={scaleFactor}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}                       
                        onBodyPartPress={(slug) => 
                            Navigation_MoleUpload_2({
                                bodyPartSlug:slug,
                                gender: gender,
                                skin_type: melanomaMetaData.skin_type,
                                progress: progress,
                                completedArray: completedParts,
                                navigation: navigation
                            })}
                    />
                    </View>

                <View style={styles.colorExplain}>
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

                <Pressable onPress={() => bodyProgressBack == 1 ? setProgress(1) : setIsModalUp(!isModalUp)} style={bodyProgressBack == 1 ? styles.startButton : {opacity:0.85,borderWidth:1,alignItems:"center",width:"90%",borderRadius:30,marginBottom:0,backgroundColor:"black",marginTop:20}}>
                    <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                </Pressable>
            </View>
            {isModalUp ?
                NotAllSlugModal()
            :null
            }
        </>
        )
    }

    function FifthScreen(){
        return(
            <View style={styles.startScreen}>
                <ScrollView style={{width:"100%",marginBottom:100}}>
                    <View style={{marginTop:50,alignItems:"center"}}>  
                        <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Congratulations your birtmarks are being monitored !</Text>
                        <Image 
                            source={{uri:doctorImage}}
                            style={{width:200,height:200,marginTop:-20,zIndex:-1}}
                        />
                        <View style={{borderWidth:0.5,width:"100%",borderColor:"lightgray"}} />
                        <Text style={{fontWeight:"700",fontSize:18,marginTop:20}}>What's next ?</Text> 
                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View> 
                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View> 

                        <View style={{width:"90%",height:250,borderWidth:0.3,borderRadius:10,marginTop:20,padding:10,alignItems:"center",marginBottom:10}}>
                            <MaterialCommunityIcons 
                                name="calendar"
                                size={30}
                                style={{margin:10}}
                            />
                            <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                            <View style={{width:"100%",marginTop:10}}>                           
                                <Text style={{marginTop:10}}>• Revaluating each mole's risk</Text>
                                <Text style={{marginTop:10}}>• Comparing their growth & change to past images</Text>
                                <Text style={{marginTop:10}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                            </View>        
                        </View>          
                    </View>        
                </ScrollView>
                <Pressable onPress={() => {navigation.goBack()}} style={[styles.startButton,{marginBottom:20}]}>
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Finish</Text>
                    </Pressable>
            </View>
        )
    }

    // --- Modal ---
    function NotAllSlugModal(){
        return(
            <View style={styles.modalOverlay}> 
            <View style={styles.modalBox}>
                <View style={{alignItems:"center",padding:20}}>
                    <Text style={{fontWeight:"700",fontSize:18,marginTop:10}}>Not all body parts completed</Text>
                    <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>Sure you want to proceed ?</Text>
                </View>
                <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                    <Pressable style={styles.modalYesBtn} onPress={() => setIsModalUp(!isModalUp)}>
                        <Text style={{fontWeight:"700",color:"white"}}>No</Text>
                    </Pressable>

                    <Pressable onPress={() => {setProgress(progress + 0.1);setIsModalUp(!isModalUp);setCurrentSide("back")}} style={styles.modalNoBtn}>
                        <Text style={{fontWeight:"700"}}>Yes</Text>
                    </Pressable>

                </View>
            </View>
        </View>
        )
    }

     //<==============> Main Component Return <=============> 


    return(    
        <View style={styles.container}>
            <ProgressRow handleBack={(e) => handleBack(e)} progress={progress} />
            {round(progress,1) === 0.1 && FirstScreen()}
            {round(progress,1) === 0.2 && FactScreen()}
            {round(progress,1) === 0.3 && SecoundScreen()}
            {round(progress,1) == 0.4 && SkinBurnScreen()}
            {round(progress,1) === 0.5 && SkinTypeScreen()}
            {round(progress,1) === 0.6 && FamilyTreeScreen()}
            {round(progress,1) === 0.7 && AlertScreen()}          
            {round(progress,1) === 0.8 && ThirdScreen()}
            {round(progress,1) === 0.9 && FourthScreen()}
            {round(progress,1) === 1 && FifthScreen()}
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
    },
    HeaderText:{
        fontSize: responsiveFontSize(23),
    }
})

export default MelanomaFullProcess


const ProgressRow = ({
    handleBack,
    progress}
) => {
    return(
        <View style={styles.ProgressBar}>
        <TouchableOpacity onPress={handleBack} style={{backgroundColor:"#eee",borderRadius:30}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={20}
                style={{padding:6}}
            />
        </TouchableOpacity>

        <ProgressBar progress={progress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
        <TouchableOpacity onPress={() => handleBack(true)} style={{backgroundColor:"#eee",borderRadius:30}}>
            <MaterialCommunityIcons 
                name="close"
                size={20}
                style={{padding:6}}
            />
        </TouchableOpacity>
    </View>
    )
}