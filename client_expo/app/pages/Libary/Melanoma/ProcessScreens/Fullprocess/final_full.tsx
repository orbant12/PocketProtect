import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles_shadow } from "../../../../../styles/shadow_styles";

export function FifthScreen({navigation,styles}){

    const doctorImage = Image.resolveAssetSource(require('../../../../../assets/doc.jpg')).uri;

    return(
        <View style={[styles.startScreen,{height:"85%",marginTop:"10%",backgroundColor:"transparent"}]}>
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
                    <View style={[{width:"90%",height:270,borderWidth:3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"},styles_shadow.shadowContainer]}>
                        <MaterialCommunityIcons 
                            name="microscope"
                            size={30}
                            style={{margin:10}}
                        />
                        <Text style={{fontWeight:"800",fontSize:20}}>Analise with AI</Text>                    
                        <View style={{width:"100%",margin:10,backgroundColor:"rgba(0,0,0,0.9)",padding:10,borderRadius:10,marginTop:20}}>                           
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• Get a 90% accurate prediction</Text>
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• AI will predict wheter it finds your mole malignant or benign</Text>
                            <Text style={{fontWeight:"600",color:"white",opacity:0.8}}>• We strive towards 100% transparency about our model so we made it open source which you can find on our github</Text>
                        </View>        
                    </View> 
                    <View style={[{width:"90%",height:280,borderWidth:3,borderRadius:10,marginTop:20,padding:10,alignItems:"center"},styles_shadow.shadowContainer]}>
                        <MaterialCommunityIcons 
                            name="doctor"
                            size={30}
                            style={{margin:10}}
                        />
                        <Text style={{fontWeight:"800",fontSize:20}}>Get Professional Help</Text>                    
                        <View style={{width:"100%",margin:10,backgroundColor:"rgba(0,0,0,0.9)",padding:10,borderRadius:10,marginTop:20}}>                           
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• Let a certified dermotologist look at your mole and make a professional analasis</Text>
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• You'll recive a pdf of the analasis explaining the process in detail</Text>
                            <Text style={{fontWeight:"600",color:"white",opacity:0.8}}>• You will get access to chat with your selected dermotologist</Text>
                        </View>        
                    </View> 

                    <View style={[{width:"90%",height:270,borderWidth:3,borderRadius:10,marginTop:20,padding:10,alignItems:"center",marginBottom:100},styles_shadow.shadowContainer]}>
                        <MaterialCommunityIcons 
                            name="calendar"
                            size={30}
                            style={{margin:10}}
                        />
                        <Text style={{fontWeight:"800",fontSize:20}}>Reminders for new imaging</Text>                    
                        <View style={{width:"100%",margin:10,backgroundColor:"rgba(0,0,0,0.9)",padding:10,borderRadius:10,marginTop:20}}>                           
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• Revaluating each mole's risk</Text>
                            <Text style={{marginBottom:15, fontWeight:"600",color:"white",opacity:0.8}}>• Comparing their growth & change to past images</Text>
                            <Text style={{fontWeight:"600",color:"white",opacity:0.8}}>• You can access and show your dermotologist about each mole's evolution over an endless period of time</Text>
                        </View>        
                    </View>        
                </View>        
            </ScrollView>
            <Pressable onPress={() => {navigation.goBack()}} style={[styles.startButton,{marginBottom:10,position:"absolute",bottom:0}]}>

                    <Text style={{padding:15,fontWeight:"600",color:"white"}}>Finish</Text>
                </Pressable>
        </View>
    )
}