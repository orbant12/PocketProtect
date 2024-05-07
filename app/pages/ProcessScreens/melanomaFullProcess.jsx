import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState,useEffect,useRef} from "react";
import ProgressBar from 'react-native-progress/Bar';
import { useAuth } from "../../context/UserAuthContext.jsx";
import Body from "react-native-body-highlighter";
import { fetchAllMelanomaSpotData, fetchUserData } from '../../server';

const MelanomaFullProcess = ({navigation}) => {

    const [progress, setProgress] = useState(0.1)
    const [gender, setGender]= useState("female")
    const [ affectedSlugs,setAffectedSlugs ] = useState([])
    const [completedParts, setCompletedParts ] = useState([])
    const {currentuser} = useAuth()
    

    useEffect(() => {
        if(currentuser){
            const allMelanomaData = fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender
            })
            setCompletedParts(allMelanomaData)
            console.log(allMelanomaData)
        }
    }, []);

    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>About This Analasis you will need:</Text>
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

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20}}>Press the body part to monitor:</Text>
                    <ProgressBar progress={progress - 1} width={150} height={10} color={"lightgreen"}backgroundColor={"white"} />
                    <Body
                        data={affectedSlugs}
                        gender={gender}
                        side={"front"}
                        scale={1.1}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#FF0000', '#A6FF9B','#FFA8A8']}
                        onBodyPartPress={(slug) => navigation.navigate("MelanomaProcessSingleSlug", { data: slug, gender: gender })}
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
                <Pressable onPress={() => setProgress(progress + 0.1)} style={styles.startButton}>
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
            {progress == 0.1 ? 
            FirstScreen()
            :
            progress == 0.2 ? 
            SecoundScreen()
            :
            null
            }
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
        justifyContent:"space-between"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10
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
})

export default MelanomaFullProcess