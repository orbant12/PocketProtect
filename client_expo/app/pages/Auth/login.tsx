import React,{useState} from 'react';
import { View, Text,SafeAreaView,TextInput, Pressable,TouchableOpacity, GestureResponderEvent  } from 'react-native';
import { useAuth } from '../../context/UserAuthContext'
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Icon } from 'react-native-elements';
import { l_styles } from '../../styles/auth_style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const LoginPage = ({navigation, handleClose}) => {

//<==================<[ Variables ]>====================>

    const {Login, currentuser} = useAuth()

    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');


//<==================<[ Functions ]>====================>

    const SubmitHandler = async (e:GestureResponderEvent) => {
        e.preventDefault();
        const email = inputEmail;
        const password = inputPassword;
        const response = await Login(email, password)
        if (currentuser && response == true) {
            setInputEmail('');
            setInputPassword('');
            handleClose()
        }
    };

    const handleForgotPass = async() => {
    if(inputEmail != ""){
        await sendPasswordResetEmail(auth,inputEmail)
        alert("Password Reset Email Sent")
    }else{
        alert("Please Enter Email Address to Reset Password")
    }
    }

    const handleNavigation = () => {
        navigation.navigate('Register')
    }

//<==================<[ Main Return ]>====================>

    return (
        <SafeAreaView style={l_styles.container}>
            <View style={l_styles.paper}>
                <View style={l_styles.titleSection}>
                    <Text style={l_styles.title} >Hey, Welcome Back</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={{flexDirection:"column",justifyContent:"center",width:50,height:50, backgroundColor:"black", borderRadius:100, borderWidth:2, borderColor:"white",alignItems:"center",position:"absolute",right:20,top:20}}>
                    <MaterialCommunityIcons 
                        name='arrow-left'
                        color={"white"}
                        size={25}
                    />
                </TouchableOpacity>
                <InputSection 
                    handleNavigation={handleNavigation}
                    inputEmail={inputEmail} 
                    inputPassword={inputPassword} 
                    setInputEmail={setInputEmail}
                    setInputPassword={setInputPassword}
                    handleForgotPass={handleForgotPass}
                    SubmitHandler={SubmitHandler}
                />
            </View>
        </SafeAreaView>
    )}

export default LoginPage

//<==================<[ Components ]>====================>

const InputSection = ({handleNavigation,inputEmail,inputPassword,setInputPassword,setInputEmail,handleForgotPass,SubmitHandler}:{
    handleNavigation:() => void;
    inputEmail:string;
    inputPassword:string;
    setInputPassword:(text:string) => void;
    setInputEmail:(text:string) => void;
    handleForgotPass:() => void;
    SubmitHandler:(e:GestureResponderEvent) => void;
}) => {
    return(
        <>
            <View style={l_styles.inputArea}>
            {/* EMAIL INPUT */}
                <View style={l_styles.inputFieldContainer}> 
                    <Icon
                        name='envelope'
                        type='font-awesome'
                        color='black'
                        style={{paddingLeft:10,opacity:0.3}}
                    />
                    <TextInput
                        style={l_styles.inputField}
                        placeholder='Email'
                        value={inputEmail}
                        onChangeText={text => setInputEmail(text)}
                    />
                </View>
            {/* PASSWORD INPUT */}
                <View style={l_styles.inputFieldContainer}> 
                    <Icon
                        name='lock'
                        type='font-awesome'
                        color='black'
                        onPress={handleForgotPass}
                        style={{paddingLeft:10,opacity:0.3}}
                    />
                    <TextInput
                        style={l_styles.inputField}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        value={inputPassword}
                        onChangeText={text => setInputPassword(text)}
                    />
                </View>
                <Pressable style={l_styles.forgotPassRow}>
                    <Text>Forgot Password ?</Text>
                </Pressable>
            </View>
            <TouchableOpacity style={l_styles.button} onPress={SubmitHandler}>
                <Text style={l_styles.buttonTitle} >Login</Text>
            </TouchableOpacity>
            <View style={l_styles.bottomText} >
                <Text>Already a user ?</Text>
                <Pressable onPress={() => handleNavigation()}>
                    <Text>  Register</Text>
                </Pressable>
            </View>
        </>
    )
}