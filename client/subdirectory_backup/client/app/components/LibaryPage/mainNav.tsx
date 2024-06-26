import { Text, View, ScrollView, TouchableOpacity } from "react-native";

export function Horizontal_Navbar({
    isSelected,
    setIsSelected,
    options,
    scrollViewRef,
}:{
    isSelected:string,
    setIsSelected:(arg:"ai_vision" | "blood_work" | "diagnosis" | "soon") => void,
    options:{title:string,value:"ai_vision" | "blood_work" | "diagnosis" | "soon",scroll?:{x:number,y:number,animated:boolean}}[],
    scrollViewRef?:React.RefObject<ScrollView>
}){
    return(
        <ScrollView horizontal style={[{paddingTop:65,paddingLeft:25,flexDirection:"row",backgroundColor:"white",paddingBottom:15,borderWidth:0.3,width:"100%"},{position:"absolute",zIndex:30 }]} showsHorizontalScrollIndicator={false}>
            {options.map((data,index) => (
                <TouchableOpacity key={index} onPress={() => {setIsSelected(data.value);scrollViewRef != undefined && scrollViewRef.current.scrollTo(data.scroll)}} style={isSelected == data.value ? {borderBottomColor:"magenta",borderBottomWidth:2,marginRight:30} : {marginRight:30}}>
                    <Text style={isSelected == data.value ?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:"800",color:"black"}}>{data.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}
