import { styles } from "../../../styles/home_style"
import { View,Text,Pressable,TouchableOpacity,Image, Button, TouchableOpacityBase } from "react-native"
import { TaskBox_2,TaskBox_1 } from "../taskBoxes"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PagerView from 'react-native-pager-view';
import { formatTimestampToString, splitDate } from "../../../utils/date_manipulations";
import { styles_shadow } from "../../../styles/shadow_styles";
import { BodyPart, SpotData } from "../../../utils/types";
import { Home_Navigation_Paths } from "../../../pages/Home/home";
import React, { useRef, useState } from 'react';
import { ImageLoaderComponent } from "../../../pages/Libary/Melanoma/slugAnalasis";
import { getWeatherData, WeatherApiCallTypes } from "../../../services/server";

export const TodayScreen = ({
    allReminders,
    handleNavigation,
    handleScrollReminder,
    handleScroll,
    currentPageReminder,
    currentPage,
    format,
    outdatedMelanomaData,
    riskyMelanomaData,
    unfinishedMelanomaData,
    navigation
}:
{
    handleNavigation:({path,data}:{path:Home_Navigation_Paths,data:SpotData}) => void;
    handleScrollReminder:(e:any) => void;
    handleScroll:(e:any) => void;
    currentPageReminder:number;
    currentPage:number;
    format:string;
    allReminders:any[];
    outdatedMelanomaData:SpotData[];
    riskyMelanomaData:any[];
    unfinishedMelanomaData:any[];
    navigation:any;
}
) => {
    return(    
        <>
            <UvMonitor />
            <TouchableOpacity onPress={() => navigation.navigate("RegOnBoarding")}>
                <Text>Click to open on boarding</Text>
            </TouchableOpacity>
            <View style={[styles.TodaySection,styles_shadow.hightShadowContainer]}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Melanoma Monitor</Text>
                    <View style={styles.titleLeft}>
                        <MaterialCommunityIcons 
                            name='liquid-spot'
                            color={"white"}
                            size={30}
                        />
                    </View>
                </View>

                <SpecialMelanomaDataComponent
                    MelanomaData={outdatedMelanomaData}
                    handleNavigation={handleNavigation}
                    type={""}
                />
                <SpecialMelanomaDataComponent
                    MelanomaData={riskyMelanomaData}
                    handleNavigation={handleNavigation}
                    type={"risk"}
                />
                <SpecialMelanomaDataComponent
                    MelanomaData={unfinishedMelanomaData}
                    handleNavigation={handleNavigation}
                    type={"unfinished"}
                />

            </View>           

   

            <View style={[styles.DataSection]}>
                <View style={{}}>
                    <Text style={{color:"white",opacity:0.3,fontWeight:"400",fontSize:11,paddingHorizontal:10,marginBottom:-10,paddingVertical:5}}>More data, better prediction</Text>
                    <Text style={styles.title}>Haven't added yet ...</Text>                     
                </View>

                <PagerView style={{marginTop:10,height:365 }} onPageScroll={(e) => handleScrollReminder(e)}   initialPage={0}>
                    <TaskBox_2 
                        title="Blood Work" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now"
                        nav_page="Add_BloodWork"
                        handleNavigation={handleNavigation}
                        key={1}  
                        index={1}                      
                    />
                    <TaskBox_2
                        title="Lifestyle Assesment" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now" 
                        nav_page="Add_BloodWork"
                        key={2}   
                        handleNavigation={handleNavigation}
                        index={2}   
                    />
                    <TaskBox_2
                    title="Personal Assesment" 
                    icon1="robot" 
                    icon2="magnify" 
                    icon3="doctor" 
                    icon4="calendar" 
                    handleNavigation={handleNavigation}
                    buttonText="Add Now" 
                    nav_page="Add_BloodWork"
                    key={3}   
                    index={3}   
                    />
                    <TaskBox_2
                    title="Medical Assesment" 
                    icon1="robot" 
                    icon2="magnify" 
                    nav_page="Add_BloodWork"
                    icon3="doctor" 
                    icon4="calendar" 
                    buttonText="Add Now" 
                    key={4}   
                    handleNavigation={handleNavigation}
                    index={4}   
                    />    
                </PagerView>                                 

                <View style={styles.IndicatorContainer}>
                    <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />
                    <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />
                    <View style={[styles.Indicator, { opacity: currentPage === 2 ? 1 : 0.3 }]} />
                    <View style={[styles.Indicator, { opacity: currentPage === 3 ? 1 : 0.3 }]} />
                </View>

            </View>

            <View style={styles.TodaySection}>
                <Text style={styles.title}>Personal Advice</Text>
                
            </View>

            <View style={styles.TodaySection}>
                <Text style={styles.title}>News</Text>
                                        
            </View>
        </>
        )
}


