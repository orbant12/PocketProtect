import { View,TouchableOpacity,Text } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


export const NavBar_TwoOption = ({title,icon_right,icon_left}) => {
    return(
        <View style={{width:"95%",padding:0,marginTop:50,flexDirection:"row",backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"black",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity  onPress={icon_left.action != undefined ? icon_left.action :  () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:3,borderColor:"white",borderTopRightRadius:0,borderBottomRightRadius:0}}>
            <MaterialCommunityIcons 
                name={icon_left.name}
                size={icon_left.size}
                color={"white"}
            />
        </TouchableOpacity>
        <Text style={{color:"white",fontWeight:"800",fontSize:16}}>{title}</Text>
        <TouchableOpacity onPress={icon_right.action != undefined ? icon_right.action : () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:3,borderColor:"white",borderTopLeftRadius:0,borderBottomLeftRadius:0}}>
            <MaterialCommunityIcons  
                name={icon_right.name}
                size={icon_right.size}
                color={"white"}
            />
        </TouchableOpacity>

    </View>
    )
}

export const NavBar_OneOption = ({title,icon_left}) => {
    return(
        <View style={{width:"95%",padding:0,marginTop:50,flexDirection:"row",backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"black",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity  onPress={icon_left.action != undefined ? icon_left.action :  () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:3,borderColor:"white",borderTopRightRadius:0,borderBottomRightRadius:0}}>
            <MaterialCommunityIcons 
                name={icon_left.name}
                size={icon_left.size}
                color={"white"}
            />
        </TouchableOpacity>
        <Text style={{color:"white",fontWeight:"800",fontSize:16}}>{title}</Text>
        <View />
    </View>
    )
}