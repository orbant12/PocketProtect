import LottieView from "lottie-react-native";
import { Modal, Text, TouchableOpacity, View,Image } from "react-native";
import React, { useRef, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles_shadow } from "../../../styles/shadow_styles";
import { SpotData } from "../../../utils/types";
import { Navigation_AssistCenter } from "../../../navigation/navigation";

export const DiagnosisProcessModal = ({
    loading,
    setLoading,
    imageSource,
    selectedMelanoma,
    navigation
}:{
    loading:"first_loaded" | "repeat_loaded" | null | "loading" ;
    setLoading:(loading:"loading" | null | "first_loaded" | "repeat_loaded") => void;
    imageSource:string;
    selectedMelanoma:SpotData;
    navigation:any;
}) => {

    const animationLoad = useRef(null);
    const animationSucc = useRef(null);
    const animationFailed = useRef(null);
    
    useEffect(() => {
        if ((loading == "first_loaded" || loading == "repeat_loaded") && animationSucc.current) {
            animationSucc.current.play();
        } else if (loading != "first_loaded" && loading != "repeat_loaded" && loading != "loading" && loading != null && animationSucc.current) {
            animationFailed.current.reset();
        }
    }, [loading]);

    const repeatTillVisible = () => {
        setTimeout(() => {
            if (loading == "loading" && animationLoad.current) {
                animationLoad.current.reset();
                animationLoad.current.play();
                repeatTillVisible();
            }
        }, 5000);
    };

    useEffect(() => {
        if (loading == "loading" && animationLoad.current) {
            animationLoad.current.play();
            repeatTillVisible();
        }
    }, [loading]);

    if (loading == "loading" && animationLoad.current) {
        animationLoad.current.play();
        repeatTillVisible();
    }



    return(
        <Modal visible={loading != null} animationType="fade" transparent >
            <View style={{width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.93)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"absolute"}}>
            <View style={[loading === "first_loaded" || loading == "repeat_loaded" ? {width:300,height:430,justifyContent:"space-between",padding:10} : loading === "loading" ? {width:300,height:430,justifyContent:"space-between",padding:10} : {width:300,height:420,justifyContent:"space-between",padding:10},{backgroundColor:"white",display:"flex",flexDirection:"column",alignItems:"center",borderRadius:10},styles_shadow.hightShadowContainer]}>
            {!(loading == "loading") ? (
            <>
            {(selectedMelanoma != null) && (
                loading == "first_loaded" ? (
                    !(selectedMelanoma.risk >= 0.5) ? (
                        <>
                            <LottieView
                                autoPlay
                                ref={animationSucc}
                                style={{
                                    width: 130,
                                    height:130,
                                    backgroundColor: 'transparent',
                                }}
                                source={require('./lotties/DoneAnimation.json')}
                            />
                            <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"80%"}}>DONE</Text>
                            <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0.3,marginTop:10,borderRadius:100}}>
                                <Text> Close </Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <>
                            <LottieView
                                autoPlay
                                ref={animationSucc}
                                style={{
                                    width: 130,
                                    height:130,
                                    backgroundColor: 'transparent',
                                }}
                                source={require('./lotties/Warning.json')}
                            />
                            <View style={{alignItems:"center", width:"100%",padding:10, backgroundColor:"rgba(0,0,0,0.1)", borderRadius:5}}>
                                <Text style={{fontWeight:"600",fontSize:20,textAlign:"center",width:"100%"}}>WARNING</Text>
                                <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"100%",marginTop:3}}>This mole seems very suspicous</Text>
                            </View>
                            <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"80%",marginVertical:20}}>Prediction: {selectedMelanoma.risk}</Text>
                            <TouchableOpacity onPress={() => setLoading("repeat_loaded")} style={{padding:10,width:"80%",alignItems:"center",borderWidth:2,marginTop:10,borderRadius:100,borderColor:"black", backgroundColor:"#f0c44a"}}>
                                <Text style={{fontWeight:"800"}}> WARNING Repeat </Text>
                                <Text style={{position:"absolute",fontSize:11,top:-19,opacity:0.4,fontWeight:"800"}}> Very recommended </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0,marginTop:0,borderRadius:100}}>
                                <Text style={{fontWeight:"700",opacity:0.6}}> Accept </Text>
                            </TouchableOpacity>
                        </>
                    ) 
                ):(
                    !(selectedMelanoma.risk >= 0.5) ? (
                        <>
                            <LottieView
                                autoPlay
                                speed={0.9}
                                ref={animationSucc}
                                style={{
                                    width: 170,
                                    height:170,
                                    backgroundColor: 'transparent',
                                }}
                                source={require('./lotties/succ.json')}
                            />
                            <View style={{alignItems:"center", width:"100%",padding:10, backgroundColor:"rgba(0,0,0,0.1)", borderRadius:5}}>
                                <Text style={{fontWeight:"600",fontSize:20,textAlign:"center",width:"100%"}}>Seem's perfect !</Text>
                                <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"100%",marginTop:3}}>Your mole appears to be within the ABCDE guidelines ...</Text>
                            </View>
                            <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"80%",marginVertical:20}}>Prediction: {selectedMelanoma.risk}</Text>
                            <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:2,marginTop:10,borderRadius:100,borderColor:"black", backgroundColor:"rgba(0,255,0,0.3)"}}>
                                <Text style={{fontWeight:"800"}}> Done </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLoading("repeat_loaded")} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0,marginTop:0,borderRadius:100}}>
                                <Text style={{fontWeight:"700",opacity:0.6}}> Try again </Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <>
                            <LottieView
                                autoPlay
                                ref={animationSucc}
                                style={{
                                    width: 110,
                                    height:110,
                                    backgroundColor: 'transparent',
                                }}
                                source={require('./lotties/alert.json')}
                            />
                            <View style={{alignItems:"center", width:"100%",padding:10, backgroundColor:"rgba(0,0,0,0.1)", borderRadius:5}}>
                                <Text style={{fontWeight:"600",fontSize:20,textAlign:"center",width:"100%"}}>Malignant ALERT</Text>
                                <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"100%",marginTop:5}}>This mole seem's to be malignant as it violates the ABCDE guidelines</Text>
                            </View>
                            <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"80%",marginVertical:20}}>Prediction: {selectedMelanoma.risk}</Text>
                            <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:2,marginTop:10,borderRadius:100,borderColor:"black", backgroundColor:"rgba(250,0,0,0.4)"}}>
                                <Text style={{fontWeight:"800"}}> Done </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLoading("repeat_loaded")} style={{padding:10,width:"80%",alignItems:"center",borderWidth:2,marginTop:10,borderRadius:100,borderColor:"black", backgroundColor:"rgba(250,0,0,0)"}}>
                                <Text style={{fontWeight:"800"}}> Try Again </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setLoading(null); Navigation_AssistCenter({navigation})}} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0,marginTop:0,borderRadius:100}}>
                                <Text style={{fontWeight:"700",opacity:0.6}}> Seek Professional Help </Text>
                            </TouchableOpacity>
                        </>
                    ) 
                )
                )}
            </>
            ) : (
                <>
                <Image 
                    source={{uri:imageSource}}
                    style={{width:130,height:130,position:"absolute",top:60,backgroundColor:"transparent",borderRadius:2}}
                />
                <LottieView
                    autoPlay
                    loop
                    ref={animationLoad}
                    style={{
                    width: 230,
                    height: 230,
                    backgroundColor: 'transparent',
                    }}
                    source={require('./lotties/scan.json')}
                />
                <View style={{width:"100%",alignSelf:"center",alignItems:"center",paddingBottom:50}}>
                    <Text style={{fontWeight:"700",fontSize:17,textAlign:"center",width:"90%",marginBottom:0,opacity:0.6}}>AI Analasis Processing ...</Text>
                    <View style={{width:"80%" ,padding:10, backgroundColor:"lightgray",marginVertical:20,flexDirection:"row",alignItems:"center",justifyContent:"center",borderRadius:10}}>
                        <MaterialCommunityIcons 
                            name="information-outline"
                            size={20}
                            color="red"
                            style={{margin:10,opacity:0.5}}
                        />
                        <Text style={{fontWeight:"400",fontSize:10,width:"90%",opacity:0.6}}>Keep in mind that even though our deep learning model has 90% accuracy and the it's result do not stand as a diagnosis !</Text>
                    </View>
                    <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"85%",alignItems:"center",borderWidth:0.3,marginTop:0,borderRadius:100}}>
                        <Text> Stop </Text>
                    </TouchableOpacity>
                </View>
                </>
            )
            }
            {(loading != "first_loaded" && loading != "repeat_loaded" && loading != "loading" && loading != null) &&
                <>
                <LottieView
                    autoPlay
                    ref={animationFailed}
                    style={{
                    width: 200,
                    height:200,
                    backgroundColor: 'transparent',
                    }}
                    source={require('./lotties/failed.json')}
                />
                <View style={{width:"100%",alignSelf:"center",alignItems:"center"}}>
                <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"90%",marginBottom:20}}>Something went wrong, restart the app or send us the error if it occurs repedatly !</Text>
                    <TouchableOpacity onPress={() => setLoading(null)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0.3,marginBottom:10,borderRadius:100}}>
                        <Text> Close </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert(loading)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0,marginBottom:10,borderRadius:100}}>
                        <Text style={{fontWeight:"400",fontSize:12}}> Send the Error</Text>
                    </TouchableOpacity>
                </View>
                </>
            }
                </View>
            </View>
        </Modal>
    )
}