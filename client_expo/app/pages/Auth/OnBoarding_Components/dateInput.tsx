import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { DateToString } from "../../../utils/date_manipulations";
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from "../../../styles/onBoard_styles";

export function DateInputPage({
    setProgress,
    progress,
    date,
    title,
    setBirthDate,
    pageStyle
}:{
    setProgress: any,
    progress: any,
    date: any,
    title: string,
    setBirthDate: any,
    pageStyle?: any
}){
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;        
        setBirthDate(currentDate);
      };

    return(
        <View style={[styles.startScreen,pageStyle]}>
            <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10}}>  
                <Text style={{fontSize:10,textAlign:"left",alignSelf:"flex-start",opacity:0.3,borderBottomWidth:1,fontWeight:"700"}}>DD/M/YYYY</Text>
                <Text style={{marginBottom:0,fontWeight:"700",fontSize:23}}>{title}</Text>
            </View>
            <View style={{width:"100%",alignItems:"center"}}>
                <View style={{borderWidth:3,borderColor:"magenta",backgroundColor:"rgba(0,0,0,1)",borderRadius:5,marginBottom:30}}>
                    {!(DateToString(date) == "2036-06-26") ? <Text style={{padding:10,color:"white",fontSize:18,fontWeight:"700"}}>{DateToString(date)}</Text> : <Text style={{padding:10,color:"white",fontSize:18,fontWeight:"700"}}>Empty</Text>}
                </View>
                <DateTimePicker display="spinner"  onChange={onDateChange} value={date} mode="date" style={{marginTop:0}} />
            </View>
            <Pressable onPress={() => setProgress(progress + 0.2)} style={[styles.startButton,{marginBottom:0}]}>
                <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
            </Pressable>
        </View>
    )
}