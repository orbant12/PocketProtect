//<***********************************>
//LAST EDITED: 2023.12.06
//EDITED BY: Orban Tamas
//DESC: This page is the general settings page, it shows the settings based on the selected category
//<***********************************>

//BASIC IMPORTS
import React, { useState } from 'react'
import { Modal } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { sendPasswordResetEmail } from "@firebase/auth"
//ICONS
import { Icon } from 'react-native-elements';
import { UserDataChange } from './userDataChange';
import { UserDelete } from './deleteUser';
import { ChangePass } from './changePass';
import { useAuth } from '../../../../context/UserAuthContext';
import { auth } from '../../../../services/firebase';


const GeneralSettings = ({ route, navigation }) => {

    //GET DATA FROM ROUTE
    const settingsData = route.params.data
    const [selectedChange, setSelectedChange] = useState<"userData" | "changePass" | "deleteUser" | null>(null);
    const {currentuser} = useAuth();

    //<**********************FUNCTIONS******************************>

    //OPEN BOTTOM SHEET
    const openBottomSheet = () => {
        alert("Password")
    }

    //EPISODE EDIT NAVIGATION
    const handleEpisodeEditNavigation = () => {
        navigation.navigate("EpisodeEdit")
    }

    return (
        <>
        <View style={styles.container}>
            {/* ACCOUNT DETAILS */}
            {settingsData === "Account" ? (
                <View style={styles.colContainer}>
                    <TouchableOpacity onPress={() => setSelectedChange("userData")} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Change User Data</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => sendPasswordResetEmail(auth,currentuser.email)} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Change Password</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedChange("deleteUser")} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Delete Account</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>
                </View>
            ) : null}
            {/* CREATOR PANEL */}
            {settingsData === "Creator Panel" ? (
                <View style={styles.colContainer}>
                    <TouchableOpacity onPress={handleEpisodeEditNavigation} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Episodes</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openBottomSheet} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Analitics</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Channel Details</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Income</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Contract</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>
                </View>
            ) : null}
            {/* PRIVACY */}
            {settingsData === "Privacy" ? (
                <View style={styles.colContainer}>
                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>User Information</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openBottomSheet} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Password</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Delete Account</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>
                </View>
            ) : null}
            {/* SECURITY */}
            {settingsData === "Security" ? (
                <View style={styles.colContainer}>
                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>User Information</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openBottomSheet} style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Password</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.topicRow}>
                        <Text style={{ marginRight: 120, fontWeight: "600", fontSize: 15 }}>Delete Account</Text>
                        <Icon
                            name='arrow-forward-ios'
                            type='material'
                            color='black'
                            size={20}
                            style={{ opacity: 0.8 }}
                        />
                    </TouchableOpacity>
                </View>
            ) : null}

        </View>
        <Modal animationType='slide' visible={selectedChange != null} >
        <TouchableOpacity onPress={() =>setSelectedChange(null)} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.86)",borderWidth:2,borderColor:"gray",paddingVertical:10,borderRadius:10,width:"100%",alignSelf:"center",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
          <MaterialCommunityIcons 
            name='close'
            size={25}
            color={"white"}
          />
          <Text style={{color:"white",fontWeight:"800",fontSize:16,marginLeft:10,marginRight:10}}>Close</Text>
        </TouchableOpacity>
            {selectedChange == "userData" &&
                <UserDataChange />
            }
            {selectedChange == "changePass" &&
                <ChangePass />
            }
            {selectedChange == "deleteUser" &&
                <UserDelete />
            }
        </Modal>
        </>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: "center",
        backgroundColor: "white"
    },
    topicRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        padding: 20,
        borderBottomWidth: 0.3,
        borderColor: "gray",
        marginRight: "auto",
        marginLeft: "auto",

    },
    colContainer: {
        width: "100%",
        marginTop: 30
    }
})

export default GeneralSettings