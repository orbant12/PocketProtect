import { View,Text,Pressable,StyleSheet, Modal } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/UserAuthContext'
import React, {useState, useCallback} from "react";

import LoginPage from "../login";
import RegisterPage from "../register";
import { useFocusEffect } from "@react-navigation/native";




const AuthHub = ({navigation}) => {

    const [ selectedAuth, setSelectedAuth] = useState(null)
    const { handleGoogleAuth,handleAuthHandler } = useAuth()

    useFocusEffect(
        useCallback(() => {
            handleAuthHandler("fetch_w_main")
        return () => {};
        }, [])
      );
      

    return(
        <>
        <View style={styles.container}>
            <View style={styles.TopAnimationSection}>
                <Text>Let's get protected</Text>
            </View>
            <View style={{height:"47%", backgroundColor:"black",width:"100%",borderTopLeftRadius:20,borderTopRightRadius:20,}}>
                <View style={styles.BottomFormSection}>
                    <Pressable style={[styles.Button,{backgroundColor:"white"}]}>
                        <MaterialCommunityIcons 
                            name="apple"
                            size={20}
                        />
                        <Text style={{fontWeight:"600",fontSize:15,marginLeft:10}}>Continue with Apple</Text>
                    </Pressable>
                    <Pressable onPress={() => handleGoogleAuth()} style={[styles.Button,{ backgroundColor:"magenta" }]}>
                        <MaterialCommunityIcons 
                            name="google"
                            size={20}
                        />
                        <Text style={{fontWeight:"700",fontSize:15,color:"white",marginLeft:10}}>Continue with Google</Text>
                    </Pressable>
                    <Pressable onPress={() => setSelectedAuth("login")} style={[styles.Button,{backgroundColor:"black",borderWidth:1,borderColor:"white"}]}>
                        <Text style={{fontWeight:"600",fontSize:15,color:"white"}}>Log in</Text>
                    </Pressable>
                    <Pressable onPress={() => setSelectedAuth("register")} style={[styles.Button,{backgroundColor:"black",borderWidth:1,borderColor:"white"}]}>
                        <Text style={{fontWeight:"600",fontSize:15,color:"white"}}>Register</Text>
                    </Pressable>
                </View>
            </View>            
        </View>
        <AuthSheetModal 
            selectedAuth={selectedAuth}
            setSelectedAuth={setSelectedAuth}
            navigation={navigation}
        />
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"space-between",
        backgroundColor:"#CCC"
    },
    TopAnimationSection:{
        height:"58%",
        alignItems:"center",
        justifyContent:"center",
        paddingTop:10,
        width:"100%",
        backgroundColor:"#CCC"
    },
    BottomFormSection:{
        height:300,
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        padding:30,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:"black",        
    },
    Button:{
        width:300,
        height:45,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10
    }
})

export default AuthHub



const AuthSheetModal = ({selectedAuth,setSelectedAuth,navigation}) => {
    return(
        <Modal presentationStyle="formSheet" animationType="slide"  visible={selectedAuth != null} >
            {selectedAuth == "login" && <LoginPage 
                handleClose={() => setSelectedAuth(null)}
                navigation={navigation}
            /> }
            {selectedAuth == "register" && <RegisterPage 
                handleClose={() => setSelectedAuth(null)}
                navigation={navigation}
            /> }
        </Modal>
    )
}