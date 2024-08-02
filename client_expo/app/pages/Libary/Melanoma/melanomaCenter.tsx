import { View, Text, TouchableOpacity,Pressable,ScrollView,StyleSheet,RefreshControl,Modal } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Body from "../../../components/LibaryPage/Melanoma/BodyParts/index";
import { LinearGradient } from 'expo-linear-gradient';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import {bodyFemaleFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleFront"
import {bodyFemaleBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleBack"
import {bodyFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFront"
import {bodyBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyBack"
import { useAuth } from '../../../context/UserAuthContext';
import { fetchAllMelanomaSpotData,fetchCompletedParts, fetchNumberOfMolesOnSlugs } from '../../../services/server';
import { useFocusEffect } from '@react-navigation/native';
import { SkinModal } from "../../../components/LibaryPage/Melanoma/modals";
import { Mstyles } from "../../../styles/libary_style";
import { NavBar_Main } from "../../../components/LibaryPage/Melanoma/navBarRow";
import { numberOfMolesOnSlugs, SlugCard } from "../../../components/LibaryPage/Melanoma/slugCard";
import { Navigation_MoleUpload_1,Navigation_SlugAnalysis } from "../../../navigation/navigation";
import { AssistantAdvertBox } from "../../../components/LibaryPage/Melanoma/Assistance/assistantAdvert";
import { styles_shadow } from "../../../styles/shadow_styles";
import { NavBar_TwoOption } from "../../../components/Common/navBars";
import { BodyPart, SkinType, Slug, SpotData, UserData} from "../../../utils/types";
import { SkinNumber_Convert } from "../../../utils/skinConvert";
import { OneOptionBox } from "../../../components/LibaryPage/Melanoma/boxes/oneOptionBox";
import { SunBurnScreen } from "./ModalScreens/sunBurnScreen";


export type MelanomaMetaData = {
    sunburn: { stage: number; slug: Slug }[];
    skin_type: SkinType;
    detected_relative: string;
};

export type MelanomaModalOptions = "skin_type" | "detected_relative" | "slug" | "stage" | "sunburn" ;



const SingleFeature = ({navigation}) => {

//<==================<[ Variables ]>====================>

    const { currentuser } = useAuth();
    const [bodySlugs, setBodySlugs] = useState<BodyPart[]>(null)
    const [ affectedSlugs,setAffectedSlugs ] = useState<{slug: Slug}[]>([])
    const [selectedSide, setSelectedSide] = useState<"front" | "back">("front");
    const [melanomaData, setMelanomaData] = useState<SpotData[]>([])
    const [ completedParts, setCompletedParts] = useState([])
    const [numberOfMolesOnSlugs,setNumberOfMolesOnSlugs] = useState<numberOfMolesOnSlugs>([])
    const [selectedModalItem,setSelectedModalItem] = useState<MelanomaModalOptions | null>(null)
    const [ melanomaMetaData, setMelanomaMetaData] = useState<MelanomaMetaData>({
        sunburn:[{
            stage:0,
            slug:""
        }],
        skin_type: 0,
        detected_relative:"none",

    })
    const [ skinModal,setSkinModal] = useState(false)
    const scrollRef = useRef(null)
    const [refreshing, setRefreshing] = useState(false);


//<==================<[ Functions ]>====================>

    const fetchAllMelanomaData = async () => {
        if(currentuser){
            const response = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender:currentuser.gender
            });
            if(response != false){
                setMelanomaData(response);
            } else {
                setMelanomaData([])
            }
        }
    }



    const fetchAllCompletedParts = async () => {
        if(currentuser){
            const response = await fetchCompletedParts({
                userId: currentuser.uid,
            });
            if(response != undefined){
                const completedSlugs = response.map(part => part.slug);     
                setCompletedParts(completedSlugs)
            }
        }
    }

    const fetchAllNumberOfMoleOnSlug = async () => {
        if(currentuser){
            const response = await fetchNumberOfMolesOnSlugs({
                userId: currentuser.uid,
                gender: currentuser.gender
            });
            setNumberOfMolesOnSlugs(response)
        }
    }

    const BodySvgSelector = () => {
        if(currentuser.gender == "male" && selectedSide == 'front'){
            setBodySlugs(bodyFront(SkinNumber_Convert(melanomaMetaData.skin_type)));
        } else if ( currentuser.gender == "female" && selectedSide == 'front' ){
            setBodySlugs(bodyFemaleFront(SkinNumber_Convert(melanomaMetaData.skin_type)));
        } else if ( currentuser.gender == "male" && selectedSide == 'back' ){
            setBodySlugs(bodyBack(SkinNumber_Convert(melanomaMetaData.skin_type)));
        } else if ( currentuser.gender == "female" && selectedSide == 'back' ){
            setBodySlugs(bodyFemaleBack(SkinNumber_Convert(melanomaMetaData.skin_type)));
        }
    }
    
    const AffectedSlugMap = () => {
        if(melanomaData != null && melanomaData.length != 0){
            const affectedSlug = melanomaData.map((data:SpotData, index) => {
                const spotSlug = data.melanomaDoc.spot.slug;
                if( data.risk != null && data.risk != undefined){
                    const intensity = Number(data.risk) >= 0.3 ? (Number(data.risk)  >= 0.8 ? 1 : 3) : 2;
                    return { slug: spotSlug, key:index }; 
                }
                return { slug: spotSlug }; 
            });
            setAffectedSlugs(affectedSlug);
        }

    }

    const handleAddMelanoma = () => {
        Navigation_MoleUpload_1({
            skin_type: melanomaMetaData.skin_type as SkinType,
            navigation: navigation
        })
    }

    const handleMelanomaDataChange = (type, data) => {
        setMelanomaMetaData((prevState) => {
        let newSunburn = [...prevState.sunburn];               
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

    const handleRefresh = () => {
        BodySvgSelector()
        AffectedSlugMap(); 
        fetchAllMelanomaData();
        fetchAllCompletedParts();
        fetchAllNumberOfMoleOnSlug();
    }

    const handleNavigation = (path:string,data:any) => {
        if ( path ==  "SlugAnalasis"){
            Navigation_SlugAnalysis({
                bodyPartSlug: data,
                skin_type: melanomaMetaData.skin_type as SkinType,
                navigation
            })
        }
    }

    useFocusEffect(
        React.useCallback(() => {
        handleRefresh();
        return () => {};
        }, [])
    );

    useEffect(() => {
        BodySvgSelector()
        AffectedSlugMap()
    }, [currentuser, selectedSide,melanomaData]);
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []); 


//<==================<[ Main Return ]>====================>

    return(
        <>
            <ScrollView 
                style={{backgroundColor:"white",width:"100%"}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']} 
                        tintColor={'magenta'}       
                    />
                }
                scrollEventThrottle={16}
                ref={scrollRef}
            >
                <NavBar_TwoOption 
                    icon_left={{name:"arrow-left", size:25,action:() => navigation.goBack()}}
                    icon_right={{name:"monitor-eye", size:25,action:() => navigation.goBack()}}
                    title={null}
                    style={{borderColor:"white",borderWidth:2}}
                    titleComponent={() =>  
                        <TouchableOpacity onPress={() =>  navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})} style={[{width:"60%",height:50,borderWidth:0,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10},styles_shadow.shadowContainer]}>
                <Text style={{color:"white",opacity:0.7,fontWeight:"500",fontSize:10}}>Click to start</Text>
                <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>                     
                <Text style={{fontSize:14,fontWeight:"600",marginRight:10,color:"white"}}>Full Body Monitor Setup</Text>                        
                    <MaterialCommunityIcons 
                        name="liquid-spot"
                        size={15}
                        color={"white"}
                    />   
                </View>                        
                        </TouchableOpacity>
                    }
                />  
                <MelanomaContent 
                    navigation={navigation}
                    affectedSlugs={affectedSlugs}
                    selectedSide={selectedSide}
                    setSelectedSide={setSelectedSide}
                    melanomaMetaData={melanomaMetaData}
                    setSkinModal={setSkinModal}
                    userData={currentuser}
                    melanomaData={melanomaData}
                    bodySlugs={bodySlugs}
                    completedParts={completedParts}
                    handleAddMelanoma={handleAddMelanoma}
                    handleNavigation={handleNavigation}
                    skinModal={skinModal}
                    numberOfMolesOnSlugs={numberOfMolesOnSlugs}
                    setSelectedModalItem={setSelectedModalItem}
                />           
            </ScrollView>
            <SkinModal 
                setSkinModal={setSkinModal}
                visible={skinModal}
                handleMelanomaDataChange={handleMelanomaDataChange}
                melanomaMetaData={melanomaMetaData}
            />
            <Modal animationType="slide" visible={selectedModalItem != null}>
                <>
                <TouchableOpacity style={{position:"absolute",top:62,left:20,zIndex:100,padding:7,backgroundColor:"black",alignItems:"center",borderRadius:100}} onPress={() => setSelectedModalItem(null)}>
                    <MaterialCommunityIcons 
                        name="close"
                        size={20}
                        color={"white"}
                    />
                </TouchableOpacity>
                {selectedModalItem == "sunburn" && 
                <SunBurnScreen 
                    setSelectedModalItem={setSelectedModalItem}
                    handleMelanomaDataChange={handleMelanomaDataChange}
                    melanomaMetaData={melanomaMetaData}
                    setMelanomaMetaData={setMelanomaMetaData}
                    gender={currentuser.gender}
                /> }
                </>
            </Modal>
        </>
    )
}



export default SingleFeature;

const MelanomaContent = ({
    navigation,
    affectedSlugs,
    selectedSide,
    setSelectedSide,
    melanomaMetaData,
    setSkinModal,
    skinModal,
    userData,
    melanomaData,
    bodySlugs,
    completedParts,
    handleAddMelanoma,
    handleNavigation,
    numberOfMolesOnSlugs,
    setSelectedModalItem
}:{
    navigation:any;
    affectedSlugs:{slug: Slug}[];
    selectedSide:"front" | "back";
    setSelectedSide:Function;
    melanomaMetaData:MelanomaMetaData;
    setSkinModal:Function;
    skinModal:boolean;
    melanomaData:SpotData[];
    bodySlugs:BodyPart[];
    userData:UserData;
    completedParts: Slug[];
    handleAddMelanoma:() => void;
    handleNavigation:(path:string,data:any) => void;
    numberOfMolesOnSlugs: {Slug: number}[];
    setSelectedModalItem:Function;
}) => {
    return(
        <View style={Mstyles.container}>   
        <LinearGradient
            colors={['white', '#fc8bfb','white']}
            locations={[0.1,0.90,0.6]}        
            style={{width:"100%",alignItems:"center"}}
        >      
        <View style={Mstyles.melanomaTitle}>
            <View style={Mstyles.melanomaTitleLeft}>
                <Text style={Mstyles.melanomaTag}>AI Vision</Text>
                <Text style={{fontSize:20,fontWeight:"700"}}>Melanoma Monitoring</Text>
                <Text style={{fontSize:12,maxWidth:"100%",opacity:0.4,marginTop:5,fontWeight:"500"}}>Click on the body part for part analasis</Text>   
            </View>       
            <TouchableOpacity onPress={() => setSkinModal(!skinModal)} style={[{width:50,height:50,backgroundColor:`${melanomaMetaData.skin_type != undefined ? SkinNumber_Convert(melanomaMetaData.skin_type) : "white"}`,borderRadius:100,borderWidth:3,borderColor:"white"},styles_shadow.shadowContainer]} />
        </View>
        <View style={styles_shadow.shadowContainer}>
            <Body
                data={affectedSlugs}
                gender={userData.gender}
                side={selectedSide}
                scale={1.1}
                colors={['#FF0000','#A6FF9B','#FFA8A8']}
                onBodyPartPress={(slug) => Navigation_SlugAnalysis({
                    bodyPartSlug: slug,
                    skin_type: melanomaMetaData.skin_type as SkinType,
                    navigation
                })}
                skinColor={melanomaMetaData.skin_type}
            />
        </View>

        <View style={[Mstyles.colorExplain,{top:300}]}>
            <View style={Mstyles.colorExplainRow} >
                <View style={Mstyles.redDot} />
                <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Higher risk</Text>
            </View>

            <View style={Mstyles.colorExplainRow}>
                <View style={Mstyles.greenDot} />
                <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>No risk</Text>
            </View>
        </View>

        <View style={[Mstyles.positionSwitch,styles_shadow.shadowContainer]}>
            <Pressable onPress={() => setSelectedSide("front")}>
                <Text style={selectedSide == "front" ? {fontWeight:"600"}:{opacity:0.5}}>Front</Text>
            </Pressable>
            <Text>|</Text>
            <Pressable onPress={() => setSelectedSide("back")}>
                <Text style={selectedSide == "back" ? {fontWeight:"600"}:{opacity:0.5}}>Back</Text>
            </Pressable>
        </View>                      
        </LinearGradient>                    

        <View style={Mstyles.analasisSection}>
            <Pressable onPress={handleAddMelanoma} style={[Mstyles.AddMelanomaBtn]}>
                <View style={[{borderRadius:10,backgroundColor:"black",width:"100%",alignItems:"center",justifyContent:"center",height:"100%"},styles_shadow.shadowContainer]}>                                         
                    <Text style={{color:"white",opacity:0.5,fontWeight:"600",fontSize:10,marginBottom:5}}>Click to registe a new mole</Text>
                    <Text style={{color:"white",fontWeight:"700",fontSize:17,opacity:0.8}}>
                        + Add New Mole
                    </Text>
                </View>
            </Pressable>
            <View style={[Mstyles.melanomaTitle,{marginTop:50,marginBottom:30}]}>
                <View style={Mstyles.melanomaTitleLeft}>
                    <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
                    <Text style={{fontSize:20,fontWeight:"700"}}>Your Moles</Text>                                    
                </View>

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                {bodySlugs != null &&  (
                    bodySlugs.map((bodyPart,index) => (
                        <SlugCard 
                            handleNavigation={handleNavigation}
                            bodyPart={bodyPart}
                            userData={userData}
                            completedParts={completedParts}
                            numberOfMolesOnSlugs={numberOfMolesOnSlugs}
                            melanomaData={melanomaData}
                            index={index}
                            key={`box_${bodyPart.slug}_${index}`}
                            skin_type={melanomaMetaData.skin_type}
                        />
                    ))
                )}
            </ScrollView>
        </View>

        <RelatedBoxesContainer 
            navigation={navigation}
            setSelectedModalItem={setSelectedModalItem}
        />

        <LearnBoxesContainer 
            navigation={navigation}
        />

    </View>   
    )
}

const RelatedBoxesContainer = ({navigation,setSelectedModalItem}) => {
    return(
        <>
        <View style={[Mstyles.melanomaTitle,{marginTop:0,marginBottom:30}]}>
        <View style={Mstyles.melanomaTitleLeft}>
            <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
            <Text style={{fontSize:20,fontWeight:"700"}}>Prevent Skin Cancer</Text>                                    
        </View>
    </View>

    <View style={Mstyles.educationSection}>
        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Your Skin Data"
            image={require("../../../assets/type.png")}
            bgColor={"black"}
            textColor={"white"}
            id="skin_data"
        />

        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Track Sun Burn"
            image={require("../../../assets/burn.png")}
            bgColor={"orange"}
            onClick={() => setSelectedModalItem("sunburn")}
            id="sun_burn"
        />

        <OneOptionBox 
            navigation={navigation}
            buttonTitle="How it works ?"
            subTitle="100% Transparency - Open Source"
            mainTitle="Our AI Model"
            image={require("../../../assets/ai.png")}
            bgColor="white"
            id="ai_model"
        />

        <AssistantAdvertBox 
            navigation={navigation}
        />

    </View>
    </>
    )
}

const LearnBoxesContainer = ({navigation}) => {
    return(
        <>
        <View style={[Mstyles.melanomaTitle,{marginTop:70,marginBottom:30}]}>
        <View style={Mstyles.melanomaTitleLeft}>
            <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
            <Text style={{fontSize:20,fontWeight:"700"}}>Learn about skin cancer</Text>                                    
        </View>
    </View>

    <View style={Mstyles.educationSection}>
        <OneOptionBox 
            navigation={navigation}
            buttonTitle="Start Learning"
            subTitle="ABCDE Rule"
            mainTitle="Detect Skin Cancer"
            image={require("../../../assets/abcde.png")}
            bgColor="white"
            id="abcde"
        />

        <OneOptionBox 
            navigation={navigation}
            buttonTitle="How it works ?"
            subTitle="100% Transparency - Open Source"
            mainTitle="Our AI Model"
            image={require("../../../assets/ai.png")}
            bgColor="white"
            id="ai_model"
        />

        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Your Skin Data"
            image={require("../../../assets/type.png")}
            bgColor={"black"}
            textColor={"white"}
            id="skin_data"
        />

    </View>
    </>
    )
}
