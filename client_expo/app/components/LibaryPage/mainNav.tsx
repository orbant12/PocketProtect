import { Text, View, ScrollView, TouchableOpacity } from "react-native";

export function Horizontal_Navbar({
    isSelected,
    setIsSelected,
    options,
    scrollViewRef,
    style
}:{
    isSelected:string,
    setIsSelected:(arg:"ai_vision" | "blood_work" | "diagnosis" | "soon") => void,
    options:{title:string,value:"ai_vision" | "blood_work" | "diagnosis" | "soon",scroll?:{x:number,y:number,animated:boolean}}[],
    scrollViewRef?:React.RefObject<ScrollView>;
    style:{}
}){
    return(
        <ScrollView horizontal contentContainerStyle={[{alignItems:"center",borderWidth:0,paddingLeft:20,marginTop:0},style]} style={[{flexDirection:"row",backgroundColor:"white",borderWidth:0.3,width:"100%",height:60},{zIndex:100,position:"absolute",bottom:-110}]} showsHorizontalScrollIndicator={false}>
            {options.map((data,index) => (
                <TouchableOpacity key={index} onPress={() => {setIsSelected(data.value);scrollViewRef != undefined && scrollViewRef.current.scrollTo(data.scroll)}} style={isSelected == data.value ? {borderBottomColor:"magenta",borderBottomWidth:2,marginRight:30} : {marginRight:30}}>
                    <Text style={isSelected == data.value ?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:"800",color:"black"}}>{data.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

//p-65
