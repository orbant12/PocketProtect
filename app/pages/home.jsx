
//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';


export default function TabOneScreen({navigation}) {

const today = new Date();

const format = moment(today).format('YYYY-MM-DD')

const [selectedDate, setSelectedDate] = useState(format);

//<********************FUNCTIONS************************>

const handleNavigation  = (path) => {
    navigation.navigate(path)
}


    function TodayScreen() {
        return(
            <>
                <View style={styles.TodaySection}>
    <View style={styles.titleRow}>
        <Text style={styles.title}>Enviroment</Text>
        <Text style={styles.titleLeft}>Budapest</Text>
    </View>


    <View style={styles.TaskBox}>
        <Text style={styles.TaskTitle}>Higher Sensitivity to Migrate</Text>
        <Text style={styles.TaskSubTitle}>In you Location Budapest based on the mesures you are in a higher risk for experiencing headache today !</Text>

    </View>

                </View>

                <View style={styles.TodaySection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Today's Tasks</Text>
                        <Text style={styles.titleLeft}>0/1</Text>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable onPress={() => handleNavigation("DailyReport")} style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.TodaySection}>
                    <Text style={styles.title}>Personal Advice</Text>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="black" style={{marginLeft:10}} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.TodaySection}>
                    <Text style={styles.title}>News</Text>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Daily Health Report</Text>
                        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
                        <Pressable style={styles.StartButton}>
                            <Text>Start Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View>
                </View>
            </>
        )
    }

    function FutureScreen() {
        return(
            <View>

            </View>
        )
    }


return (
<ScrollView style={styles.container}>
    <Calendar onSelectDate={setSelectedDate} selected={selectedDate} today={format} todayDate={today} />
    <StatusBar style="auto" />
    {format == selectedDate ? 
    TodayScreen()
    :
    FutureScreen()
    }
</ScrollView>

);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //LINEAR GRADIENT MAGENTA TO WHITE
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingTop:50,
    },
    TodaySection: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        paddingBottom:20,
        borderRadius:20,
        width: '95%',
        marginTop: 20,
        marginLeft:"auto",
        marginRight:"auto"
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"white",
        margin: 10,
    },
    titleLeft: {
        fontSize: 11,
        opacity: 0.5,
        fontWeight: 100,
        margin: 10,
        color:"white",
    },
    TaskBox: {
        backgroundColor: '#1a1a1a', 
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    TaskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color:"#f2f2f2"
    },
    TaskSubTitle: {
        fontSize: 14,
        color: '#7a7a7a',
        marginTop:10
    },
    StartButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },

});