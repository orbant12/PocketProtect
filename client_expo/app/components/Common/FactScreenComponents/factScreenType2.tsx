


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
        
            <Text style={{marginBottom:10,fontWeight:"700",fontSize:24,backgroundColor:"white"}}>{title}</Text>
            <View style={{width:"80%",height:220,justifyContent:"space-between",marginRight:10}}>
                {descriptionRows.map((desc,index) => (
                    <FactRow 
                        icon_name={desc.icon_name}
                        icon_size={desc.icon_size}
                        text={desc.text}
                        key={index}
                    /> 
                ))
                }                             
            </View>

            <View style={{width:"80%",borderRadius:5,backgroundColor:"rgba(0,0,0,0.1)",padding:12,marginTop:60,opacity:0.8}}>
                <Text style={{marginLeft:0,fontWeight:"600",fontSize:13,opacity:0.9,textAlign:"left"}}>{boxText}</Text>
            </View>
        
        <Pressable 
                onPress={() => {
                    buttonAction.type == "next" && setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
                    buttonAction.type == "trigger" && buttonAction.actionData.triggerAction();
                }}
                style={[styles.startButton,{marginBottom:0}]}
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
        height:"80%",
        marginTop:"10%",
        justifyContent:"space-between",
        marginBottom:"10%",
        backgroundColor:"white",
        zIndex:-1
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"relative"
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

