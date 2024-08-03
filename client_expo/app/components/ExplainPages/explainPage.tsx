import {  View,StyleSheet, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PagerComponent } from "../Common/pagerComponent";
import { styles_shadow } from "../../styles/shadow_styles";
import { HeaderContainer } from "../Common/headerContainer";
import ProgressBar from 'react-native-progress/Bar';
import { ImageLoaderComponent } from "../../pages/Libary/Melanoma/slugAnalasis";

const toolImage = Image.resolveAssetSource(require("../../assets/assist/proTool.png")).uri;
const chatImage = Image.resolveAssetSource(require("../../assets/assist/chat.png")).uri;
const pdfImage = Image.resolveAssetSource(require("../../assets/assist/pdf.png")).uri;

export const ExplainPageComponent_Type1 = ({
    style,
    containerStyle,
    noTitle,
    data
}:{
    style?:any;
    containerStyle?:any;
    noTitle:boolean;
    data: {imageUri:string,textComponent:() => JSX.Element}[];
}) => {
    return(
        <View style={[styles.startScreen,{height:"90%"},style]}>
        {
            noTitle == false && (
            <View style={{alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
                    <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Skin Cancer Monitoring</Text>
                    <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <MaterialCommunityIcons 
                            name="information"
                            color={"black"}
                            size={30}
                            style={{width:"10%",opacity:0.6}}
                        />
                        <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>Take your time to explore the app and it's features ...</Text>
                    </View>
            </View>
       )}
        <View style={[{width:"100%",height:"80%",alignItems:"center",zIndex:-1},containerStyle]}>
            <PagerComponent 
                indicator_position={{backgroundColor:"rgba(0,0,0,0.9)",padding:15,marginTop:-10,borderRadius:10,borderTopLeftRadius:30,borderTopRightRadius:30}}
                dotColor={"white"}
                pagerStyle={[{height:320,borderWidth:0,width:"90%"},styles_shadow.shadowContainer]}
                pages={data.map((item, index) => ({
                    pageComponent: () =>
                        <View key={index} style={{ height: 300, width: "100%", alignItems: "center" }}>
                            <Image
                                source={{ uri: item.imageUri }}
                                style={{ width: 200, height: 200, objectFit: "contain" }}
                            />
                            <View style={{ width: "95%", backgroundColor: "rgba(0,0,0,1)", padding: 7, paddingVertical: 18, borderRadius: 5, marginTop: 15, alignSelf: "center", maxHeight: "30%", marginBottom: 30, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                {item.textComponent()}
                            </View>
                        </View>
                }))}
            />
        </View>
        </View>
    )
};

export const ExplainPageComponent_Type2 = ({data,title,desc} : {
    data:{icon_name:string,title:string,images:{image:string}[]}[];
    title:string;
    desc?:string;
}) => {
    return(
        <View style={[styles.startScreen,{height:"100%",marginTop:10}]}>
        <ScrollView contentContainerStyle={{alignItems:"center",paddingBottom:100}} style={{width:"100%",height:"100%"}}>
        <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%",marginBottom:10}}>  
            <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>{title}</Text>
            {desc != undefined && (
            <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <MaterialCommunityIcons 
                    name="information"
                    color={"black"}
                    size={30}
                    style={{width:"10%",opacity:0.6}}
                />
                <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>{desc}</Text>
            </View>
            )}
        </View>
            {data.map((item, index) => (
                <View key={index} style={[{width:"80%",borderWidth:0.3,height:350,borderRadius:10,marginTop:50},styles_shadow.hightShadowContainer,item.images.length == 1 ? {marginTop:80} : {}]}>
                    <View style={{width:"100%",borderWidth:2,height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"rgba(0,0,0,0.9)",paddingHorizontal:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:15,fontWeight:"700",color:"white",opacity:0.9,width:"90%"}}>{item.title}</Text>
                        <MaterialCommunityIcons 
                            name={item.icon_name}
                            color={"white"}
                            size={25}
                        />
                    </View>
                <PagerComponent 
                    indicator_position={[{backgroundColor:"black",padding:15},item.images.length == 1 ? {display:"none"} : {}]}
                    dotColor={"white"}
                    pagerStyle={[{height:300,borderWidth:1}]}
                    pages={item.images.map((image, index) => ({
                        pageComponent:() => (
                            <ImageLoaderComponent
                                w={"100%"}
                                h={300}
                                imageStyle={{borderRadius:0}}
                                
                                data={{melanomaPictureUrl:image.image}}
                            />
                        )}
                    ))}
                        
                />
                </View>
            ))}
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
        width:"95%",
        alignItems:"center",
        position:"relative",
        flexDirection:"row",
        justifyContent:"space-between",
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


export const ProgressRow = ({
    handleBack,
    progress}
) => {
    return(
        <>
        {
            HeaderContainer({
                content:() => (
                    <>
                    <View style={styles.ProgressBar}>
                        <TouchableOpacity onPress={handleBack} style={{backgroundColor:"#eee",borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="arrow-left"
                                size={20}
                                style={{padding:6}}
                            />
                        </TouchableOpacity>

                        <ProgressBar progress={progress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                        <TouchableOpacity onPress={() => handleBack(true)} style={{backgroundColor:"#eee",borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="close"
                                size={20}
                                style={{padding:6}}
                            />
                        </TouchableOpacity>
                    </View>
                    </>
                ),
                outerBg:"white",

            })
        }

    </>
    )
}