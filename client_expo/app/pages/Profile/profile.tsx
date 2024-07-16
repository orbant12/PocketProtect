import { View,Text,StyleSheet,Image,TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import UserDiagnosis from "./tabs/userDiagnosis"
import UserSavedPage from "./tabs/userSavedPage"
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { useAuth } from "../../context/UserAuthContext";
import { fetchUserData } from "../../services/server";
import { Icon } from 'react-native-elements';
import AssistPanel from "./tabs/userAssistPanel"
import DetectionLibary from "../Libary/detection"
import { Horizontal_Navbar } from "../../components/LibaryPage/mainNav";
import { UserData } from "../../utils/types";
import { UserData_Default } from "../../utils/initialValues";
import { HeaderContainer } from "../../components/Common/headerContainer";
import { NavBar_TwoOption } from "../../components/Common/navBars";

type NavbarValues = "ai_vision" | "blood_work" | "diagnosis" | "soon"

const Profile = ({navigation,handleSettings}) => {

//<==================<[ Variables ]>====================>

const [userData, setUserData] = useState<UserData>(UserData_Default);
const { currentuser } = useAuth()

//Libary 
const [isSelected, setIsSelected ] = useState<NavbarValues>("ai_vision")
const scrollViewRef = useRef(null);
const [activeTab, setActiveTab] = useState("libary")
const positions = useRef({
    skinCancer: 0,
    bloodAnalysis: 0,
    diagnosis: 0,
    soon: 0
});


//<==================<[ Functions ]>====================>

const fetchAllUserData = async() => {
    if(currentuser){
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        if(response){
            setUserData(response); 
        }
    }
}

useEffect(() => {    
    fetchAllUserData();
}, []);


const handleSettingsNavigation = () => {
    navigation.navigate("SettingsPage")
}





//<==================<[ Main Return ]>====================>

    return ( 
        <View style={styles.container}>        
            <Tabs.Container
                renderHeader={() => 
                    <>
                    <NavBar_TwoOption
                        title={userData.fullname}
                        icon_right={{name:"menu",size:25,action:handleSettingsNavigation}}
                        icon_left_component={() => <Image
                            source={{ uri: userData.profileUrl }}
                            style={{ 
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                borderColor: "magenta",
                                borderWidth: 1}}
                            />}
                        style={{marginBottom:20,borderWidth:0,borderColor:"white",position:"relative",zIndex:300}}
                    />
                    {activeTab == "libary" &&
                    <Horizontal_Navbar 
                        isSelected={isSelected}
                        setIsSelected={setIsSelected}
                        options={[
                                {
                                    title:"AI Vision",
                                    value:"ai_vision",
                                    scroll: { x: 0, y: -30, animated: true }
                                },
                                {
                                    title:"Blood Analasis",
                                    value:"blood_work",
                                    scroll: { x: 0, y: 650, animated: true }
                                },
                                {
                                    title:"Custom Diagnosis",
                                    value:"diagnosis",
                                    
                                },
                                {
                                    title:"Coming Soon",
                                    value:"soon",
                                    
                                }
                        ]}
                        scrollViewRef={scrollViewRef}
                        style={{}}
                    /> 
                    }
                </>
                }
                containerStyle={{backgroundColor:"white",zIndex:300,height:"100%"}}
                headerContainerStyle={{backgroundColor:"black",borderBottomWidth:2,borderTopColor:"white",zIndex:300,}}     
            >
                {/* CLIPS PAGE */}
                <Tabs.Tab 
                    name="C"            
                    label={() => <Entypo name={'folder'} size={25} color={"white"} />}
                >
                        <DetectionLibary 
                            navigation={navigation}
                            scrollViewRef={scrollViewRef}
                            isSelected={isSelected}
                            positions={positions}
                            setIsSelected={setIsSelected}
                        />
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
                >
                    <Tabs.ScrollView>
                        <UserSavedPage />
                    </Tabs.ScrollView>
                </Tabs.Tab>

            </Tabs.Container>     
        </View>   
    )}


//<==================<[ Stylesheet ]>====================>

const styles = StyleSheet.create({
    container: {
    flex: 1,
    flexDirection: 'column',

    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    },
    rowOne: {
        flexDirection:"row",
        alignItems: 'center',
        borderWidth:0.3,
        height:100,
        borderColor:"white",
        justifyContent:"space-between",
        zIndex:30,
        paddingTop:30,
    },
    userNameStyle: {
        fontSize: 20,
        fontWeight: "700",
        color: 'white',

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
        fontWeight: "800",
        color: '#000',
    },
    titleNumberHighlight: {
        fontSize: 12,
        fontWeight: "500",
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


//<==================<[ Components ]>====================>

const Header = ({
    userData,
    handleSettingsNavigation,
}) => {
    return(
        HeaderContainer({
            outerBg:"black",
            content:() => 
                <View style={styles.rowOne}>
                <Image 
                    source={{ uri: userData.profilePictureURL }}
                    style={{ 
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        borderColor: "magenta",
                        borderWidth: 1}}
                    />
                <Text style={styles.userNameStyle}>
                    {userData.fullname}
                </Text>
                <TouchableOpacity  onPress={handleSettingsNavigation}>
                    <Icon
                        name='menu'
                        type='material'
                        color='white'
                        size={25}
                    />
                </TouchableOpacity>
                </View>
            
        })
    )
}