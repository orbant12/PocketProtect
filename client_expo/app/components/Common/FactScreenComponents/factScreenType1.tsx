
import { ReactNode } from "react";
import { View,Text,Image,StyleSheet,TouchableOpacity,ScrollView } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageLoaderComponent } from "../../../pages/Libary/Melanoma/slugAnalasis";
import { styles_shadow } from "../../../styles/shadow_styles";

export const FactScreenType_1 = ({
    pageStyle = {},
    imageSource,
    imageStyle,
    title,
    descriptionRows,
    buttonAction,
    setProgress
}:{
    pageStyle?: {};
    imageSource: string;
    imageStyle?: {};
    title:string;
    descriptionRows:{
        desc:() => ReactNode
    }[];
    buttonAction: 
    | { type: "next"; actionData: { progress: number; increment_value: number } }
    | { type: "trigger"; actionData: { triggerAction: () => void } };
    setProgress:(progress:number) => void;
}) => {
    return(
        <>
        
            <ScrollView contentContainerStyle={{alignItems:"center",width:"100%",justifyContent:"space-between"}} style={{width:"100%",marginTop:70}}>
                <View style={{width:"100%",alignItems:"center",marginBottom:0,height:500,justifyContent:"space-between"}}>
                    <View style={{width:"100%",alignItems:"center",height:300}}>
                        <ImageLoaderComponent 
                            data={{melanomaPictureUrl:imageSource}}
                            w={230}
                            h={230}
                            style={[{borderRadius:100,borderWidth:2,borderColor:"lightgray",marginTop:0},styles_shadow.shadowContainer]}
                            imageStyle={imageStyle}
                        />
                        <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:30}}>{title}</Text>
                        <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:0}}>+ Dermotologist</Text>
                    </View>     
                    <View style={{backgroundColor:"rgba(0,0,0,1)",padding:10,borderRadius:10,opacity:0.9,height:170}}>
                        {descriptionRows.map((desc) => (
                            desc.desc()
                        ))}                                
                    </View> 
                </View>       
                <View style={{width:"40%",position:"absolute",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignSelf:"center",bottom:95}}>
                    <TouchableOpacity style={{width:55,height:55,alignItems:"center",borderWidth:3,borderColor:"white",backgroundColor:"black",borderRadius:100,justifyContent:"center"}}>
                        <MaterialCommunityIcons 
                            name="data-matrix-scan"
                            size={25}
                            color={"white"}
                        />
                    </TouchableOpacity >
                    <TouchableOpacity  style={{width:55,height:55,alignItems:"center",borderWidth:3,borderColor:"white",backgroundColor:"black",borderRadius:100,justifyContent:"center"}}>
                        <MaterialCommunityIcons 
                            name="microscope"
                            size={25}
                            color={"white"}
                        />
                    </TouchableOpacity >
                </View>            
                <TouchableOpacity 
                    onPress={() => {
                        buttonAction.type == "next" && setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
                        buttonAction.type == "trigger" && buttonAction.actionData.triggerAction();
                    }}
                    style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,position:"relative",marginTop:80,height:55,marginBottom:30}}>
                    <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                        <MaterialCommunityIcons 
                            name="check-all"
                            size={25}
                            color={"black"}
                        />
                    </View>         
                    <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"700",opacity:0.9,textAlign:"center",justifyContent:"center"}}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        
        </>
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