import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../../styles/home_style"
import { styles_shadow } from "../../styles/shadow_styles"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { WeatherSortedResponse } from "../../utils/types"
import { useEffect, useState } from "react"
import { getUvIndexCategory } from "../../utils/uvi/uvIndexEval"
import { getUviIndexSpf } from "../../utils/uvi/uviIndexSpf"
import { getUviIndexExposure } from "../../utils/uvi/uviIndexExposure"
import { getUviIndexSunscreen } from "../../utils/uvi/uviIndexSunscreen"
import { useWeather } from "../../context/WeatherContext"




export const WeatherWidget = ({ weatherData,today,location }:{weatherData:WeatherSortedResponse | false, today:string,location:string}) => {

    const uviCategory = weatherData != false && getUvIndexCategory(Math.round(weatherData.uvi))
    const { LocationAccessAsk } = useWeather();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTime(new Date());
        }, 1000);
    
        return () => clearInterval(intervalId); // Cleanup interval on unmount
      }, []);
    
    
      const plusTwoHoursFrom = (date) => {
        const hours = (date.getHours() + 2).toString().padStart(2, '0');
        return `${hours}:00`;
      }
    
      const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };
    

    return(
        <>
        {weatherData != false ?
            <View style={[styles.TodaySection,styles_shadow.hightShadowContainer]}>
                <View style={[styles.titleRow,{alignItems:"baseline"}]}>
                    <Text style={styles.title}>Weather Data</Text>
                    <View style={[styles.titleLeft,{alignItems:"flex-end",opacity:0.8}]}>
                        <Text style={{color:"white",marginBottom:10,fontSize:23,fontWeight:"800"}}>{formatTime(time)}</Text>
                        <Text style={{color:"white",fontSize:13}}>{today}</Text>
                    </View>
                </View>
                <View style={{width:"85%",flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",alignSelf:"flex-end",marginRight:10}}>
                    <Text style={{color:"white",fontWeight:"100",fontSize:60,marginTop:-15}}>{weatherData.temp.max}<Text style={{fontSize:15,fontWeight:"600"}}> C•</Text> </Text>
                    <Text style={{color:"white",fontWeight:"300",fontSize:18,opacity:0.6}}>{location}</Text>
                </View>
                <View style={{width:"90%",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5,marginTop:30,padding:20}}>
                    <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row",alignSelf:"center",alignItems:"center"}}>
                        <Text style={{color:"white",fontSize:17,fontWeight:"700",opacity:0.8}}>Level: </Text>
                        <Text style={{color:"white",fontSize:17}}>{getUvIndexCategory(Math.round(weatherData.uvi))}</Text>
                    </View>
                    <View style={{width:"100%",borderColor:"magenta",marginVertical:20,borderWidth:1.5,opacity:0.2,borderRadius:100}} />
                    <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                        <View style={[{width:20,height:20,backgroundColor:"rgba(255,255,255,0.2)",borderRadius:100},uviCategory == "Low" && {borderColor:"magenta",borderWidth:2,borderRadius:3,backgroundColor:"rgba(250,0,250,0.5)"}]} />
                        <View style={[{width:20,height:20,backgroundColor:"rgba(255,255,255,0.4)",borderRadius:100},uviCategory == "Moderate" && {borderColor:"magenta",borderWidth:2,borderRadius:3,backgroundColor:"rgba(250,0,250,0.5)"}]} />
                        <View style={[{width:20,height:20,backgroundColor:"rgba(255,255,255,0.6)",borderRadius:100},uviCategory == "Hight" && {borderColor:"magenta",borderWidth:2,borderRadius:3,backgroundColor:"rgba(250,0,250,0.5)"}]} />
                        <View style={[{width:20,height:20,backgroundColor:"rgba(255,255,255,0.8)",borderRadius:100},uviCategory == "Very High" && {borderColor:"magenta",borderWidth:2,borderRadius:3,backgroundColor:"rgba(250,0,250,0.5)"}]} />
                        <View style={[{width:20,height:20,backgroundColor:"rgba(255,255,255,1)",borderRadius:100},uviCategory == "Extreme" && {borderColor:"magenta",borderWidth:2,borderRadius:3,backgroundColor:"rgba(250,0,250,0.5)"}]} />
                    </View>
                </View>
                <View style={{width:"90%",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(250,0,250,0.3)",borderWidth:2,borderColor:"magenta",borderRadius:5,marginTop:30,padding:20}}>
                    <View style={{width:"90%",justifyContent:"space-between",flexDirection:"row",alignSelf:"center",alignItems:"center"}}>
                        <Text style={{color:"white",fontSize:17,fontWeight:"700",opacity:0.8}}>Sun Protection: </Text>
                        <Text style={{color:"white",fontSize:17}}>{getUviIndexSpf(Math.round(weatherData.uvi))}</Text>
                    </View>
                </View>
      
            </View>
            :
            <View style={[styles.TodaySection,styles_shadow.hightShadowContainer]}>
            <View style={[styles.titleRow,{alignItems:"baseline"}]}>
                <Text style={styles.title}>UV Index & Skin Cancer</Text>
                <View style={[styles.titleLeft,{alignItems:"flex-end",opacity:0.8}]}>
                    <Text style={{color:"white",marginBottom:10,fontSize:23,fontWeight:"800"}}>{formatTime(time)}</Text>
                    <Text style={{color:"white",fontSize:13}}>{today}</Text>
                </View>
            </View>
                <TouchableOpacity onPress={() => LocationAccessAsk()} style={{width:"90%",backgroundColor:"rgba(250,0,250,0.4)",borderWidth:2,borderColor:"magenta",alignSelf:"center",marginTop:20,padding:15,alignItems:"center",borderRadius:10,flexDirection:"row",justifyContent:"center"}}>
                    <MaterialCommunityIcons 
                        name="lock-question"
                        size={22}
                        style={{opacity:0.8}}
                        color={"white"}
                    />
                    <Text style={{color:"white",fontSize:17,fontWeight:"600",opacity:0.8,marginTop:0,marginLeft:10}}>Grant Location Access</Text>
                </TouchableOpacity>
            </View>
        }
        </>
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