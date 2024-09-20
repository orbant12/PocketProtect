import { View,Text,StyleSheet,Image,TouchableOpacity, Modal, ActivityIndicator } from "react-native"
import React, { useState, useRef } from 'react';
import UserSavedPage from "./tabs/userSavedPage"
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';
import { useAuth } from "../../context/UserAuthContext";
import { Icon } from 'react-native-elements';
import DetectionLibary from "../Libary/detection"
import { Horizontal_Navbar } from "../../components/LibaryPage/mainNav";
import { HeaderContainer } from "../../components/Common/headerContainer";
import { NavBar_TwoOption } from "../../components/Common/navBars";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import ProfileCameraScreenView from "../Auth/cameraModal";
import { styles_shadow } from "../../styles/shadow_styles";
import { User } from "../../models/User";
import { ImageLoaderComponent } from "../../components/Common/imageLoader";

type NavbarValues = "ai_vision" | "blood_work" | "diagnosis" | "soon"

const Profile = ({navigation,handleSettings}) => {

//<==================<[ Variables ]>====================>


const { currentuser, handleAuthHandler } = useAuth()
const [isProfileChangeActive, setIsProfileChangeActive] = useState(false);  
const [profileUrl, setProfileUrl] = useState(currentuser.profileUrl);
const [isCameraActive, setIsCameraActive] = useState(false);
const [loading, setLoading] = useState(false)
const maleDefault = Image.resolveAssetSource(require("../../assets/male.png")).uri;
const femaleDefault = Image.resolveAssetSource(require("../../assets/female.png")).uri;


//Libary 
const [isSelected, setIsSelected ] = useState<NavbarValues>("ai_vision")
const scrollViewRef = useRef(null);
const [activeTab, setActiveTab] = useState<string>("C")
const positions = useRef({
    skinCancer: 0,
    bloodAnalysis: 0,
    diagnosis: 0,
    soon: 0
});


//<==================<[ Functions ]>====================>

const handleSettingsNavigation = () => {
    navigation.navigate("SettingsPage")
}

const handlePictureUpload = async() => {        
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        setProfileUrl(result.assets[0].uri);
    }
};

const handleChangeProfile = async() => {
    setLoading(true)
    const user = new User(currentuser.uid);
    const response = await user.changeProfileUrl(profileUrl);
    if(response == true){
        setIsProfileChangeActive(false);
        handleAuthHandler("fetch");
    }
    setLoading(false)
}


