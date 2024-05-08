
import { View,Text,StyleSheet,FlatList,ScrollView, Pressable } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddDetection = ({navigation}) => {

    const CancerDetectionData = [
        {   
            id: "melanoma",
            title: "Melanoma Monitoring",
            desc: "Scan all of your birthmark and let us keep you protected 24/7",
            state: "ready"
        },
        {
            title: "Skin Cancer",
            desc: "Coming early 2025 ! - Not Avalible Yet",
            state: "soon"
        }
    ]


    function handleNavigation(id){
        if (id == "melanoma"){
            navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})
        }
    }

    //<==========> Components <===============>

    function CancerSection(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
                <View style={styles.FlatTitleStyle}>
                    <Text style={styles.FlatTitleStyleText}>Cancer Detection</Text>
                </View>
                <View style={styles.FlatlistStyle}>
                    {CancerDetectionData.map((data) => (
                        <DetectionBox item={data} />
                    ))}
                </View>
            </View>
        )
    }

    function DiabetesSection(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
            <View style={styles.FlatTitleStyle}>
                <Text style={styles.FlatTitleStyleText}>Diabetes</Text>
            </View>
            <View style={styles.FlatlistStyle}>
                {CancerDetectionData.map((data) => (
                    <DetectionBox item={data} />
                ))}
            </View>
        </View>
        )
    }

    function BloodSection(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
            <View style={styles.FlatTitleStyle}>
                <Text style={styles.FlatTitleStyleText}>Blood Analasys</Text>
            </View>
            <View style={styles.FlatlistStyle}>
                {CancerDetectionData.map((data) => (
                    <DetectionBox item={data} />
                ))}
            </View>
        </View>
        )
    }

    function DetectionBox({
        item
    }){
        return(
            <Pressable onPress={() => handleNavigation(item.id)} style={item.state == "soon" ? styles.DetBoxSoon : styles.DetBox }>
                <View    style={{padding:10,borderWidth:0,borderRadius:25,backgroundColor:"orange"}}>
                    <MaterialCommunityIcons 
                        size={30}
                        name="heart-pulse"
                        color={"black"}
                    />
                </View>
                <View>
                    <Text style={{marginLeft:10,fontWeight:600}} >{item.title}</Text>
                    <Text style={{marginLeft:10,fontWeight:300,fontSize:10,maxWidth:"90%",marginTop:3}} >{item.desc}</Text>
                </View>
            </Pressable> 
        )
    }

    return(
        <View style={styles.container}>
            <ScrollView style={{width:"100%"}}>
                {CancerSection()}
                {DiabetesSection()}
                {BloodSection()}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        width:"100%",
        paddingTop:50,
        alignItems:"center"
    },
    FlatlistStyle:{
        width:"100%",
        alignItems:"center"
    },
    FlatTitleStyle:{
        width:"100%",
        margin:10
    },
    FlatTitleStyleText:{
        fontWeight:"600",
        fontSize:20,
        margin:5,
        marginTop:20,
        marginLeft:20
    },  
    DetBox:{
        borderWidth:1,
        width:"90%",
        flexDirection:"row",
        alignItems:"center",
        margin:6,
        padding:10,
        borderRadius:10,
        backgroundColor:"lightgray",
        borderColor:"gray"
    },
    DetBoxSoon:{
        opacity:0.6,
        borderWidth:1,
        width:"90%",
        flexDirection:"row",
        alignItems:"center",
        margin:6,
        padding:10,
        borderRadius:10,
        backgroundColor:"lightgray",
        borderColor:"gray"
    }
});

export default AddDetection;