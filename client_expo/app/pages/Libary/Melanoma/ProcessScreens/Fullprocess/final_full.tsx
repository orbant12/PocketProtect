import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles_shadow } from "../../../../../styles/shadow_styles";
import { styles } from "../../../../../styles/full_melanoma_styles";

export function FifthScreen({boxDatas,onFinish}){

    const doctorImage = Image.resolveAssetSource(require('../../../../../assets/doc.jpg')).uri;

    return(
        <View style={[styles.startScreen,{height:"90%",marginTop:"0%",backgroundColor:"transparent",paddingBottom:80}]}>
            <ScrollView style={{width:"100%",marginBottom:0,backgroundColor:"transparent"}}>
                <View style={{marginTop:0,alignItems:"center"}}>  
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%"}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>You're all set !</Text>
                        
                        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="information"
                                color={"black"}
                                size={30}
                                style={{width:"10%",opacity:0.6}}
                            />
                            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>Congratulations your birtmarks are being monitored !</Text>
                        </View>
                        
                    </View>
                    <Image 
                        source={{uri:doctorImage}}
                        style={{width:200,height:200,marginTop:0,zIndex:-1}}
                    />
                    <View style={{borderWidth:0.5,width:"100%",borderColor:"lightgray"}} />
                    <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.1)",marginTop:20,borderRadius:10,width:"80%",alignItems:"center"}}> 
                        <Text style={{fontWeight:"700",fontSize:20}}>What's next ?</Text> 
                    </View>
                    {boxDatas.map((data,index) => (
                        <FinishBox 
                            title={data.title}
                            icon_name={data.icon_name}
                            key={index}
                            desc={
                                data.desc
                            }
                        />
                    ))}      
                </View>        
            </ScrollView>
            <Pressable onPress={onFinish} style={[styles.startButton,{marginBottom:10,position:"absolute",bottom:0}]}>

                    <Text style={{padding:15,fontWeight:"600",color:"white"}}>Finish</Text>
                </Pressable>
        </View>
    )
}

const FinishBox = ({
    icon_name,
    title,
    desc
}) => {
    return(
        <View style={[{width:"90%",borderWidth:3,borderRadius:10,marginTop:20,padding:10,alignItems:"center",backgroundColor:"black",borderColor:"rgba(250,250,255,0.7)"},styles_shadow.shadowContainer]}>
        <MaterialCommunityIcons 
            name={icon_name}
            size={30}
            style={{margin:10}}
            color={"white"}
        />
        <Text style={{fontWeight:"800",fontSize:20,color:"white",opacity:0.9}}>{title}</Text>                    
        <View style={{width:"95%",margin:10,backgroundColor:"rgba(250,0,250,0.4)",padding:10,borderRadius:10,marginTop:20,borderWidth:2,borderColor:"magenta",opacity:1}}>                           
            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8,fontSize:13}}>{desc.one}</Text>
            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8,fontSize:13}}>{desc.two}</Text>
            <Text style={{fontWeight:"600",color:"white",opacity:0.8,fontSize:13}}>{desc.three}</Text>
        </View>        
    </View> 
    )
}