
import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView,TouchableOpacity } from "react-native"
import React, {useState,useEffect,useRef} from "react";
import { useAuth } from "../../../context/UserAuthContext.jsx";
import Body from "../../../components/BodyParts/index.tsx";
import ProgressBar from 'react-native-progress/Bar';

const AllMelanomaAdd = ({route,navigation}) => {

    const [selectedSide, setSelectedSide] = useState("front");

    const gender = route.params.gender

    const skin_type = route.params.skin_type

    const {currentuser} = useAuth()

    const sessionMemory  = route.params.sessionMemory

    const [completedAreaMarker, setCompletedAreaMarker] = useState([])

    const [bodyProgress, setBodyProgress] = useState(0)


    const completedArea = async (sessionMemory) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)        
        setBodyProgress(response.length / 24)        
    }
    
    useEffect(() => {
        completedArea(sessionMemory);     
        console.log(sessionMemory)   
    }, [sessionMemory,]); 

    return(        
        <View style={styles.startScreen}>
        <View style={{marginTop:20,alignItems:"center"}}>  
            <Text style={{marginBottom:20,fontWeight:"800",fontSize:20}}>Press the body part to monitor:</Text>         
            <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                <Body
                    data={completedAreaMarker}
                    gender={gender}
                    side={selectedSide}
                    scale={1.2}
                    //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                    colors={['#A6FF9B']}
                    onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender:gender, userId: currentuser.uid, sessionMemory:sessionMemory, progress:null,skinColor: skin_type })}
                    zoomOnPress={true}
                />

                    <View style={styles.positionSwitch}>
                        <Pressable onPress={() => setSelectedSide("front")}>
                            <Text style={selectedSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                        </Pressable>
                        <Text>|</Text>
                        <Pressable onPress={() => setSelectedSide("back")}>
                            <Text style={selectedSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                        </Pressable>
                    </View>

                <View style={styles.colorExplain}>
                    <View style={styles.colorExplainRow} >
                    <View style={styles.redDot} />
                        <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Empty</Text>
                    </View>

                    <View style={styles.colorExplainRow}>
                        <View style={styles.greenDot} />
                        <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Complete</Text>
                    </View>
                </View>
        </View>

    </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        width:"100%",
        height:"100%",
        justifyContent:"center"
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        backgroundColor:"white",
        zIndex:-1
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:10,
        backgroundColor:"black"
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10,
        opacity:0.3
    },
    backButton:{
        borderWidth:0,
        alignItems:"center",
        width:"40%",
        borderRadius:20,
    },
    bar: {
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    saveButtonActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
    },
    saveButtonInActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
        opacity:0.5
    },
    uploadButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        marginTop: 30,
        marginBottom:30,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 0,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
    
    },
    OwnSlugAddBtn: {
        width: "80%",
        height: 50,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft:"auto",
        marginRight:"auto",
    },
    MoreSpotButton:{
        backgroundColor:"magenta",
        borderRadius:10,
        marginBottom:20,
        width:250,
        alignItems:"center",
        borderWidth:1
    },
    AllSpotButton:{
        backgroundColor:"white",
        borderRadius:10,
        borderWidth:1,
        width:250,
        alignItems:"center",
        opacity:0.8
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'gray',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#00FF00',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    colorExplain: {
        flexDirection: 'column',
        alignItems: 'left',
        position: 'absolute',
        marginTop: 10,
        top: 200,
        left: 0,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 200,
        left: 0,
    },
    genderOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:0.3,
        borderRadius:10,
        padding:20,
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:2,
        borderRadius:15,
        padding:20,
        backgroundColor:"rgba(0,0,0,0.03)",
        borderColor:"magenta"
    },
    skinTypeOptionButtonA:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderWidth:5,
        borderColor:"magenta",
        borderRadius:15,
        padding:20,
    },
    skinTypeOptionButton:{
        flexDirection:"column",
        width:150,
        alignItems:"center",
        justifyContent:"center",
        height:150,
        borderRadius:30,
        padding:20,
    },
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        width:300,
        height:180,
        borderWidth:1,
        borderRadius:10,
        padding:0,
        shadowColor: '#171717',
        shadowOffset: {width: 4, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    modalYesBtn:{
        padding:5,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:60,
        height:40,
        alignItems:"center",
        marginLeft:30,

    },
    modalNoBtn:{
        padding:5,
        backgroundColor:"white",
        borderRadius:10,
        alignItems:"center",
        borderWidth:1,
        width:60,
        height:40,
        justifyContent:"center",
    },
    modalOverlay:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    selectableBubble:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderWidth:1,
        borderRadius:20,
        marginLeft:20,
        marginRight:20
    },
    selectableBubbleA:{
        height:180,
        width:200,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"center",
        borderRadius:20,
        marginLeft:20,
        marginRight:20,
        borderWidth:2,
        borderColor:"lightblue",
        borderRadius:20,
    },
    progressDot:{
        width:6,
        height:6,
        borderRadius:100,
        backgroundColor:"black",
        position:"absolute",
        bottom:70
    }
})

export default AllMelanomaAdd