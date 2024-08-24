import { styles } from "../../../styles/home_style"
import { View,Text,TouchableOpacity} from "react-native"
import { TaskBox_2, } from "../taskBoxes"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PagerView from 'react-native-pager-view';
import { formatTimestampToString} from "../../../utils/date_manipulations";
import { styles_shadow } from "../../../styles/shadow_styles";
import { SpotData, WeatherAPIResponse } from "../../../utils/types";
import { Home_Navigation_Paths } from "../../../pages/Home/home";
import React, { useEffect, useState } from 'react';
import { useWeather } from "../../../context/WeatherContext";
import { WeatherData_Default } from "../../../utils/initialValues";
import { getUvIndexCategory } from "../../../utils/uvi/uvIndexEval";
import { UviWidget } from "../../Widgets/uviWidget";
import moment from "moment";
import { ImageLoaderComponent } from "../../Common/imageLoader";
import { DataModal, generateTodayForWidget, selectableDataTypes } from "../../../pages/Profile/tabs/userSavedPage";
import { ContextPanelData } from "../../../models/ContextPanel";
import { useAuth } from "../../../context/UserAuthContext";
import { PagerComponent } from "../../Common/pagerComponent";
import { Navigation_AddBloodWork } from "../../../navigation/navigation";

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
    const { currentuser } = useAuth();
    const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
    const withoutYear = moment(date).format('DD.MM');
    const today = day + " " + withoutYear; 
    const contextObj = new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted})
    const [unactiveComponents, setUnactiveComponents] = useState([])
    const [selectedData, setSelectedData] = useState<selectableDataTypes | null>(null);
    const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])

    const fetchContextOptions = async () => {
        await contextObj.loadContextData();
        const data = contextObj.getContextOptions();
        setContextOptions(data);
        let unaddedData = [];
        
        data.forEach(item => {
            if (item.stateName == null) {
                unaddedData.push(item.stateID);
            }
        });

        console.log(unaddedData);

        unaddedData.forEach(item => {
            if (item === "useBloodWork") {
                console.log("Blood Work ADDED");
                setUnactiveComponents(prevContextOptions => [
                    ...prevContextOptions,
                    {
                        pageComponent: () => (
                            <TaskBox_2 
                                title={"Blood Work"} 
                                icon1="robot" 
                                icon2="magnify" 
                                icon3="doctor" 
                                icon4="calendar" 
                                buttonText="Add Now"
                                nav_page="Add_BloodWork"
                                handleNavigation={handleNavigation}
                                key={0}  
                                handleStart={() => Navigation_AddBloodWork({navigation:navigation,type:"first"})}
                                index={0}                      
                            />
                        )
                    }
                ]);
            } else if (item === "useMedicalData") {
                console.log("Allergies ADDED");
                setUnactiveComponents(prevContextOptions => [
                    ...prevContextOptions,
                    {
                        pageComponent: () => (
                            <TaskBox_2 
                                title={"Allergies"} 
                                icon1="robot" 
                                icon2="magnify" 
                                icon3="doctor" 
                                icon4="calendar" 
                                buttonText="Add Now"
                                nav_page="Add_BloodWork"
                                handleNavigation={handleNavigation}
                                key={1}  
                                index={1}           
                                handleStart={() => setSelectedData("useMedicalData")}           
                            />
                        )
                    }
                ]);
            }
        });
    };
    
    //ASYNC USE EFFECT
    useEffect(() => {
        fetchContextOptions();            
    }, []);

    const handleContextDataChange = async (field:selectableDataTypes,data:any[]) => {
        console.log(field,data)
        await contextObj.setContextOptions(field,data)
        const response = contextObj.getContextOptions()
        console.log(response)
        setContextOptions(response)
    }
    

    return(    
        <>
            <UviWidget 
                weatherData={locationPermissionGranted ? (weatherData != null ? weatherData : WeatherData_Default) : false}
                today={today}
                location={locationString}
                isForcast={false}
            />
            <TouchableOpacity onPress={() => navigation.navigate("RegOnBoarding")}>
                <Text>Click to open on boarding</Text>
            </TouchableOpacity>
            
            <Melanoma_WidgetBox 
                riskyMelanomaData={riskyMelanomaData}
                unfinishedMelanomaData={unfinishedMelanomaData}
                handleNavigation={handleNavigation}
                outdatedMelanomaData={outdatedMelanomaData}
            />          
        {unactiveComponents.length != 0 &&
            <View style={[styles.DataSection]}>
                <View>
                    <Text style={{color:"white",opacity:0.3,fontWeight:"400",fontSize:11,paddingHorizontal:10,marginBottom:-10,paddingVertical:5}}>More data, better prediction</Text>
                    <Text style={styles.title}>Haven't added yet ...</Text>                     
                </View>
                
                <PagerComponent 
                    dotColor={"white"}
                    pagerStyle={{height:350,borderWidth:1,marginTop:10}}
                    indicator_position={{backgroundColor:"black",padding:12}}
                    pages={unactiveComponents}
                />                       
            </View>
        }
        <DataModal
            selectedData={selectedData}
            setSelectedData={(e) => {setSelectedData(e);e == null && setUnactiveComponents([])}}
            uviData={
                {
                    locationString:locationString,
                    weatherData:weatherData,
                    today:generateTodayForWidget(),
                    locationPermissionGranted:locationPermissionGranted
                }
            }
            userContexts={ContextOptions}
            setUserContexts={(field,data) => handleContextDataChange(field,data)}
            handleAllergiesFetch={() => {}}
        />
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