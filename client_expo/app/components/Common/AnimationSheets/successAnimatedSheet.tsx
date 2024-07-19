import { View,Animated,StyleSheet,Text, TouchableOpacity,Modal } from "react-native"
import React, { useRef,useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { styles_shadow } from "../../../styles/shadow_styles";

export const SuccessAnimationSheet = ({active,loading,setActive}) => {

    const animationLoad = useRef(null);
    const animationSucc = useRef(null);
    const animationFailed = useRef(null);
    
    useEffect(() => {
        if (!loading && animationSucc.current) {
            animationSucc.current.play();
            setTimeout(() => {
                setActive(false);
            }, 1500);
        } else if (loading != false && loading != true && loading != null && animationSucc.current) {
            animationFailed.current.reset();
        }
    }, [loading]);

    const repeatTillVisible = () => {
        setTimeout(() => {
            if (loading != false && animationLoad.current) {
                animationLoad.current.reset();
                animationLoad.current.play();
                repeatTillVisible();
            }
        }, 1000);
    };

    if (loading && animationLoad.current) {
        animationLoad.current.play();
        repeatTillVisible();
    }


    return(
  
    <Modal
        transparent={true}
        animationType="fade"
        visible={active}
    >
        <View style={{width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"absolute"}}>
            <View style={[loading === false || loading === true  ? {width:300,height:250,justifyContent:"center",}:{width:300,height:400,justifyContent:"space-between",padding:10},{backgroundColor:"white",display:"flex",flexDirection:"column",alignItems:"center",borderRadius:30},styles_shadow.hightShadowContainer]}>
                {loading === false ? (
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
                    <Text style={{fontWeight:"600",fontSize:15,textAlign:"center",width:"80%"}}>Sweet, Your mole is uploaded succesfully !</Text>
                    <TouchableOpacity style={{padding:10,width:"80%",alignItems:"center",borderWidth:0.3,marginTop:10,borderRadius:100}}>
                        <Text> Close </Text>
                    </TouchableOpacity>
                    </>
                ):loading === true ? (
                    <>
                    <LottieView
                        autoPlay
                        loop
                        ref={animationLoad}
                        style={{
                        width: 230,
                        height: 230,
                        backgroundColor: 'transparent',
                        position:"absolute",
                        top:-10,
                        }}
                        source={require('./lotties/Loading.json')}
                    />
                    <View style={{width:"100%",alignSelf:"center",alignItems:"center",position:"absolute",bottom:15}}>
                        <Text style={{fontWeight:"800",fontSize:15,textAlign:"center",width:"90%",marginBottom:10,opacity:0.6}}>Uploading ...</Text>
                        <TouchableOpacity style={{padding:10,width:"80%",alignItems:"center",borderWidth:0.3,marginTop:0,borderRadius:100}}>
                            <Text> Stop </Text>
                        </TouchableOpacity>
                    </View>
                    </>
                ):loading != true && loading != false && loading != null ? (
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
                        <TouchableOpacity onPress={() => setActive(false)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0.3,marginBottom:10,borderRadius:100}}>
                            <Text> Close </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert(loading)} style={{padding:10,width:"80%",alignItems:"center",borderWidth:0,marginBottom:10,borderRadius:100}}>
                            <Text style={{fontWeight:"400",fontSize:12}}> Send the Error</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                ):null}
            </View>
        </View>
    </Modal>
    )
}

