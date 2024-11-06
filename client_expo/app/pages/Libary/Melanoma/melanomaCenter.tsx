import { View, Text, TouchableOpacity,ScrollView,RefreshControl } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import {bodyFemaleFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleFront"
import {bodyFemaleBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFemaleBack"
import {bodyFront} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyFront"
import {bodyBack} from "../../../components/LibaryPage/Melanoma/BodyParts/bodyBack"
import { useAuth } from '../../../context/UserAuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { SkinModal } from "../../../components/LibaryPage/Melanoma/modals";
import { Navigation_MoleUpload_1,Navigation_SlugAnalysis } from "../../../navigation/navigation";
import { styles_shadow } from "../../../styles/shadow_styles";
import { NavBar_TwoOption } from "../../../components/Common/navBars";
import { BodyPart, DetectableRealatives, MolePerSlugNumber, SkinType, Slug, SpotData, SunBurnData, UserData} from "../../../utils/types";
import { SkinNumber_Convert } from "../../../utils/skinConvert";
import { MelanomaContent } from "./components/center/melanomaContent";
import { MolePerSlugNumber_Default, UserData_Default } from "../../../utils/initialValues";


export type MelanomaMetaData = {
    sunburn: SunBurnData;
    skin_type: SkinType;
    detected_relative: DetectableRealatives;
};

export type MelanomaModalOptions = "skin_type" | "detected_relative" | "slug" | "stage" | "sunburn"  ;



const SingleFeature = ({navigation}) => {

//<==================<[ Variables ]>====================>
    const { currentuser, melanoma } = useAuth();

    const [melanomaData, setMelanomaData] = useState<SpotData[]>([])

    const [bodySlugs, setBodySlugs] = useState<BodyPart[]>(null)
    const [ affectedSlugs,setAffectedSlugs ] = useState<{slug: Slug}[]>([])
    const [selectedSide, setSelectedSide] = useState<"front" | "back">("front");
    const [ completedParts, setCompletedParts] = useState([])
    const [numberOfMolesOnSlugs,setNumberOfMolesOnSlugs] = useState<MolePerSlugNumber>(MolePerSlugNumber_Default);
    const [userData,setUserData] = useState<UserData>(UserData_Default);
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

    const fetchAllCompletedParts = async () => {
        await melanoma.fetchCompletedParts()
        setCompletedParts(melanoma.getCompletedParts())
    }

    const fetchAllNumberOfMoleOnSlug = async () => {
        const response = await melanoma.numberOfMolesOnSlugsArray()
        setNumberOfMolesOnSlugs(response)
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

    const handleFetchSkinType = async () => {
        const response = await melanoma.fetchSkinType()
        setMelanomaMetaData(prevState => ({
            ...prevState,
            skin_type: response
        }));
    }

    const fetchAllMelanomaData = async () => {
        setMelanomaData(melanoma.getAllMelanomaData())
    }

    function handleSkinModalClose(e){
        setSkinModal(e);
        melanoma.updateSkinType(melanomaMetaData.skin_type)
    }

    const handleRefresh = () => {
        BodySvgSelector()
        AffectedSlugMap(); 
        fetchAllCompletedParts();
        fetchAllNumberOfMoleOnSlug();
        handleFetchSkinType();
    }

    useFocusEffect(
        React.useCallback(() => {
        handleRefresh();
        if(currentuser){
            setUserData(currentuser);
        }
        return () => {};
        }, [])
    );

    useEffect(() => {
        BodySvgSelector()
        AffectedSlugMap()
        fetchAllMelanomaData()
    }, [currentuser, selectedSide,melanomaData]);
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []); 

    const CenterNavComponent = () => {
        return(
        <TouchableOpacity onPress={() =>  navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})} style={[{width:"60%",height:40,borderWidth:0,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10},styles_shadow.shadowContainer]}>
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
        )
    }
    

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
                    icon_right={{name:"monitor-eye", size:25,action:() => scrollRef.current.scrollTo({ x: 0, y: 800, animated: true }) }}
                    title={null}
                    style={{borderColor:"white",borderWidth:2}}
                    titleComponent={() =>  
                        CenterNavComponent()
                    }
                />  
                <MelanomaContent 
                    navigation={navigation}
                    affectedSlugs={affectedSlugs}
                    selectedSide={selectedSide}
                    setSelectedSide={setSelectedSide}
                    melanomaMetaData={melanomaMetaData}
                    setSkinModal={setSkinModal}
                    userData={userData}
                    melanomaData={melanomaData}
                    bodySlugs={bodySlugs}
                    completedParts={completedParts}
                    handleAddMelanoma={handleAddMelanoma}
                    handleNavigation={(path,data) => Navigation_SlugAnalysis({
                        bodyPartSlug: data,
                        skin_type: melanomaMetaData.skin_type as SkinType,
                        navigation
                    })}
                    skinModal={skinModal}
                    numberOfMolesOnSlugs={numberOfMolesOnSlugs}
                />           
            </ScrollView>
            <SkinModal 
                setSkinModal={(e) => {handleSkinModalClose(e)}}
                visible={skinModal}
                handleMelanomaDataChange={handleMelanomaDataChange}
                melanomaMetaData={melanomaMetaData}
            />
        </>
    )
}



export default SingleFeature;

