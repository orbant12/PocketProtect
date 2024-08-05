import { StyleSheet, Text, View } from "react-native"
import { styles } from "../../styles/home_style"
import { styles_shadow } from "../../styles/shadow_styles"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { WeatherSortedResponse } from "../../utils/types"
import { useEffect, useState } from "react"
import { getUvIndexCategory } from "../../utils/uvi/uvIndexEval"
import { getUviIndexSpf } from "../../utils/uvi/uviIndexSpf"
import { getUviIndexExposure } from "../../utils/uvi/uviIndexExposure"
import { getUviIndexSunscreen } from "../../utils/uvi/uviIndexSunscreen"

const ClockComponent = () => {
    const [time, setTime] = useState(new Date());
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);
  
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
  
    return formatTime(time)
  };

export const UviWidget = ({ weatherData,today,location }:{weatherData:WeatherSortedResponse, today:string,location:string}) => {
    return(
        <View style={[styles.TodaySection,styles_shadow.hightShadowContainer]}>
            <View style={[styles.titleRow,{alignItems:"baseline"}]}>
                <Text style={styles.title}>UV Index & Skin Cancer</Text>
                <View style={[styles.titleLeft,{alignItems:"flex-end",opacity:0.8}]}>
                    <Text style={{color:"white",marginBottom:10,fontSize:23,fontWeight:"800"}}>{ClockComponent()}</Text>
                    <Text style={{color:"white",fontSize:13}}>{today}</Text>
                </View>
            </View>
            <View style={{width:"85%",flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",alignSelf:"flex-end",marginRight:10}}>
                <Text style={{color:"white",fontWeight:"100",fontSize:60,marginTop:-15}}>{Math.round(weatherData.uvi)}<Text style={{fontSize:15,fontWeight:"600"}}> Index</Text> </Text>
                <Text style={{color:"white",fontWeight:"300",fontSize:18,opacity:0.6}}>{location}</Text>
            </View>
            <View style={{width:"90%",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5,marginTop:30,padding:20}}>
                <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row",alignSelf:"center",alignItems:"center"}}>
                    <Text style={{color:"white",fontSize:17,fontWeight:"700",opacity:0.8}}>Level: </Text>
                    <Text style={{color:"white",fontSize:17}}>{getUvIndexCategory(Math.round(weatherData.uvi))}</Text>
                </View>
                <View style={{width:"100%",borderColor:"magenta",marginVertical:20,borderWidth:1.5,opacity:0.2,borderRadius:100}} />
                <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row",alignSelf:"center",alignItems:"center"}}>
                    <Text style={{color:"white",fontSize:17,fontWeight:"700",opacity:0.8}}>Sun Protection: </Text>
                    <Text style={{color:"white",fontSize:17}}>{getUviIndexSpf(Math.round(weatherData.uvi))}</Text>
                </View>
            </View>
            <View style={{width:"90%",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5,marginTop:30,padding:20}}>
                <MaterialCommunityIcons 
                    name="jquery"
                    size={30}
                    color={"white"}
                />
                <Text style={{color:"white",fontWeight:"600",opacity:0.7,marginTop:10,textAlign:"center"}}>{getUviIndexExposure(Math.round(weatherData.uvi))}</Text>
                <View style={{position:"absolute",right:0,top:0,padding:10,borderBottomLeftRadius:8,backgroundColor:"rgba(0,0,0,0.4)"}}>
                    <Text style={{color:"white",fontSize:12,fontWeight:"600",opacity:0.8}}>Untill <Text style={{fontWeight:"800"}}>{ClockComponent()}</Text></Text>
                </View>
            </View>
            <View style={{width:"90%",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5,marginTop:30,padding:20}}>
                <MaterialCommunityIcons 
                    name="sun-wireless"
                    size={30}
                    color={"white"}
                />
                <Text style={{color:"white",fontWeight:"600",opacity:0.7,marginTop:10,textAlign:"center"}}>{getUviIndexSunscreen(Math.round(weatherData.uvi))}</Text>
                <View style={{position:"absolute",right:0,top:0,padding:10,borderBottomLeftRadius:8,backgroundColor:"rgba(0,0,0,0.4)"}}>
                    <Text style={{color:"white",fontSize:12,fontWeight:"800",opacity:0.8}}>{getUviIndexSpf(Math.round(weatherData.uvi))}</Text>
                </View>
            </View>
        </View>
    )
}

const stylesTimer = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    timeText: {
      fontSize: 48,
      fontWeight: 'bold',
    },
  });