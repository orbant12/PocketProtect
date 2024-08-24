
import { View,Text,Pressable,TouchableOpacity,Image } from "react-native"
import { UviWidget } from "../../Widgets/uviWidget"
import moment from "moment";
import { useWeather } from "../../../context/WeatherContext";
import { WeatherData_Default } from "../../../utils/initialValues";
import { useEffect, useState } from "react";




export function FutureScreen({
    displayCounter,
    thisMonthTasks,
    handleNavigation,
    selectedDate,
}) {
    const date = new Date(selectedDate);
    const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
    const withoutYear = moment(date).format('DD.MM');
    const today = day + " " + withoutYear;

    const {locationPermissionGranted,locationString,weatherData,weatherDataDaily} = useWeather();
    
    const calculateDistanceFromDataAndToday = (selectedDate:Date) => {
        const today = new Date();
        const selected = selectedDate;
        const distance = selected.getTime() - today.getTime();
        const nDistance = Math.floor(distance / (1000 * 60 * 60 * 24));
        return nDistance;
    }

    const [currentForcast,setCurrentForcast] = useState(null);

    useEffect(() => {
        const res = calculateDistanceFromDataAndToday(new Date(selectedDate))
        console.log(res)
        if(res < 8){
            setCurrentForcast(weatherDataDaily[res])
            console.log(weatherDataDaily[res])
        } else {
            setCurrentForcast(null)
            console.log("check")
        }
        
    },[selectedDate])

    

    return(
        <View style={{width:"100%",alignItems:"center"}}>                
            <View style={{width:"90%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",height:90,justifyContent:"center",borderRadius:10}}>
                <Text style={{marginBottom:10,fontWeight:"600",opacity:0.3}}>Forcast for {selectedDate}</Text>
                <Text style={{fontSize:20,fontWeight:"700"}}>
                    {displayCounter}
                </Text>
            </View>
            {currentForcast != null ?
                <UviWidget 
                    weatherData={locationPermissionGranted ? (currentForcast != null ? currentForcast : WeatherData_Default) : false}
                    today={today}
                    location={locationString}
                    isForcast={true}
                />
                :
                <View style={{width:"90%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,marginTop:50,opacity:0.8}}>
                    <Text style={{fontWeight:"700",fontSize:20,marginBottom:10}}>No weather data available</Text>
                    <Text style={{fontWeight:"600",fontSize:15}}>We can only forcast for 8 days max</Text>
                </View>
            }
        </View>
    )
}