
//BASICS
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image  } from 'react-native';
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//Time
import moment from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import CalendarNoLabel from '../components/HomePage/HorizontalCallendarNoLabel';
import Body from "react-native-body-highlighter";


const ForYouPage = ({navigation}) => {


//<********************VARIABLES************************>
    const today = new Date();

    const format = moment(today).format('YYYY-MM-DD')

    const [selectedDate, setSelectedDate] = useState(format);

    const [swipeActive, setSwipeActive] = useState("data");

    const [userData , setUserData] = useState({"melanoma": { 
        gender : "female",
    }
    });

const [selectedSide, setSelectedSide] = useState("front");

//<********************FUNCTIONS************************>



//<******************** MELANOMA ************************>

function MelanomaMonitoring(){
    return(
        <View style={Mstyles.MelanomaMonitorSection}>
            <View style={Mstyles.melanomaTitle}>
                <View style={Mstyles.melanomaTitleLeft}>
                    <Text style={Mstyles.melanomaTag}>Computer Vision</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Melanoma Monitoring</Text>
                    <Text style={{fontSize:15}}>Click on the body part for part analasis</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
            <Body
                data={[
                { slug: "chest", intensity: 1 },
                { slug: "neck", intensity: 2 },
                ]}
                gender={userData.melanoma.gender}
                side={selectedSide}
                scale={1.1}
                //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                colors={{ 0: "#FF0000", 1: "#00FF00", 2: "#0000FF" }}
                onBodyPartPress={(slug) => navigation.navigate("BodyPartAnalasis", { data: slug.slug })}
                zoomOnPress={true}
            />

            <View style={Mstyles.colorExplain}>
                <View style={Mstyles.colorExplainRow} >
                    <View style={Mstyles.redDot} />
                    <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Higher risk</Text>
                </View>

                <View style={Mstyles.colorExplainRow}>
                    <View style={Mstyles.greenDot} />
                    <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>No risk</Text>
                </View>
            </View>

            <View style={Mstyles.positionSwitch}>
                <Pressable onPress={() => setSelectedSide("front")}>
                    <Text style={selectedSide == "front" ? {fontWeight:600}:{opacity:0.5}}>Front</Text>
                </Pressable>
                <Text>|</Text>
                <Pressable onPress={() => setSelectedSide("back")}>
                    <Text style={selectedSide == "back" ? {fontWeight:600}:{opacity:0.5}}>Back</Text>
                </Pressable>
            </View>

            <View style={Mstyles.analasisSection}>
                <View style={Mstyles.melanomaTitle}>
                    <View style={Mstyles.melanomaTitleLeft}>
                        <Text style={styles.titleTag}>Artifical Inteligence</Text>
                        <Text style={{fontSize:20,fontWeight:'bold'}}>Analasis</Text>
                        <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                    </View>
                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{marginLeft:10}}
                    />
                </View>
                <View style={Mstyles.melanomaBox}>
                    <Text style={{fontSize:20,fontWeight:700}}>ID</Text>
                    <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Location: Neck</Text>
                    <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Risk probability: 0.6</Text>
                    <Pressable style={Mstyles.showMoreBtn} onPress={() => navigation.navigate("SinglePartAnalasis",{ data: "Birthmark#3"})}>
                        <Text style={{fontSize:15,fontWeight:500,opacity:0.7}}>Show Analasis</Text>
                    </Pressable>
                    <View style={Mstyles.redDotLabel} />

                </View>
            </View>
        </View>
    )

}

