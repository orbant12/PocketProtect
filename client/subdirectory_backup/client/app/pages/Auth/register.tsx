
import React,{useState} from 'react';
import { View, Text,SafeAreaView,TextInput,Button,Pressable,GestureResponderEvent  } from 'react-native';
import { useAuth } from '../../context/UserAuthContext'
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Icon } from 'react-native-elements';
import { r_styles } from '../../styles/auth_style';

const RegisterPage = ({navigation}) => {

//<********************VARIABLES************************>

//CURRENT USER | LOGIN
const {SignUp, currentuser} = useAuth()

//INPUTS | LOGIN
const [inputEmail, setInputEmail] = useState<string>('')
const [inputPassword, setInputPassword] = useState<string>('')
const [inputFullName, setInputFullName] = useState<string>('')


//<********************FUNCTIONS************************>

//SUBMIT HANDLER | LOGIN
const SubmitHandler = async (e:GestureResponderEvent) => {
    e.preventDefault();
    const email = inputEmail;
    const password = inputPassword;
    const FullName = inputFullName;
    const response = await SignUp(email, password, FullName)
    if (currentuser) {
        setInputEmail('');
        setInputPassword('');
        setInputFullName('')
    }
    if (response == true){
        navigation.navigate("RegOnBoarding")
    } else {
        alert(response)
    }
};




//FORGOT PASSWORD | LOGIN
const handleForgotPass = async() => {
    if(inputEmail != ""){
        await sendPasswordResetEmail(auth,inputEmail)
        alert("Password Reset Email Sent")
    }else{
        alert("Please Enter Email Address to Reset Password")
    }
}

const handleNavigation = () => {
    navigation.navigate('Login')
}


return (
<SafeAreaView style={r_styles.container}>
  <View style={r_styles.paper}>
    <View style={r_styles.titleSection}>
        <Text style={r_styles.title} >Let's get started</Text>
    </View>

    <View style={r_styles.inputArea}>
      {/* EMAIL INPUT */}

        <View style={r_styles.inputFieldContainer}> 
            <Icon
                name='envelope'
                type='font-awesome'
                color='black'
                style={{paddingLeft:10,opacity:0.3}}
            />
            <TextInput
                style={r_styles.inputField}
                placeholder='Email'
                value={inputEmail}
                onChangeText={text => setInputEmail(text)}
            />
        </View>

            {/* EMAIL INPUT */}
        <View style={r_styles.inputFieldContainer}> 
            <Icon
                name='user'
                type='font-awesome'
                color='black'
                style={{paddingLeft:10,opacity:0.3}}
            />
            <TextInput
                style={r_styles.inputField}
                placeholder='Fullname'
                value={inputFullName}
                onChangeText={text => setInputFullName(text)}
            />
        </View>
      {/* PASSWORD INPUT */}

        <View style={r_styles.inputFieldContainer}> 
            <Icon
                name='lock'
                type='font-awesome'
                color='black'
                onPress={handleForgotPass}
                style={{paddingLeft:10,opacity:0.3}}
            />
            <TextInput
                style={r_styles.inputField}
                placeholder={'Password'}
                secureTextEntry={true}
                value={inputPassword}
                onChangeText={text => setInputPassword(text)}
            />
        </View>
    </View>

    <Pressable style={r_styles.button} onPress={SubmitHandler}>
            <Text style={r_styles.buttonTitle} >Register</Text>
    </Pressable>

    <View style={r_styles.bottomText} >
        <Text>Already a user ?</Text>
        <Pressable onPress={() => handleNavigation()}>
            <Text> Login</Text>
        </Pressable>
    </View>

</View>
</SafeAreaView>
)
}

export default RegisterPage