//<==================<[ Main Return ]>====================>

    return ( 
        <View style={styles.container}>        
            <Tabs.Container
                onTabChange={(tab) => setActiveTab(tab.tabName)}
                renderHeader={() => 
                    <>
                    <NavBar_TwoOption
                        title={currentuser.fullname}
                        icon_right={{name:"menu",size:25,action:handleSettingsNavigation}}
                        icon_left_component={() => 
                            <TouchableOpacity onPress={() => setIsProfileChangeActive(true)}>
                                {currentuser.profileUrl != "" ?
                                    <ImageLoaderComponent
                                        w={50}
                                        h={50}
                                        imageStyle={{borderRadius:10,borderColor:"magenta",borderWidth:2}}
                                        style={{borderRadius:10,borderColor:"magenta",borderWidth:1}}
                                        data={{melanomaPictureUrl:currentuser.profileUrl}}
                                    />
                                    :
                                    <View style={{width:50,height:50, borderRadius:50,borderColor:"magenta",borderWidth:2,backgroundColor:"black"}} />
                                }
                            </TouchableOpacity>
                        }
                        style={{marginBottom:20,borderWidth:0,borderColor:"white",position:"relative",zIndex:300}}
                    />
                    {activeTab == "C" &&
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
                                    title:"Custom Diagnosis",
                                    value:"diagnosis",
                                    scroll: { x: 0, y: 1000, animated: true }
                                },
                        
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
                        <UserSavedPage navigation={navigation}/>
                    </Tabs.ScrollView>
                </Tabs.Tab>
                {/* COMMUNITY PAGE */}
                <Tabs.Tab 
                    name="B"
                    label={() => <Entypo name={'bell'} size={25} color={"white"} />}
                >
                    <Tabs.ScrollView>
                        <View style={{width:"100%", flexDirection:"column",alignItems:"center",height:"70%",justifyContent:"center"}}>
                            <View style={{width:"60%", flexDirection:"column",alignItems:"center",padding:10, backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10}}>
                                <Text style={{fontWeight:700,fontSize:14,opacity:0.5}}>
                                    No Notifications !
                                </Text>
                            </View>
                        </View>
                    </Tabs.ScrollView>
                </Tabs.Tab>

            </Tabs.Container>     
            <Modal animationType="slide" visible={isProfileChangeActive} presentationStyle="formSheet">
            <>
                {!loading ?
                <>
                <TouchableOpacity onPress={() => {setIsProfileChangeActive(!isProfileChangeActive);setProfileUrl(currentuser.profileUrl)}} style={{flexDirection:"column",justifyContent:"center",width:"90%",height:50,borderRadius:10,backgroundColor:"black",borderWidth:3,borderColor:"white",alignItems:"center",position:"absolute",top:20,alignSelf:"center"}}>
                        <MaterialCommunityIcons 
                            name="close"
                            size={25}
                            color={"white"}
                        />
                    </TouchableOpacity>
                <View style={styles.startScreen}>
                    <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%"}}>  
                        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>Select or upload your profile picture !</Text>
                        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <MaterialCommunityIcons 
                                name="information"
                                color={"black"}
                                size={30}
                                style={{width:"10%",opacity:0.6}}
                            />
                            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>You can change this later ! We need this information for making chatting and medical reports more personal & formal ...</Text>
                        </View>
                    </View>
                    <View style={{width:"100%",alignItems:"center"}}>
                        <View style={[{borderWidth:0.3,borderColor:"magenta",backgroundColor:"rgba(0,0,0,1)",borderRadius:10,marginBottom:30,width:130,height:130,flexDirection:"column",alignItems:"center",justifyContent:"center"},styles_shadow.hightShadowContainer]}>
                            <ImageLoaderComponent
                                w={120}
                                h={120}
                                imageStyle={{borderRadius:10}}
                                style={{backgroundColor:"transparent",borderRadius:10}}
                                data={{melanomaPictureUrl:profileUrl}}
                            />
                        </View>
                        <View style={{width:"80%",flexDirection:"row",alignItems:"center",justifyContent:"center",padding:10,borderWidth:0.3,borderRadius:10}}>
                            <TouchableOpacity onPress={() => setProfileUrl(maleDefault)}>
                                <Image 
                                    style={profileUrl != maleDefault ? {width:50,height:50,marginLeft:5,borderWidth:3} : {width:50,height:50,marginLeft:5,borderWidth:3,borderColor:"magenta"}}
                                    source={{uri: maleDefault}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setProfileUrl(femaleDefault)}>
                                <Image 
                                    style={profileUrl != femaleDefault ? {width:50,height:50,marginLeft:5,borderWidth:3} : {width:50,height:50,marginLeft:5,borderWidth:3,borderColor:"magenta"}}
                                    source={{uri: femaleDefault}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsCameraActive(true)} style={{backgroundColor:"white",padding:10,borderRadius:5, width:50,height:50,marginLeft:25,borderWidth:3,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
                                <MaterialCommunityIcons 
                                    name="camera"
                                    size={25}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePictureUpload} style={{backgroundColor:"black",padding:10,borderRadius:5, width:50,height:50,marginLeft:5,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
                                <MaterialCommunityIcons 
                                    name="image"
                                    size={30}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        handleChangeProfile()
                        }} style={[styles.startButton,{marginBottom:0}]}>
                        <Text style={{padding:14,fontWeight:"700",color:"white",fontSize:15}}>Save</Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={isCameraActive} animationType="slide" presentationStyle="overFullScreen" >
                    <ProfileCameraScreenView 
                        onClose={() => setIsCameraActive(false)}
                        onPictureTaken={(uri:string) => {
                            setProfileUrl(uri);
                            setIsCameraActive(false);
                        }}
                    />  
                </Modal>
                </>
                :
                <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                    <ActivityIndicator size={20} />
                    <Text style={{fontWeight:"700"}}> Uploading</Text>
                    <TouchableOpacity onPress={() => setLoading(false)} style={{position:"absolute",bottom:10,alignItems:"center",padding:15,width:"80%",backgroundColor:"black",borderRadius:10}}>
                        <Text style={{color:"white",fontWeight:"700"}}>Close while uploading</Text>
                    </TouchableOpacity>
                </View>
                }
            </>
            </Modal>
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
    startButton:{
        borderWidth:0,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:2,
        backgroundColor:"magenta",
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        backgroundColor:"white",
        zIndex:-1,
        justifyContent:"space-between",
        height:"80%",
        marginTop:"20%"
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
                    
                <ImageLoaderComponent 
                    w={50}
                    h={50}
                    imageStyle={{borderRadius:50}}
                    style={{borderRadius:50,borderColor:"magenta",borderWidth:1}}
                    data={{melanomaPictureUrl:"userData.melanomaPictureUrl"}}
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