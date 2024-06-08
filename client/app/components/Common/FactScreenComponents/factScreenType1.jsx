
import { View,Text,Image,StyleSheet,TouchableOpacity } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const FactScreenType_1 = ({
    pageStyle = {},
    imageSource,
    imageStyle,
    title,
    descriptionRows = [],
    buttonAction = {type:"next" | "trigger", actionData:{progress:Number, increment_value:Number} | {triggerAction:() => Object}},
    setProgress
}) => {
    return(
        <View style={[styles.startScreen,{justifyContent:"space-between",height:"90%",marginTop:30},pageStyle]}>
        <View style={{width:"100%",alignItems:"center",marginBottom:50,height:"70%",justifyContent:"space-between"}}>
            <View style={{width:"100%",alignItems:"center"}}>
                <Image 
                    source={imageSource} 
                    style={[{width:230,height:230,borderRadius:"120%",borderWidth:0.5,borderColor:"lightgray",marginTop:0},{imageStyle}]}                                               
                />
                <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:10}}>{title}</Text>
                <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:0}}>+ Dermotologist</Text>
            </View>     
            <View>
                {descriptionRows.map((desc) => (
                    desc.desc()
                ))}                                
            </View> 
        </View>                   
        <TouchableOpacity 
            onPress={() => {
                buttonAction.type == "next" && setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
                buttonAction.type == "trigger" && buttonAction.actionData.triggerAction();
            }}
            style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,position:"absolute",bottom:20}}>
            <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                <MaterialCommunityIcons 
                    name="check-all"
                    size={25}
                    color={"black"}
                />
            </View>         
            <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"700",opacity:0.9,textAlign:"center",justifyContent:"center"}}>Next</Text>
        </TouchableOpacity>
</View>
    )
}



const styles = StyleSheet.create({            
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        marginBottom:0,
        backgroundColor:"white",
        zIndex:-1
    },
})