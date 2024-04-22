//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the login page, where the user can login to the app
//<********************************************>

//BASIC IMPORTS
import React,{useState} from 'react';
import { View, Text,SafeAreaView,StyleSheet,TextInput,Button,Pressable  } from 'react-native';

//CONTEXT
import { useAuth } from '../context/UserAuthContext'

//FIREBASE
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Icon } from 'react-native-elements';

const RegisterPage = ({navigation}) => {

//<********************VARIABLES************************>

//CURRENT USER | LOGIN
const {SignUp, currentuser} = useAuth()

//INPUTS | LOGIN
const [inputEmail, setInputEmail] = useState('')
const [inputPassword, setInputPassword] = useState('')
const [inputFullName, setInputFullName] = useState('')


//<********************FUNCTIONS************************>

//SUBMIT HANDLER | LOGIN
const SubmitHandler = async (e) => {
    e.preventDefault();
    const email = inputEmail;
    const password = inputPassword;
    const FullName = inputFullName;
    SignUp(email, password, FullName)
    {currentuser && setInputEmail("") && setInputPassword("") && setInputFullName("")}
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
    navigation.navigate('Login')
}


return (
<SafeAreaView style={styles.container}>
  <View style={styles.paper}>
    <View style={styles.titleSection}>
        <Text style={styles.title} >Let's get started</Text>
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

            {/* EMAIL INPUT */}
        <View style={styles.inputFieldContainer}> 
            <Icon
                name='user'
                type='font-awesome'
                color='black'
                style={{paddingLeft:10,opacity:0.3}}
            />
            <TextInput
                style={styles.inputField}
                placeholder='Fullname'
                value={inputFullName}
                onChangeText={text => setInputFullName(text)}
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


        <Pressable style={styles.button} onPress={SubmitHandler}>
            <Text style={styles.buttonTitle} >Register</Text>
        </Pressable>

        <Text>or continue with</Text>

        <Pressable style={styles.button} onPress={SubmitHandler}>
            <Text style={styles.buttonTitle} >Google</Text>
        </Pressable>

        <View style={styles.bottomText} >
            <Text>Already a user ?</Text>
            <Pressable onPress={() => handleNavigation()}>
                <Text> Login</Text>
            </Pressable>
        </View>
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
    },
    //TITLE
    titleSection:{
            width:'100%',
            flexDirection:'column',
            justifyContent:"start",
            alignItems:'left',
            maxWidth:200,
            marginTop:50,
            borderColor:'black',
        },
    title: {
        fontSize: 32,
        alignSelf: 'center',
        fontWeight:'500',
    },
    //INPUT FIELDS
    inputArea:{
        width:'100%',
        height:'70%',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:20,
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
        width:'90%',
        alignSelf:'center',
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        borderRadius:50,
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
        bottomText:{
            flexDirection:'row',
            justifyContent:'center',
        },
})

export default RegisterPage
