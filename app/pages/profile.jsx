//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the data navigator where current user can see his/her profile and data
//<********************************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import React, { useEffect, useState } from 'react';

//COMPONENTS
import UserDiagnosis from "./Screens/profile/userDiagnosis"
import UserSavedPage from "../pages/Screens/profile/userSavedPage"

//ASSETS
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';

//CONTEXT
import { useAuth } from "../context/UserAuthContext";

import { fetchUserData } from "../server";
import { Icon } from 'react-native-elements';


const Profile = ({navigation,handleSettings}) => {

//<********************VARIABLES************************>

//CURRENT USER DATA
const [userData, setUserData] = useState([]);

//CURRENT USER
const {currentuser} = useAuth();

//<********************FUNCTIONS************************>

//FETCH CURRENT USER DATA
const fetchAllUserData = async() => {
    if(currentuser){
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response.data()); 
    }
}

//ON PAGE LOAD
useEffect(() => {
    //1.) Fetch the user data
    fetchAllUserData();
}, []);

//SETTINGS NAVIGATION
const handleSettingsNavigation = () => {
    navigation.navigate("SettingsPage")
  }


//HEADER COMPONENT | NAVIGATOR
const Header = () => {
return(
<View style={styles.rowOne}>
    <Image 
        source={{ uri: userData.profilePictureURL }}
        style={{ 
            width: 70,
            height: 70,
            borderRadius: 50,
            borderColor: "magenta",
            borderWidth: 1}}
        />
    <Text style={styles.userNameStyle}>
        {userData.fullname}
    </Text>
    {/* <TouchableOpacity style={{padding:5,borderWidth:1,paddingHorizontal:10,marginTop:0,borderRadius:10,backgroundColor:"white"}}>
        <Text style={{fontWeight:"500",color:"black"}}>Settings</Text>
    </TouchableOpacity> */}

    <TouchableOpacity style={{position:"absolute",right:20,top:30}} onPress={handleSettingsNavigation}>
        <Icon
            name='menu'
            type='material'
            color='black'
            size={25}
        />
    </TouchableOpacity>

</View>
)}


return ( 
<View style={styles.container}>        
    <Tabs.Container
        renderHeader={Header}
        style={{backgroundColor:"white",color:"magenta"}}
        containerStyle={{color:"white",backgroundColor:"white"}}
        headerContainerStyle={{backgroundColor:"black",}}     
    >

        {/* CLIPS PAGE */}
        <Tabs.Tab 
            name="C"            
            label={() => <Entypo name={'folder'} size={25} color={"white"} />}
        >
            <Tabs.ScrollView>
                <UserDiagnosis navigation={navigation} />
            </Tabs.ScrollView>
        </Tabs.Tab>

        {/* SAVED PAGE */}
        <Tabs.Tab 
            name="D"
            label={() => <Entypo name={'book'} size={25} color={"white"} />}
        >
        
            <Tabs.ScrollView>
                <UserSavedPage />
            </Tabs.ScrollView>
        </Tabs.Tab>

        {/* COMMUNITY PAGE */}
        <Tabs.Tab 
            name="B"
            label={() => <Entypo name={'bell'} size={25} color={"white"} />}
            activeColor={"red"}
        >
            <Tabs.ScrollView>
            <UserSavedPage />
            </Tabs.ScrollView>
        </Tabs.Tab>

    </Tabs.Container>     
</View>   
)}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: 'white',
    },
    rowOne: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth:0.3,
        height:200,
        borderBottomColor:"white",
        justifyContent:"center",
        zIndex:10,
        backgroundColor:"white",
        paddingTop:30
    },
    userNameStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,

    },
    userStatsRow: {
        flexDirection: 'row',
        width: '80%', 
        marginLeft:"auto",
        marginRight:"auto",
        marginTop: 10,
    },
    centeredCol: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 100,
    },
    numberHighlight: {
        fontSize: 15,
        fontWeight: '800',
        color: '#000',
    },
    titleNumberHighlight: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
    },
    followBTN:{
    backgroundColor:"blue",
    padding:10,
    borderRadius:10,
    marginTop:15,
    marginBottom:10,
    }
});

export default Profile