const OutdatedMelanomaBox = ({
    type,
    data,
    handleNavigation
}
:
{
    data:SpotData;
    type:"risk" | "" | "unfinished";
    handleNavigation:({path,data}:{path:Home_Navigation_Paths, data:SpotData}) => void;
}) => {
    
    const imageLoad = useRef<any>(null);
    const [loading,setLoading] = useState<boolean>(false);

    return(
        <View style={{width:"100%",borderBottomWidth:1,borderColor:"gray",alignItems:"center",flexDirection:"row",paddingBottom:20,padding:10,borderRadius:0,marginBottom:10,justifyContent:"space-between"}}>
        <View style={{width:"70%",flexDirection:"row",alignItems:"center"}}>
            <ImageLoaderComponent 
                data={data}
                style={{borderWidth:1,borderColor:"white",borderRadius:10}}
                w={50}
                h={50}
            />
            <View style={{marginLeft:10}}>
                <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:13}}>{data.melanomaId}</Text>
                {type == "risk" ? <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5}}><Text style={{opacity:0.5}}>Risk:</Text> {Math.round(data.risk* 100) / 100}</Text> 
                : 
                type != "unfinished" ? <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5}}><Text style={{opacity:0.5}}>Uploaded:</Text> {formatTimestampToString(data.created_at)}</Text>
                :
                <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5,maxWidth:"90%"}}><Text style={{opacity:0.5}}> Not analised: </Text>{data.melanomaDoc.spot.slug} </Text>}
            </View>
        </View>
        
        <TouchableOpacity onPress={() => handleNavigation({path:type,data:data})} style={{backgroundColor:"white",flexDirection:"row",alignItems:"center",padding:9,borderRadius:5,opacity:0.8,width:"25%"}}>
            {type == "risk" && <Text style={{color:"black",fontWeight:"500",fontSize:10,marginRight:5,opacity:0.8}}>Show</Text>}
            {type == "" && <Text style={{color:"black",fontWeight:"500",fontSize:10,marginRight:5,opacity:0.8}}>Update</Text>}
            {type == "unfinished" && <Text style={{color:"black",fontWeight:"500",fontSize:10,marginRight:5,opacity:0.8}}>Analise</Text>}
            <MaterialCommunityIcons 
                name='arrow-right'
                color={"magenta"}
                size={10}
            />
        </TouchableOpacity>
    </View>
    )
}


const EmptyLabel = ({
    label
}) => {
    return(
        <View style={{margin:15,opacity:0.1}}>
            <Text style={{color:"white",fontWeight:"800",fontSize:15}}>
                {label}
            </Text>
        </View>
    )
}


const SpecialMelanomaDataComponent = ({ MelanomaData, handleNavigation,type }) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        MelanomaData.length !== 0 &&
        <View style={{ margin: 0, width: "90%", borderBottomWidth: 0, borderColor: "white", paddingBottom: 10, alignItems: "center", marginRight: "auto", marginLeft: "auto",marginTop:20 }}>
            <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                {type == "unfinished" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.4, margin: 10, alignSelf: "flex-start" }}>Unfinished Moles</Text>}
                {type == "" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.4, margin: 10, alignSelf: "flex-start" }}>Outdated Moles</Text>}
                {type == "risk" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.4, margin: 10, alignSelf: "flex-start" }}>Risky Moles</Text>}
                <Text style={{ color: "white", fontWeight: "700", opacity: 0.4, margin: 10, alignSelf: "flex-start" }}>{MelanomaData.length}</Text>
            </View>
            <View style={{ width: "95%", marginTop: 10, alignItems: "center" }}>
                {MelanomaData.length !== 0 ? (
                    MelanomaData.slice(0, showAll ? MelanomaData.length : 3).map((data, index) => (
                        <OutdatedMelanomaBox
                            type={type}
                            data={data}
                            key={index}
                            handleNavigation={handleNavigation}
                        />
                    ))
                ) : type != "risky" ? ( 
                    <EmptyLabel 
                        label={"All moles are up to date"}
                    />
                ):null}
                {MelanomaData.length > 3 && ( 
                    <>
                    <Text style={{fontWeight:"500",fontSize:10,opacity:0.4,color:"white",marginBottom:5}}>{MelanomaData.length - 3} moles hidden</Text>
                        <TouchableOpacity onPress={toggleShowAll} >
                            {showAll ? <Text style={{fontWeight:"400",color:"magenta",opacity:0.5,fontSize:15}}>Hide</Text> : <Text style={{fontWeight:"400",color:"magenta",opacity:0.5,fontSize:15}}>Click to load all</Text>}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const handleGetUv = async ({part,lat,lon}:WeatherApiCallTypes) => {
    const response = await getWeatherData({
        part:part,
        lat:lat,
        lon:lon
    });
    if( response != null){
        const data = await response.json();
    }
}

const UvMonitor = () => {
    return(
        <View>
            <TouchableOpacity onPress={() => handleGetUv({
                part:"daily",
                lat:33.44,
                lon:-94.04
            })}>
                <Text>Call API</Text>
            </TouchableOpacity>
        </View>
    )
}