


import { View,Text,Image,StyleSheet,TouchableOpacity ,Pressable} from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const FactScreenType_2 = ({
    pageStyle = {},    
    boxText,
    title,
    descriptionRows,
    buttonAction,
    setProgress

}:{
    pageStyle?: {};
    boxText:string;
    buttonAction: {type:"next", actionData: {progress:number, increment_value:number} } | {type:"trigger",actionData:{triggerAction:() => void}};
    title:string;
    descriptionRows:{
        icon_name:string,
        icon_size:number,
        text:string
    }[];
    setProgress:(progress:number) => void;
}) => {
    return(
        <View style={[styles.startScreen,pageStyle]}>
        <View style={{marginTop:60,alignItems:"center",justifyContent:"space-between",height:"70%"}}>  
            <Text style={{marginBottom:10,fontWeight:"700",fontSize:24,backgroundColor:"white"}}>{title}</Text>
            <View style={{width:"80%",marginTop:50,height:200,justifyContent:"space-between"}}>
                {descriptionRows.map((desc) => (
                    <FactRow 
                        icon_name={desc.icon_name}
                        icon_size={desc.icon_size}
                        text={desc.text}
                    /> 
                ))
                }                             
            </View>

            <View style={{width:"80%",borderRadius:5,backgroundColor:"lightgray",padding:10,marginTop:60,opacity:0.8}}>
                <Text style={{marginLeft:10,fontWeight:"600",fontSize:13,}}>{boxText}</Text>
            </View>
        </View>
            <Pressable 
                onPress={() => {
                    buttonAction.type == "next" && setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
                    buttonAction.type == "trigger" && buttonAction.actionData.triggerAction();
                }}
                style={[styles.startButton,{marginBottom:20}]}
            >
            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
        </Pressable>
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
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"absolute",
        bottom:20
    },
})


const FactRow = ({
    icon_name,
    icon_size,
    text
}) => {
    return(
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
            <MaterialCommunityIcons 
                name={icon_name}
                size={icon_size}
            />
            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white",width:"100%"}}>{text}</Text>
        </View>
    )
}

