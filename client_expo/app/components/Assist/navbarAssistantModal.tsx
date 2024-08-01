import { View, Text, TouchableOpacity,Image } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderContainer } from "../Common/headerContainer"


export const NavBar_AssistantModal = ({
    goBack,
    title,
    id,
    right_icon,
    bgColor,
    right_action,
    outerBg,
}:{
    goBack?:(e:[]) => void;
    title:string;
    id?:string;
    right_icon?:{name:string,type:"icon" | "static_image" | "image" | undefined};
    bgColor?:string;
    right_action?:(e:any) => void;
    outerBg?:string;
}) => {
    return(
        HeaderContainer({
            outerBg:outerBg != undefined ? outerBg : "black",
            content:() => 
                <View style={{
                    width:"100%",
                    alignItems:"center",
                    borderWidth:0,
                    padding:10,
                    position:"relative",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    zIndex:5,
                    backgroundColor: bgColor != undefined ? bgColor : "transparent"
                }}>
                <TouchableOpacity onPress={() => goBack([])}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        color={"white"}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
    
                <View style={{alignItems:"center"}}>
                    <Text style={{color:"white",fontWeight:"700",marginBottom:5,fontSize:17}}>{title}</Text>
                    <Text style={{color:"white",opacity:0.3,fontSize:10}}>{id}</Text>
                </View>
                
                <TouchableOpacity onPress={right_action != undefined ? right_action : () => {}} style={{backgroundColor:"rgba(250,0,250,0.5)",borderRadius:10,borderColor:"magenta",borderWidth:2}}>
                    {right_icon.type == "icon" ?
                        <MaterialCommunityIcons
                            name={right_icon.name}
                            size={27}
                            color={"white"}
                            style={{padding:8}}
                        />
                    :
                    <Image
                        source={{uri:right_icon.name}}
                        style={{width:50,height:50,borderWidth:1,borderColor:"white",borderRadius:100}}
                    />
                    }
                </TouchableOpacity>
                </View>   
        })
            
    )
}

