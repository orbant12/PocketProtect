import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { ImageLoaderComponent } from "../../slugAnalasis";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles_shadow } from "../../../../../styles/shadow_styles";

export function AlertScreen({
    setProgress,
    progress,
    melanomaMetaData,
    uploadMetaData
}){
    const alertMelanoma  = Image.resolveAssetSource(require('../../../../../assets/skinburn/Melanoma.png')).uri;

    return(
        <View style={{width:"100%"}} >
            <ScrollView style={{marginBottom:50}}>
                <View style={{width:"100%",alignItems:"center",marginTop:"10%",justifyContent:"space-between",height:670}}>
                        <View style={{width:"100%",alignItems:"center"}}>
                        <ImageLoaderComponent 
                            w={250}
                            h={250}
                            data={{melanomaPictureUrl:alertMelanoma}}
                            style={[{borderRadius:200,borderWidth:2,borderColor:"lightgray",marginTop:0},styles_shadow.shadowContainer]}
                            imageStyle={{borderRadius:200}}

                        />
                        <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:50}}>Great ! Now let's build your body's mole map</Text>  
                        <View style={{backgroundColor:"rgba(0,0,0,0.9)",marginTop:20,padding:15,borderRadius:10,opacity:0.95}}>
                            <Text style={{fontWeight:"700",fontSize:12,maxWidth:"95%",textAlign:"justify",opacity:0.9,color:"white",}}>You will mark the location of your mole and upload them to Pocket Protect Cloud. Where our <Text style={{fontWeight:"700",color:"magenta"}}>AI model</Text> and <Text style={{fontWeight:"700",color:"magenta"}}>Professional Dermotologists</Text> can determine wheter your moles are malignant or beningn</Text> 
                        </View>
                        </View>
                            
                            <View style={{width:"100%",flexDirection:"column",alignSelf:"center",alignItems:"center",marginBottom:"10%"}}>
                                <TouchableOpacity onPress={() => {setProgress(progress + 0.1);uploadMetaData(melanomaMetaData)}} style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,marginTop:0}}>
                                    <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                                        <MaterialCommunityIcons 
                                            name="account-arrow-right"
                                            size={25}
                                            color={"black"}
                                        />
                                    </View>         
                                    <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"600",opacity:0.9,textAlign:"center"}}>Ready !</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0.3,backgroundColor:"white",borderRadius:40,marginTop:10}}>
                                    <View style={{backgroundColor:"black",padding:10,borderRadius:30}}>
                                        <MaterialCommunityIcons 
                                            name="account-arrow-right"
                                            size={25}
                                            color={"white"}
                                        />
                                    </View>                             
                                    <Text style={{marginLeft:20,fontSize:15,color:"black",fontWeight:"700",opacity:0.9,textAlign:"center"}}>How the process works ?</Text>
                                </TouchableOpacity>
                            </View>
                </View>
            </ScrollView>
        </View>
    )
}