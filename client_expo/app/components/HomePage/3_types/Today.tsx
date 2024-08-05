import { styles } from "../../../styles/home_style"
import { View,Text,TouchableOpacity} from "react-native"
import { TaskBox_2, } from "../taskBoxes"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PagerView from 'react-native-pager-view';
import { formatTimestampToString} from "../../../utils/date_manipulations";
import { styles_shadow } from "../../../styles/shadow_styles";
import { BodyPart, SpotData, WeatherAPIResponse } from "../../../utils/types";
import { Home_Navigation_Paths } from "../../../pages/Home/home";
import React, { useRef, useState } from 'react';
import { ImageLoaderComponent } from "../../../pages/Libary/Melanoma/slugAnalasis";
import { useWeather } from "../../../context/WeatherContext";
import { WeatherData_Default } from "../../../utils/initialValues";
import { getUvIndexCategory } from "../../../utils/uvi/uvIndexEval";
import { UviWidget } from "../../Widgets/uviWidget";
import moment from "moment";

export const TodayScreen = ({
    handleNavigation,
    handleScrollReminder,
    currentPage,
    outdatedMelanomaData,
    riskyMelanomaData,
    unfinishedMelanomaData,
    navigation,
    date,

}:
{
    handleNavigation:({path,data}:{path:Home_Navigation_Paths,data:SpotData}) => void;
    handleScrollReminder:(e:any) => void;
    currentPage:number;
    allReminders:any[];
    outdatedMelanomaData:SpotData[];
    riskyMelanomaData:any[];
    unfinishedMelanomaData:any[];
    navigation:any;
    date:string;
    
}
) => {

    const { weatherData, locationPermissionGranted,locationString } = useWeather();
    const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
    const withoutYear = moment(date).format('DD.MM');
    const today = day + " " + withoutYear; 
    return(    
        <>
            <UviWidget 
                weatherData={weatherData != null ? weatherData : WeatherData_Default.daily[0]}
                today={today}
                location={locationString}
            />
            <Text style={{color:"black"}}>{locationPermissionGranted == true ? "true" : "false"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("RegOnBoarding")}>
                <Text>Click to open on boarding</Text>
            </TouchableOpacity>
            
            <Melanoma_WidgetBox 
                riskyMelanomaData={riskyMelanomaData}
                unfinishedMelanomaData={unfinishedMelanomaData}
                handleNavigation={handleNavigation}
                outdatedMelanomaData={outdatedMelanomaData}
            />          

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
        <View style={{width:"100%",borderBottomWidth:1,borderColor:"magenta",alignItems:"center",flexDirection:"row",paddingBottom:20,padding:10,borderRadius:0,marginBottom:10,justifyContent:"space-between"}}>
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
        <View style={{ margin: 0, width: "90%", paddingBottom: 10, alignItems: "center", marginRight: "auto", marginLeft: "auto",marginTop:20,backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5 }}>
            <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:10,paddingTop:10}}>
                {type == "unfinished" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.8, margin: 10, alignSelf: "flex-start",fontSize:16 }}>Unfinished Moles</Text>}
                {type == "" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.8, margin: 10, alignSelf: "flex-start",fontSize:16 }}>Outdated Moles</Text>}
                {type == "risk" && <Text style={{ color: "white", fontWeight: "700", opacity: 0.8, margin: 10, alignSelf: "flex-start", fontSize:16 }}>Risky Moles</Text>}
                <Text style={{ color: "white", fontWeight: "700", opacity: 0.8, margin: 10, alignSelf: "flex-start" }}>{MelanomaData.length}</Text>
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
                    <TouchableOpacity onPress={toggleShowAll} style={{width:"100%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.8)",margin:-5,padding:10,borderRadius:5}}>
                    <Text style={{fontWeight:"500",fontSize:10,opacity:0.4,color:"white",marginBottom:5,}}>{MelanomaData.length - 3} moles hidden</Text>
                        <View>
                            {showAll ? <Text style={{fontWeight:"600",color:"white",opacity:0.5,fontSize:15}}>Hide</Text> : <Text style={{fontWeight:"700",color:"white",opacity:0.7,fontSize:15}}>Click to load all</Text>}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


const UvMonitor = ({weatherData}:{weatherData:WeatherAPIResponse}) => {
    return(
        <View>
            <Text>{getUvIndexCategory(Math.round(weatherData.uvi))}</Text>
        </View>
    )
}

const Melanoma_WidgetBox = ({
    outdatedMelanomaData,
    handleNavigation,
    riskyMelanomaData,
    unfinishedMelanomaData
}) => {
    return(
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
    )
}