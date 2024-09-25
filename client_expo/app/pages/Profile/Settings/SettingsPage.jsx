
//BASIC IMPORTS
import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView, Linking, Alert} from 'react-native';
import * as MailComposer from 'expo-mail-composer';

//ICONS
import { Icon } from 'react-native-elements';

//FIREBASE
import { signOut } from "firebase/auth"
import { auth } from '../../../services/firebase';

const SettingsPage = ({navigation}) => {

//<**********************FUNCTIONS******************************>

//GENERAL NAVIGATION
const handleGeneralNavigation = (page) => {
    navigation.navigate("GeneralSettings",{data:page})
}

//LOGOUT
const handleLogout = () => {
    //logout from firebase
    signOut(auth).then(() => {
        alert("You have been logged out")
    }).catch((error) => {
        console.log(error)
    });

}

const openAppStore = () => {
    const appStoreLink = 'https://apps.apple.com/app/idYOUR_APP_ID'; // Replace with your actual App Store link
    Linking.openURL(appStoreLink).catch(err => console.error("Couldn't load page", err));
};

const sendEmail = () => {
    const options = {
        recipients: ["orbant1@gmail.com"],
        subject: "App Feed Back",
        body: "Hez ndksndknskdnkc k cjkd",
        isHtml: false
    }
    MailComposer.composeAsync(options);
};
return(
<View style={styles.container}> 
    <ScrollView style={styles.colContainer}>
        <View style={{flexDirection:"row",width:"80%",marginRight:"auto",marginLeft:"auto",marginBottom:10}}>
            <Text>GENERAL</Text>
        </View>
        
        <TouchableOpacity onPress={() => handleGeneralNavigation("Account")} style={styles.topicRow}>
            <Icon
                name='person'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:120,fontWeight:"600",fontSize:15}}>Account</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.topicRow}>
            <Icon
                name='logout'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:130,fontWeight:"600",fontSize:15}}>Logout</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <View style={{flexDirection:"row",width:"80%",marginRight:"auto",marginLeft:"auto",marginBottom:20,marginTop:30}}>
            <Text>FEEDBACK</Text>
        </View>

        <TouchableOpacity onPress={openAppStore}  style={styles.topicRow}>
            <Icon
                name='send'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:70,fontWeight:"600",fontSize:15}}>Send feedback</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sendEmail()}  style={styles.topicRow}>
            <Icon
                name='warning'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:50,fontWeight:"600",fontSize:15}}>Report a problem</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sendEmail()} style={styles.topicRow}>
            <Icon
                name='info'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:100,fontWeight:"600",fontSize:15}}>Support</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <View style={{flexDirection:"row",width:"80%",marginRight:"auto",marginLeft:"auto",marginBottom:20,marginTop:30}}>
            <Text>POLICIES</Text>
        </View>

        <TouchableOpacity style={styles.topicRow}>
            <Icon
                name='bookmarks'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:40,fontWeight:"600",fontSize:15}}>Terms & Services</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topicRow}>
            <Icon
                name='video-library'
                type='material'
                color='black'
                size={20} 
            />
            <Text style={{marginRight:40,fontWeight:"600",fontSize:15}}>User Safety</Text>
            <Icon
                name='arrow-forward-ios'
                type='material'
                color='black'
                size={20}
                style={{opacity:0.8}}
            />
        </TouchableOpacity>
    </ScrollView>
</View>
)
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        
        alignItems:"center",
        backgroundColor:"white"
    },
    topicRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"80%",
        padding:20,
        borderBottomWidth:0.3,
        borderColor:"gray",
        marginRight:"auto",
        marginLeft:"auto",
        
    },
    colContainer:{
        width:"100%",
        marginTop:30
    }
})

export default SettingsPage;