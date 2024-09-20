import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles_shadow } from "../../../styles/shadow_styles";
import { AssistantAdvertBox } from "../../LibaryPage/Melanoma/Assistance/assistantAdvert";
import PagerComponent from "../../Common/pagerComponent";
import { ImageLoaderComponent } from "../../Common/imageLoader";


export function Assist_Onboard(){

    const toolImage = Image.resolveAssetSource(require("../../../assets/assist/proTool.png")).uri;
    const chatImage = Image.resolveAssetSource(require("../../../assets/assist/chat.png")).uri;
    const pdfImage = Image.resolveAssetSource(require("../../../assets/assist/pdf.png")).uri;

    return(
        <View style={[styles.startScreen,{height:"90%"}]}>
            <ScrollView contentContainerStyle={{alignItems:"center",paddingBottom:250}} style={{width:"100%",height:"100%"}}>
            <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
                <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Get Professional help by certified dermotologists</Text>
                <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <MaterialCommunityIcons 
                        name="information"
                        color={"black"}
                        size={30}
                        style={{width:"10%",opacity:0.6}}
                    />
                    <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>We have a bunch of quick learning modules about skin cancer and it's signs of appearance</Text>
                </View>
            </View>
                <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:50},styles_shadow.hightShadowContainer]}>
                    <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:15,fontWeight:"700",color:"white",opacity:0.9,width:"90%"}}>Get checked with professional tools by a professional</Text>
                        <MaterialCommunityIcons 
                            name="microscope"
                            color={"white"}
                            size={25}
                        />
                    </View>
                <PagerComponent
                    indicator_position={{backgroundColor:"black",padding:15,display:"none"}}
                    dotColor={"white"}
                    pagerStyle={{height:300,borderWidth:1}}
                    pages={[
                        {pageComponent:() =>
                            <ImageLoaderComponent
                                w={"100%"}
                                h={300}
                                imageStyle={{borderRadius:0}}
                                data={{melanomaPictureUrl:toolImage}}
                            />
                        },
                    ]}
                />
                </View>
                <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:70},styles_shadow.hightShadowContainer]}>
                    <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:15,fontWeight:"800",color:"white",opacity:1}}>Chat with your dermotologist</Text>
                        <MaterialCommunityIcons 
                            name="chat-processing-outline"
                            color={"white"}
                            size={25}
                        />
                    </View>
                    <PagerComponent 
                    indicator_position={{backgroundColor:"black",padding:15,display:"none"}}
                    dotColor={"white"}
                    pagerStyle={{height:300,borderWidth:1}}
                    pages={[
                        {pageComponent:() =>
                            <Image
                                source={{uri: chatImage}}
                                style={{width:"100%",height:300}}
                            />
                        },
                    ]}
                />
                </View>
                <View style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:70},styles_shadow.hightShadowContainer]}>
                    <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:15,fontWeight:"700",color:"white",width:"80%"}}>Get a report pdf file with a detailed analasis</Text>
                        <MaterialCommunityIcons 
                            name="paperclip"
                            color={"white"}
                            size={25}
                        />
                    </View>
                    <PagerComponent 
                    indicator_position={{backgroundColor:"black",padding:15,display:"none"}}
                    dotColor={"white"}
                    pagerStyle={{height:300,borderWidth:1,}}
                    pages={[
                        {pageComponent:() =>
                            <Image
                                source={{uri: pdfImage}}
                                style={{width:"100%",height:300}}
                            />
                        },
                    ]}
                />
                </View>
                <View style={{width:"100%",marginTop:50,alignItems:"center"}}>
                    <AssistantAdvertBox 
                    />
                </View>
            </ScrollView>

        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"flex-end",
        width:"100%",
        backgroundColor:"white",
        height:"100%"
    },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        padding:15,
        position:"absolute",
        top:0,
        borderWidth:0,
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        backgroundColor:"white",
        zIndex:-1,
        justifyContent:"space-between",
        height:"90%",
        marginBottom:"5%"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:2,
        backgroundColor:"black",
    },
    TopSection:{
        marginTop:100
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:1,
        borderRadius:30,
        padding:20,
        backgroundColor:"lightblue"
    },
    genderOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:1,
        borderRadius:30,
        padding:20,
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10,
        opacity:0.3
    },
})