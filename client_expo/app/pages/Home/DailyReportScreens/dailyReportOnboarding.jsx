import { View,StyleSheet,Text,Pressable} from "react-native"
import ProgressBar from 'react-native-progress/Bar';
import React,{useState} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import "react-native-gesture-handler"
import { changePersonalData } from '../../../services/server';
import { useAuth } from "../../../context/UserAuthContext";


const DailyReport = ({navigation}) => {

    // <===> Variable <====> 

    const [ progress, setProgress] = useState(0.1)
    const [ dailyData, setDailyData ] = useState({
        energy: 0,
        mood: 0,
        sex_health:0,
    })
    const {currentuser} = useAuth()

    // <===> FUNCTIONS <====> 
    
    const handleFinishOnboarding = async () => {
        const response = await changePersonalData({
            type: "gender",
            toChange: gender,
            userId: currentuser.uid,
        })
        const response2 = await changePersonalData({
            type: "birth_date",
            toChange: birthDate,
            userId: currentuser.uid,
        })
        if (response == true && response2 == true){
            navigation.navigate("Home")
        } else {
            alert("Something went wrong !")
        }
    }

    const handleDataProvided = (type,data) => {
        if(type == "energy"){
            setDailyData({
                ...dailyData,
                energy: data
            })
        } else if (type == "mood"){
            setDailyData({
                ...dailyData,
                mood: data
            })
        } else if (type == "sex_health"){
        setDailyData({
            ...dailyData,
            sex_health: data
        })
    }
    }


     // <===> Child Component <====>  

    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:80,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:23,backgroundColor:"white"}}>Why complete this report ?</Text>
                    <View style={{width:"80%",marginTop:50,height:200,justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="doctor"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white",width:"100%"}}>Designed by medical researchers and doctors</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="magnify-scan"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Most diaseses can be detected by tracking reccourant symtoms daily</Text>
                        </View>

                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="calendar-today"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>We can monitor and keep track of your health and potential reoccuring symptoms</Text>
                        </View>


                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="creation"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Our Ai Model can see your daily reports and use them for more accurate analasis and health advice</Text>
                        </View>                                        
                    </View>

                    <View style={{width:"80%",borderRadius:5,backgroundColor:"lightgray",padding:10,marginTop:60,opacity:0.8}}>
                        <Text style={{marginLeft:10,fontWeight:"600",fontSize:13,}}>Imagine visiting your doctor daily, reporting your health that can be used to make analasis today and can be used in the future</Text>
                    </View>
                </View>
                <Pressable onPress={() => setProgress(0.2)} style={[styles.startButton,{marginBottom:10}]}>
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:80,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>How energetic did you feel today ?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Pressable onPress={() => handleDataProvided("energy",1)} style={dailyData.energy == 1 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Exhausted</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("energy",2)} style={dailyData.energy == 2 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Tired</Text>
                    </Pressable>
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:30}}>
                    <Pressable onPress={() => handleDataProvided("energy",3)} style={dailyData.energy == 3 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Normal</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("energy",4)} style={dailyData.energy== 4 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Energetic</Text>
                    </Pressable>
                </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                    {dailyData.energy != 0 ? 
                        <Pressable onPress={() => setProgress(0.3)} style={styles.startButton}>
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setProgress(0.1)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

    function MoodScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:80,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>How would you describe your mood and overall emotional state?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Pressable onPress={() => handleDataProvided("mood",1)} style={dailyData.mood == 1 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Exhausted</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("mood",2)} style={dailyData.mood  == 2 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Tired</Text>
                    </Pressable>
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:30}}>
                    <Pressable onPress={() => handleDataProvided("mood",3)} style={dailyData.mood == 3 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Normal</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("mood",4)} style={dailyData.mood == 4 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Energetic</Text>
                    </Pressable>
                </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                    {dailyData.mood  != 0 ? 
                        <Pressable onPress={() => setProgress(0.4)} style={styles.startButton}>
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setProgress(0.1)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

    function IntimScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:80,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Have you noticed any changes or issues related to your sexual health?</Text>
                    
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Pressable onPress={() => handleDataProvided("sex_health",1)} style={dailyData.sex_health == 1 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Exhausted</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("sex_health",2)} style={dailyData.sex_health  == 2 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Tired</Text>
                    </Pressable>
                </View>
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginBottom:30}}>
                    <Pressable onPress={() => handleDataProvided("sex_health",3)} style={dailyData.sex_health == 3 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="weight"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Normal</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDataProvided("sex_health",4)} style={dailyData.sex_health == 4 ? styles.genderOptionButtonA : styles.genderOptionButton}>
                        <MaterialCommunityIcons 
                            name="heart"
                            size={20}
                            style={{marginBottom:1}}
                        />
                        <Text style={{fontWeight:"600",fontSize:17}}>Energetic</Text>
                    </Pressable>
                </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                    {dailyData.sex_health  != 0 ? 
                        <Pressable onPress={() => setProgress(0.6)} style={styles.startButton}>
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => setProgress(0.1)} style={{marginBottom:10}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }


    function FinalScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:200,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white",textAlign:"center"}}>Congratulations, let start your protection !</Text>
                    <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:40}}>
                        <View style={{width:70,height:70,borderWidth:1}} />
                        <View style={{width:70,height:70,borderWidth:1}} />
                        <View style={{width:70,height:70,borderWidth:1}} />
                    </View>
                    <Text style={{marginBottom:10,fontSize:12,backgroundColor:"white",textAlign:"center",marginTop:10}}>Currently Avalible Detections - Version 1.0</Text>
               
                </View>
                <View style={{width:"100%",alignItems:"center"}}>
                {gender != "" ? 
                    <Pressable onPress={() => handleFinishOnboarding()} style={styles.startButton}>
                        <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>
                    :
                    <Pressable style={styles.startButtonNA}>
                        <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                    </Pressable>
                }
                    <Pressable onPress={() => setProgress(0.6)} style={{}}>
                        <Text style={{padding:14,fontWeight:"600",color:"black"}}>Back</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {progress == 0.1 ? FirstScreen():null}
            {progress == 0.2 ? SecoundScreen():null}
            {progress == 0.3 ? MoodScreen():null}
            {progress == 0.4 ? IntimScreen():null}
            {progress == 1 ? FinalScreen():null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"space-between",
        width:"100%",
    },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:15,
        position:"absolute",
        top:0,
        backgroundColor:"#CCC3",
        borderWidth:2,
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"white",
        zIndex:-1,
        justifyContent:"space-between",
        height:"100%"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:2,
        backgroundColor:"black"
    },
    TopSection:{
        marginTop:100
    },
    genderOptionButtonA:{
        flexDirection:"column",
        width:140,
        alignItems:"center",
        justifyContent:"center",
        height:140,
        borderWidth:1,
        borderRadius:30,
        padding:20,
        backgroundColor:"lightblue"
    },
    genderOptionButton:{
        flexDirection:"column",
        width:140,
        alignItems:"center",
        justifyContent:"center",
        height:140,
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

export default DailyReport;