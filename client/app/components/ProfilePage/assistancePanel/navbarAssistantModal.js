import { View, Text, TouchableOpacity } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


export const NavBar_AssistantModal = ({
    scrollRef,
    goBack
}) => {
    return(
            <View style={{
                width:"100%",
                alignItems:"center",
                borderWidth:0,
                padding:10,
                position:"absolute",
                top:0,
                backgroundColor:"transparent",
                flexDirection:"row",
                justifyContent:"space-between",
                position:"absolute",
                top:50,
                zIndex:5
            }}>
            <TouchableOpacity onPress={() => goBack([])}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                <MaterialCommunityIcons 
                    name="arrow-left"
                    size={25}
                    color={"white"}
                    style={{padding:5}}
                />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => scrollRef.current.scrollTo({x:0,y:720,animated:true})} style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                <MaterialCommunityIcons 
                    name="monitor-eye"
                    size={20}
                    color={"white"}
                    style={{padding:9}}
                />
            </TouchableOpacity>
            </View>   
    )
}