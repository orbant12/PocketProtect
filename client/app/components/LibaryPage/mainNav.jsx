import { Text, View, ScrollView, TouchableOpacity } from "react-native";

export function Navbar({
    scrollViewRef,
    isSelected,
    setIsSelected
}){
    return(
        <ScrollView horizontal style={{position:"absolute",paddingTop:60,paddingLeft:40,marginRight:"auto",flexDirection:"row",zIndex:5,backgroundColor:"white",paddingBottom:15 ,borderWidth:0.3}} showsHorizontalScrollIndicator="false">
            <TouchableOpacity onPress={() => {setIsSelected("ai_vision"), scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });}} style={isSelected == "ai_vision" ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                <Text style={isSelected == "ai_vision"?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:800,color:"black"}}>AI Vision</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setIsSelected("blood_work");scrollViewRef.current.scrollTo({ x: 0, y: 650, animated: true });}} style={isSelected == "blood_work" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30} : {marginLeft:30}}>
                <Text style={isSelected == "blood_work" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Blood Analasis</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("diagnosis")} style={isSelected == "diagnosis" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30,} : {marginLeft:30}}>
                <Text style={isSelected == "diagnosis" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Custom Diagnosis</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("soon")} style={isSelected == "soon" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30,marginRight:70} : {marginLeft:30,marginRight:70}}>
                <Text style={isSelected == "soon" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Coming Soon</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
