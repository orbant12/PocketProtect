import { View,Text,Pressable,StyleSheet, Modal } from "react-native"
import { useNavigation } from "@react-navigation/core";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/UserAuthContext'
import { auth,} from '../../../services/firebase';
import { GoogleAuthProvider,signInWithCredential,signInWithPopup } from "firebase/auth";
import React, {useState,useEffect} from "react";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginPage from "../login";
import RegisterPage from "../register";

WebBrowser.maybeCompleteAuthSession();

const AuthHub = () => {

    const [ selectedAuth, setSelectedAuth] = useState(null)

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "567381254436-b0cqltfecu40o0skrmiq77iiqp2h9njl.apps.googleusercontent.com",
        iosClientId: "567381254436-1mi5rsbhrhfe3lhf7if2nhqmf6fnuf22.apps.googleusercontent.com",
        webClientId: "567381254436-3d9t89faq4qm38ucnf1hqrr25hkle4ek.apps.googleusercontent.com",
    });
  
    useEffect(() => {
        if(response?.type == "success"){
            const { id_token } = response.params;
            console.log(id_token)
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
        }
    },[response])

    //USER | LOGIN
    const {GoogleLogin, user} = useAuth()
    //NAVIGATION
const navigation = useNavigation();

    const handleNavigation = (path) => {
        navigation.navigate(path)
    }

    const handleGoogleAuth = async() => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        GoogleLogin(result)
    }
    

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
                    <Pressable onPress={() => promptAsync()} style={[styles.Button,{ backgroundColor:"magenta" }]}>
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



const AuthSheetModal = ({selectedAuth,setSelectedAuth}) => {
    return(
        <Modal presentationStyle="formSheet" animationType="slide"  visible={selectedAuth != null} >
            {selectedAuth == "login" && <LoginPage 
                handleClose={() => setSelectedAuth(null)}
            /> }
            {selectedAuth == "register" && <RegisterPage 
                handleClose={() => setSelectedAuth(null)}
            /> }
        </Modal>
    )
}