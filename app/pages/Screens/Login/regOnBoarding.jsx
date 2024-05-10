import { View,StyleSheet,Text,Pressable,Image } from "react-native"
import ProgressBar from 'react-native-progress/Bar';
import React,{useState,useEffect} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Onboarding from 'react-native-onboarding-swiper';
import "react-native-gesture-handler"

const RegOnBoarding = () => {

    // <===> Variable <====> 

    const [ progress, setProgress] = useState(0.2)
    const [gender, setGender ] = useState("")


     // <===> Child Component <====> 

    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={styles.TopSection}>
                    <Text>Hello</Text>
                </View>
                <Pressable onPress={() => setProgress(progress + 0.2)} style={styles.startButton}>
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }

    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:80,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What gender are you ?</Text>
                    
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
                        <Pressable onPress={() => setProgress(0.6)} style={styles.startButton}>
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.startButtonNA}>
                            <Text style={{padding:10,fontWeight:"600"}}>Not Selected Yet</Text>
                        </Pressable>
                    }
            </View>
        )
    }

    function ThirdScreen(){

        function TutorialFirst(){
            return(
                <View style={{marginTop:210}}>
                <Text>Valami</Text>
            </View>
            )
        }

        function TutorialSecound(){
            return(
                <View style={{marginTop:210}}>
                <Text>Valami</Text>
            </View>
            )
        }

        return(
            <View style={{width:"100%",height:"100%",zIndex:-1}}>
                <Onboarding
                    onDone={() => alert("Done")}
                    pages={[
                    // 1.) UPLOAD PODCAST
                    {
                    backgroundColor: '#18191a',
                    image: <Image source={{uri: "https://picsum.photos/200/300"}} />,
                    title: 
                        TutorialFirst()
                    },
                             // 1.) UPLOAD PODCAST
                    {
                        backgroundColor: 'black',
                        image: <Image source={{uri: "https://picsum.photos/200/300"}} />,
                        title: 
                            TutorialSecound()
                    },
                ]}
                />
            </View>
    )}

    return(
        <View style={styles.container}>
            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {progress == 0.2 ? FirstScreen():null}
            {progress == 0.4 ? SecoundScreen():null}
            {progress == 0.6 ? ThirdScreen():null}
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
        marginBottom:10,
        backgroundColor:"black"
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

export default RegOnBoarding;