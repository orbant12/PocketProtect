import {  View,StyleSheet, Text, Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PagerComponent } from "../Common/pagerComponent";
import { styles_shadow } from "../../styles/shadow_styles";

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