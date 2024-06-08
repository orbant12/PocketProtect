import React,{useState} from 'react';
import { View, Text,SafeAreaView,StyleSheet,TextInput, Pressable,TouchableOpacity  } from 'react-native';
import { useAuth } from '../../context/UserAuthContext'
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Icon } from 'react-native-elements';

const LoginPage = ({navigation}) => {

//<==================<[ Variables ]>====================>

    const {Login, currentuser} = useAuth()

    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')


//<==================<[ Functions ]>====================>

    const SubmitHandler = async (e) => {
        e.preventDefault();
        const email = inputEmail;
        const password = inputPassword;
        const response = await Login(email, password)
        {currentuser && setInputEmail("") && setInputPassword("")}
    };

    const handleForgotPass = async() => {
    if(user.email != ""){
        await sendPasswordResetEmail(auth,user.email)
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
        <SafeAreaView style={styles.container}>
            <View style={styles.paper}>
                <View style={styles.titleSection}>
                    <Text style={styles.title} >Hey, Welcome Back</Text>
                </View>
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


//<==================<[ Style Sheet ]>====================>

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
},
paper: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 0,
    backgroundColor: 'white',
    justifyContent:"space-between"
},
//TITLE
titleSection:{
        width:'100%',
        flexDirection:'column',
        justifyContent:"start",
        alignItems:'left',
        maxWidth:150,
        marginTop:40,
        marginLeft:20,
        marginBottom: 20,
        borderColor:'black',
    },
title: {
    fontSize: 32,
    alignSelf: 'center',
    fontWeight:'700',
},
//INPUT FIELDS
inputArea:{
    width:'100%',
    height:200,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:50,
    borderColor:'black',
},
text: {
    fontSize: 20,
    marginLeft:50,
},
button: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 50,
    padding: 20,
},
buttonTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'center',
},
inputFieldContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'85%',
    alignSelf:'center',
    backgroundColor:'white',
    borderColor:'black',
    borderWidth:0.3,
    borderRadius:10,
    padding:20,
    fontSize:20,
    fontWeight:'500'
},
inputField:{
    alignSelf:'center',
    width:'90%',
    backgroundColor:'white',
    borderColor:'black',
    borderRadius:50,
    padding:0,
    fontSize:20,
    fontWeight:'500',
    marginLeft:13
},
//FORGOT PASSWORD
forgotPassRow:{
    flexDirection:'row-reverse',
    justifyContent:'space-between',
    width:'90%',
},

bottomText:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:30
},
})

export default LoginPage

//<==================<[ Components ]>====================>

const InputSection = ({handleNavigation,inputEmail,inputPassword,setInputPassword,setInputEmail,handleForgotPass,SubmitHandler}) => {
    return(
        <>
            <View style={styles.inputArea}>
            {/* EMAIL INPUT */}
                <View style={styles.inputFieldContainer}> 
                    <Icon
                        name='envelope'
                        type='font-awesome'
                        color='black'
                        style={{paddingLeft:10,opacity:0.3}}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder='Email'
                        value={inputEmail}
                        onChangeText={text => setInputEmail(text)}
                    />
                </View>
            {/* PASSWORD INPUT */}
                <View style={styles.inputFieldContainer}> 
                    <Icon
                        name='lock'
                        type='font-awesome'
                        color='black'
                        onPress={handleForgotPass}
                        style={{paddingLeft:10,opacity:0.3}}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        value={inputPassword}
                        onChangeText={text => setInputPassword(text)}
                    />
                </View>
                <Pressable style={styles.forgotPassRow}>
                    <Text>Forgot Password ?</Text>
                </Pressable>
            </View>
            <TouchableOpacity style={styles.button} onPress={SubmitHandler}>
                <Text style={styles.buttonTitle} >Login</Text>
            </TouchableOpacity>
            <View style={styles.bottomText} >
                <Text>Already a user ?</Text>
                <Pressable onPress={() => handleNavigation()}>
                    <Text>  Register</Text>
                </Pressable>
            </View>
        </>
    )
}