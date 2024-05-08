import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { useAuth } from "../../context/UserAuthContext.jsx";
import Body from "../../components/BodyParts/index.tsx";
import { fetchAllMelanomaSpotData,} from '../../server';
import doctorImage from "../../assets/doc.jpg"


const MelanomaFullProcess = ({navigation,route}) => {

    const [progress, setProgress] = useState(0.1)
    const [gender, setGender]= useState("")
    const [completedParts, setCompletedParts] = useState([])
    const {currentuser} = useAuth()
    const [completedAreaMarker, setCompletedAreaMarker] = useState([])
    const [bodyProgress, setBodyProgress] = useState(0)
    const sessionMemory = route.params.sessionMemory


    const completedArea = async (sessionMemory) => {
        setCompletedAreaMarker([])
        const response = sessionMemory.map((data,index) =>{
                return { slug: data.slug, intensity: 0, key: index }
        })
        setCompletedAreaMarker(response)
        setBodyProgress(response.length / 13)
    }
    
    const fetchAllMelanoma = async () => {
        if(currentuser){
            const allMelanomaData = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender
            })
            setCompletedParts(allMelanomaData)
            completedArea(sessionMemory);
        }
    }

    useEffect(() => {
        fetchAllMelanoma()
        completedArea(sessionMemory);
    }, []);



    useEffect(() => {
        completedArea(sessionMemory);
    }, [sessionMemory,]); 


    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>About This Analasis you will need:</Text>
                    <Image 
                        source={doctorImage}
                        style={{width:200,height:200,marginTop:-20,zIndex:-1}}
                    />
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                    <Text>• 15 minutes</Text>
                </View>
                <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
                    <Text style={{padding:10,fontWeight:"600"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }

    function ThirdScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:50,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What body type do you have ?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:50}}>
                        <Pressable onPress={() => setGender("male")} style={gender == "male" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                            <MaterialCommunityIcons 
                                name="weight"
                                size={20}
                                style={{marginBottom:1}}
                            />
                            <Text style={{fontWeight:"600",fontSize:17}}>Male</Text>
                        </Pressable>
                        <Pressable onPress={() => setGender("female")} style={gender == "female" ? styles.genderOptionButtonA : styles.genderOptionButton}>
                            <MaterialCommunityIcons 
                                name="heart"
                                size={20}
                                style={{marginBottom:1}}
                            />
                            <Text style={{fontWeight:"600",fontSize:17}}>Female</Text>
                        </Pressable>
                    </View>
                    {gender != "" ? 
                        <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
                            <Text style={{padding:10,fontWeight:"600"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
            </View>
        )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                    <ProgressBar progress={bodyProgress} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={completedAreaMarker}
                        gender={gender}
                        side={"front"}
                        scale={1.1}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#A6FF9B']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender, userId: currentuser.uid, sessionMemory:sessionMemory })}
                        zoomOnPress={true}
                    />

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
                <Pressable onPress={() => setProgress(progress + 0.1)} style={bodyProgress == 1 ? styles.startButton : {opacity:0.2,borderWidth:1,alignItems:"center",width:"90%",borderRadius:20,marginBottom:10}}>
                    <Text style={{padding:10,fontWeight:"600"}}>Next</Text>
                </Pressable>
            </View>
        )
    }

    return(
        <View style={styles.container}>

            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {progress == 0.1 ? FirstScreen():null}
            {progress == 0.2 ? ThirdScreen():null}
            {progress >= 0.3 ? SecoundScreen():null}

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
        borderRadius:20,
        marginBottom:10
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
        backgroundColor:"lightgray"
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
        marginTop: 10,
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
        top: 140,
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
        borderWidth:1,
        borderRadius:30,
        padding:20,
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
    }
})

export default MelanomaFullProcess