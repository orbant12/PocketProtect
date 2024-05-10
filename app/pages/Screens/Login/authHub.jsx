import { View,Text,Pressable,StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/core";

const AuthHub = () => {

    //NAVIGATION
const navigation = useNavigation();

    const handleNavigation = (path) => {
        navigation.navigate(path)
    }

    return(
        <View style={styles.container}>
            <View style={styles.TopAnimationSection}>
                <Text>Let's get protected</Text>
            </View>
            <View style={styles.BottomFormSection}>
                <Pressable style={[styles.Button,{backgroundColor:"white"}]}>
                    <Text style={{fontWeight:600,fontSize:15}}>Continue with Apple</Text>
                </Pressable>
                <Pressable style={[styles.Button,{ backgroundColor:"magenta" }]}>
                    <Text style={{fontWeight:700,fontSize:15,color:"white"}}>Continue with Google</Text>
                </Pressable>
                <Pressable onPress={() => handleNavigation("Login")} style={[styles.Button,{backgroundColor:"black",borderWidth:1,borderColor:"white"}]}>
                    <Text style={{fontWeight:600,fontSize:15,color:"white"}}>Log in</Text>
                </Pressable>
                <Pressable onPress={() => handleNavigation("Register")} style={[styles.Button,{backgroundColor:"black",borderWidth:1,borderColor:"white"}]}>
                    <Text style={{fontWeight:600,fontSize:15,color:"white"}}>Register</Text>
                </Pressable>
            </View>
        </View>
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
        height:"42%",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        padding:30,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:"black"
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