import { styles } from "../../../styles/home_style"
import { View,Text,Pressable,TouchableOpacity,Image } from "react-native"
import { TaskBox_2,TaskBox_1 } from "../taskBoxes"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PagerView from 'react-native-pager-view';
import { formatTimestampToString, splitDate } from "../../../utils/date_manipulations";
import { styles_shadow } from "../../../styles/shadow_styles";
import { BodyPart, SpotData } from "../../../utils/types";
import { Home_Navigation_Paths } from "../../../pages/Home/home";


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

}
) => {
    return(    
        <>
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
                <View style={{margin:0,width:"90%",borderBottomWidth:0,borderColor:"white",paddingBottom:10,alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
                    <Text style={{color:"white",fontWeight:"700",opacity:0.4,margin:10,alignSelf:"flex-start"}}>Outdated Moles</Text>
                    <View style={{width:"95%",marginTop:10,alignItems:"center"}}>
                        {outdatedMelanomaData.length != 0 ?
                            outdatedMelanomaData.map((data:SpotData,index:number) => (                    
                                <OutdatedMelanomaBox 
                                    type={""}
                                    key={index}
                                    data={data}
                                    handleNavigation={handleNavigation}
                                />
                            ))
                            :
                            <EmptyLabel 
                                label={"All moles are up to date"}
                            />
                        }  
                    </View>
                </View>
                {riskyMelanomaData.length != 0 &&
                <View style={{margin:0,width:"90%",borderBottomWidth:0,borderColor:"white",paddingBottom:10,alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
                    <Text style={{color:"white",fontWeight:"700",opacity:0.4,margin:10,alignSelf:"flex-start"}}>Action Required</Text>
                    <View style={{width:"95%",marginTop:10,alignItems:"center"}}>
                        
                            {riskyMelanomaData.map((data:SpotData,index:number) => (
                                data.risk >= 0 &&
                                <OutdatedMelanomaBox 
                                    type={"risk"}
                                    data={data}
                                    key={index}
                                    handleNavigation={handleNavigation}
                                />
                            ))                    
                            }   
                    </View>
                </View>
                }
                {unfinishedMelanomaData.length != 0 &&
                <View style={{margin:0,width:"90%",borderBottomWidth:0,borderColor:"white",paddingBottom:10,alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
                    <Text style={{color:"white",fontWeight:"700",opacity:0.4,margin:10,alignSelf:"flex-start"}}>Unfinished Moles</Text>
                    <View style={{width:"95%",marginTop:10,alignItems:"center"}}>
                    {unfinishedMelanomaData.map((data:SpotData,index:number) => (                    
                        <OutdatedMelanomaBox 
                            type={"unfinished"}
                            data={data}
                            key={index}
                            handleNavigation={handleNavigation}
                        />
                    ))}
                    </View>
                </View>
                }

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
    return(
        <View style={{width:"100%",borderBottomWidth:1,borderColor:"gray",alignItems:"center",flexDirection:"row",paddingBottom:20,padding:10,borderRadius:0,marginBottom:10,justifyContent:"space-between"}}>
        <View style={{width:"70%",flexDirection:"row",alignItems:"center"}}>
            <Image 
                source={{uri: data.melanomaPictureUrl}}
                style={{width:50,height:50,borderWidth:1,borderColor:"white",borderRadius:10}}
            />
            <View style={{marginLeft:10}}>
                <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:13}}>{data.melanomaId}</Text>
                {type == "risk" ? <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5}}><Text style={{opacity:0.5}}>Risk:</Text> {data.risk}</Text> : type != "unfinished" ? <Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5}}><Text style={{opacity:0.5}}>Uploaded:</Text> {formatTimestampToString(data.created_at)}</Text>:<Text style={{color:"white",fontWeight:"600",opacity:0.8,fontSize:10,marginTop:5}}><Text style={{opacity:0.5}}> Not analised: </Text>{data.melanomaDoc.spot[0].slug} </Text>}
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