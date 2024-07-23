import { View,TouchableOpacity,Text } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderContainer } from "./headerContainer"
import { ReactNode } from "react";


export const NavBar_TwoOption = ({title,icon_right,icon_left,titleComponent,style,icon_left_component,outerBg}:{icon_left_component?:() => ReactNode,style?:{},title?:string;icon_right:{name:string,size?:number,action?:() => void};icon_left?:{name:string,size?:number,action?:() => void};titleComponent?:() => ReactNode; outerBg?:string}) => {
    return(
    HeaderContainer({
        outerBg:outerBg != undefined ? outerBg : "transparent",
    content:() =>
        <View style={[{width:"95%",padding:5,marginTop:10,flexDirection:"row",backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"black",justifyContent:"space-between",alignItems:"center",alignSelf:"center"},style]}>
        {icon_left_component != undefined ? 
        
            icon_left_component()
    
        :   
        <TouchableOpacity  onPress={icon_left.action != undefined ? icon_left.action :  () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"white",borderTopRightRadius:0,borderBottomRightRadius:0,borderRightWidth:1,alignItems:"center",width:50}}>
            <MaterialCommunityIcons 
                name={icon_left.name}
                size={icon_left.size}
                color={"white"}
            />
        </TouchableOpacity>
        }
        {title != null ? 
            <Text lineBreakMode="tail" numberOfLines={1} style={{color:"white",fontWeight:"800",fontSize:16, maxWidth:"60%",flexWrap:"nowrap"}}>{title}</Text>
            :
            titleComponent()
        }
        
        <TouchableOpacity onPress={icon_right.action != undefined ? icon_right.action : () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"white",borderTopLeftRadius:0,borderBottomLeftRadius:0,width:50,borderLeftWidth:1,alignItems:"center"}}>
            <MaterialCommunityIcons  
                name={icon_right.name}
                size={icon_right.size}
                color={"white"}
            />
        </TouchableOpacity>

        </View>
    })
    )
}

export const NavBar_OneOption = ({title,icon_left,styles={},outerBg}:{
    title:string;
    icon_left:{name:string,size:number,action:() => void};
    styles?:{};
    outerBg?:string;

}) => {
    return(
    HeaderContainer({
        outerBg:outerBg != undefined ? outerBg : "transparent",
        content:() =>
            <View style={[{width:"95%",padding:5,marginTop:0,flexDirection:"row",backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"black",justifyContent:"space-between",alignItems:"center",alignSelf:"center"},styles]}>
            <TouchableOpacity  onPress={icon_left.action != undefined ? icon_left.action :  () => {}} style={{padding:8,backgroundColor:"black",borderRadius:10,borderWidth:0,borderColor:"white",borderTopRightRadius:0,borderBottomRightRadius:0,width:50,alignItems:"center",borderRightWidth:2}}>
                <MaterialCommunityIcons 
                    name={icon_left.name}
                    size={icon_left.size}
                    color={"white"}
                />
            </TouchableOpacity>
            <Text style={{color:"white",fontWeight:"800",fontSize:16}}>{title}</Text>
            <View />
            </View>
        })
    )
}