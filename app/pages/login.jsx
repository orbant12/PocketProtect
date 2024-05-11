//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the login page, where the user can login to the app
//<********************************************>

import React,{useState} from 'react';
import { View, Text,SafeAreaView,StyleSheet,TextInput,Button, Pressable  } from 'react-native';
import { useAuth } from '../context/UserAuthContext'
import { auth } from '../firebase';
import { sendPasswordResetEmail, GoogleAuthProvider,signInWithRedirect } from 'firebase/auth';
import { Icon } from 'react-native-elements';

const LoginPage = ({navigation}) => {

//<********************VARIABLES************************>

//CURRENT USER | LOGIN
const {Login, currentuser} = useAuth()
//INPUTS | LOGIN
const [inputEmail, setInputEmail] = useState('')
const [inputPassword, setInputPassword] = useState('')


//<********************FUNCTIONS************************>

//SUBMIT HANDLER | LOGIN
const SubmitHandler = async (e) => {
    e.preventDefault();
    const email = inputEmail;
    const password = inputPassword;
    const response = await Login(email, password)
    {currentuser && setInputEmail("") && setInputPassword("")}

};

//FORGOT PASSWORD | LOGIN
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

return (
    <SafeAreaView style={styles.container}>
        <View style={styles.paper}>
            <View style={styles.titleSection}>
                <Text style={styles.title} >Hey, Welcome Back</Text>
            </View>

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


            <Pressable style={styles.button} onPress={SubmitHandler}>
                <Text style={styles.buttonTitle} >Login</Text>
            </Pressable>

            <View style={styles.bottomText} >
                <Text>Already a user ?</Text>
                <Pressable onPress={() => handleNavigation()}>
                    <Text>  Register</Text>
                </Pressable>
            </View>

        </View>
    </SafeAreaView>
)
}

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