const Mstyles = StyleSheet.create({
    MelanomaMonitorSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
        flex:1,
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'red',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#00FF00',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    colorExplain: {
        flexDirection: 'column',
        alignItems: 'left',
        position: 'absolute',
        marginTop: 10,
        top: 280,
        left: 20,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 100,
        left: 0,
    },
    melanomaTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
        width: "43%",
        marginBottom: 5,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 10,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
    
    },
    analasisSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 30,
    },
    melanomaBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginBottom: 30,
    },
    showMedicalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },
    melanomaTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '95%',
    },
    melanomaTitleLeft: {
        flexDirection: 'column',
        width: '60%',
        justifyContent:'space-between',
    },
    redDotLabel: {
        width: 40,
        height: 40,
        borderRadius: 0,
        borderTopRightRadius: 10,
        borderBottomLeftRadius:20,
        backgroundColor: 'red',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'gray',
        top: 0,
        right: 0,
    },
    showMoreBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },


})


//<******************** SCORE ************************>

function DataSection(){
    return(
        <View>
        <View style={styles.personalScoreSection}>

            <View style={styles.scoreTitle}>
                <View style={styles.scoreTitleLeft}>
                    <Text style={styles.titleTag}>Artifical Inteligence</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Personal Score</Text>
                    <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
            <View style={styles.scoreCircle}>
                <Text style={{fontSize:50,fontWeight:'bold'}}>17</Text>
                <Text style={{fontSize:15,fontWeight:700}}>out of 100</Text>

            </View>

            <View style={styles.ResultsScoreSection}>
                <View style={styles.ResultsScoreTitleRow}>
                    <Text style={{fontSize:18,fontWeight:700}}>Results</Text>
                    <Pressable onPress={() => navigation.navigate("Assistant")}>
                        <Text style={{fontSize:13,fontWeight:500,opacity:0.7}}>My Data</Text>
                    </Pressable>
                </View>
                <ScrollView horizontal style={{paddingBottom:20}} >
                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>


        <View style={styles.DetectionSection}>
            <View style={styles.ResultsScoreTitleRow}>
            <View style={styles.scoreTitle}>
            <View style={styles.scoreTitleLeft}>
                <Text style={styles.titleTag}>Digital and Downloadable</Text>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Medical Data</Text>
                <Text style={{fontSize:15}}>Find your medical records any time all in one place</Text>   
            </View>
            <MaterialCommunityIcons
                name="information-outline"
                size={30}
                color="black"
                style={{marginLeft:10}}
            />
        </View>
            </View>
                <View style={styles.DetectBox}>
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Blood Work</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.DetectBox}>
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Allergies</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.DetectBox}>
                    <View style={styles.DataCol}>
                        <Text style={styles.BoxTitle}>Allergies</Text>
                        <Text style={styles.BoxPoint}>Test Date: 2003.11.17</Text>
                        <Text style={styles.BoxPoint}>Repeat Recommended: in <Text style={{fontWeight:800}}>30 days</Text></Text>
                    </View>

                    <Pressable style={styles.showMedicalBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color="black"
                            style={{marginRight:10}}
                        />
                        <Text>Show</Text>
                    </Pressable>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>
        </View>
        </View>
    )
}


//<******************** BASE ************************>

return(

    <ScrollView style={styles.container}>
        <CalendarNoLabel onSelectDate={setSelectedDate} selected={selectedDate} />
        <StatusBar style="auto" />
        {!swipeActive == "data" ?
            <DataSection/>
            :
            <MelanomaMonitoring/>
        }
            
    </ScrollView>

)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:50,
        width: '100%',
    },
    personalScoreSection: {
        padding: 20,
        borderBottomColor: 'black',
        alignItems: 'center',
        maxWidth: '100%',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    scoreTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    scoreTitleLeft: {
        flexDirection: 'column',
        width: '55%',
        justifyContent:'space-between',
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'black',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    //RESULTS
    ResultsScoreSection: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        marginTop: 20,
    },
    ResultsScoreTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    ResultsScoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    ResultBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },
    BoxTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom:5,
        margin: 5,
    },
    BoxPoint: {
        fontSize: 12,
        fontWeight: 'bold',
        margin:5
    },
    //DETECTION
    DetectionSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
    },
    DataCol: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        margin:5,
        marginLeft:20,
    },
    DetectBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginBottom: 30,
    },
    showMedicalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },

});



export default ForYouPage;