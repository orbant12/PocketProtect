import { View, Text, TouchableOpacity,Image } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderContainer } from "../../Common/headerContainer"


export const NavBar_AssistantModal = ({
    scrollRef,
    goBack,
    title,
    id,
    profileUrl,
    bgColor
}) => {
    return(
        HeaderContainer({
            outerBg:"black",
            content:() => 
                <View style={{
                    width:"100%",
                    alignItems:"center",
                    borderWidth:0,
                    padding:10,
                    position:"relative",
                    backgroundColor:"transparent",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    zIndex:5,
                    backgroundColor:bgColor
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
                
                <TouchableOpacity onPress={() => scrollRef.current.scrollTo({x:0,y:720,animated:true})} style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <Image
                        source={{uri: profileUrl}}
                        style={{width:50,height:50,borderWidth:1,borderColor:"white",borderRadius:100}}
                    />
                </TouchableOpacity>
                </View>   
        })
            
    )
}

