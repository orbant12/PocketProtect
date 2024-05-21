
//BASIC IMPORTS
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image,Dimensions,RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';

import {useTimer}  from '../components/HomePage/timer';

import { fetchMonthTasks, fetchReminders } from '../server';



export default function TabOneScreen({navigation}) {

//<********************VARIABLE************************>

const { currentuser } = useAuth()

const today = new Date();

const format = moment(today).format('YYYY-MM-DD')

const [selectedDate, setSelectedDate] = useState(format);

const [ dateCountdown, setDateCountdown] = useState(10)
const [historyShown, setHistoryShown ] = useState(true)

const [thisMonthTasks, setThisMonthTasks] = useState([])
const [allReminders, setAllReminders] = useState([])



//<********************FUNCTIONS************************>

const handleNavigation  = (path) => {
    navigation.navigate(path,{data:[{q:"valami",type:"binary"}], outcomes:""})
}

const [currentPage, setCurrentPage] = useState(0);

const { width } = Dimensions.get('window');

const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.floor((offsetX + width / 2) / width);
    setCurrentPage(pageIndex);
}

const [currentPageReminder, setCurrentPageReminder] = useState(0);

const handleScrollReminder = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.floor((offsetX + width / 2) / width);
    setCurrentPageReminder(pageIndex);
}

function parseDateToMidnight(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0); // Set to midnight
}  

function splitDate(date){
    const [year, month, day] = date.split('-').map(Number);
    return {year,month,day}
}

const ThisDayCounter = () => { 
    const selectedDateStr = String(selectedDate)
    // Convert the date strings to Date objects
    const selectedDateF = parseDateToMidnight(selectedDateStr);
    
    const calc = Math.floor((selectedDateF - today) / 1000);

    if (calc > 0) { 
        setDateCountdown(calc);
        setHistoryShown(false)
    } else {
        setHistoryShown(true)
    }
}

const displayCounter = useTimer(dateCountdown);

useEffect(() =>{
    ThisDayCounter()
},[selectedDate])

// Inside your TabOneScreen component
const [refreshing, setRefreshing] = useState(false);
const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchThisMonthTasks()
    fetchAllReminders()
    setTimeout(() => {
        setRefreshing(false);
    }, 2000); // Example: setTimeout for simulating a delay
}, []);


const fetchThisMonthTasks = async () => {
    if(currentuser){
        const date = splitDate(format)       
        const response = await fetchMonthTasks({
            userId: currentuser.uid,
            month: date.month,
            year: date.year
        })
        if(response != false){
            setThisMonthTasks(response)
            console.log(response)
        }
    }
}

const fetchAllReminders = async () => {
    if(currentuser){
        const response = await fetchReminders({userId:currentuser.uid})
        if ( response != false ){
            setAllReminders(response)
        }
    }
}


useEffect(() => {
    fetchThisMonthTasks()
    fetchAllReminders()
},[])


//<********************COMPONETNS************************>

    const TaskBox = ({ title, icon1, icon2, icon3, icon4, buttonText,nav_page }) => (
        <View style={styles.DataBox}>
        <Text style={styles.TaskTitle}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
            name={icon1}
            color="white"
            size={20}
            style={{ marginRight: 10 }}
            />
            <Text style={styles.TaskSubTitle}>
            You can refer to your blood work when using our AI assistant and ask questions about it.
            </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
            name={icon2}
            color="white"
            size={20}
            style={{ marginRight: 10 }}
            />
            <Text style={[styles.TaskSubTitle, { marginTop: 10 }]}>
            We can detect any potential disorder based on the blood work and their relationships between other provided medical data.
            </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
            name={icon3}
            color="white"
            size={20}
            style={{ marginRight: 10 }}
            />
            <Text style={styles.TaskSubTitle}>
            We will assess your blood work and give you important insight and feedback for improving it.
            </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
            name={icon4}
            color="white"
            size={20}
            style={{ marginRight: 10, borderRightWidth: 2, borderColor: 'black' }}
            />
            <Text style={styles.TaskSubTitle}>
            We schedule reminders for outdated blood work and recommended update.
            </Text>
        </View>
        <Pressable onPress={() => navigation.navigate(nav_page)} style={styles.StartButton}>
            <Text>{buttonText}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{ marginLeft: 10 }} />
        </Pressable>
        </View>
    );

    const ReminderBox = ({data}) =>{
        return(
            <>
            {splitDate(data.expires).year > splitDate(format).year || (splitDate(data.expires).year == splitDate(format).year && splitDate(data.expires).month > splitDate(format).month) || 
            (splitDate(data.expires).year == splitDate(format).year && splitDate(data.expires).month == splitDate(format).month &&  splitDate(data.expires).day > splitDate(format).day)  ?
            <View style={styles.DataBox}>
                <Text style={styles.TaskTitle}>Blood work is up do date</Text>
                <Text style={[styles.TaskSubTitle,{color:"white",opacity:0.7}]}>You should update it in
                {((splitDate(data.expires).month - splitDate(format).month) + ((splitDate(data.expires).year - splitDate(format).year) * 12)) == 0 ?
                <Text style={{fontWeight:"700",color:"lightgreen",opacity:0.8}}> { splitDate(data.expires).day - splitDate(format).day} days</Text>
                    :
                <Text style={{fontWeight:"700",color:"lightgreen",opacity:0.8}}> {(splitDate(data.expires).month - splitDate(format).month) + ((splitDate(data.expires).year - splitDate(format).year) * 12)  } months</Text>
                }
                </Text>
                <Text style={styles.TaskSubTitle}>Medical research suggest to update your blood work annually for a healthy lifestyle</Text>
                <Pressable onPress={() => handleNavigation("DailyReport")} style={styles.StartButton}>
                    <Text>Schedule Now</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                </Pressable>
            </View>
            :
            <View style={styles.DataBox}>
                <Text style={styles.TaskTitle}>Blood Work Update</Text>
                <Text style={[styles.TaskSubTitle,{color:"white",opacity:0.7}]}>Your blood work is outdated since
                    {(((splitDate(data.expires).month - splitDate(format).month) + ((splitDate(data.expires).year - splitDate(format).year) * 12))* -1) == 0 ?
                        splitDate(format).day - splitDate(data.expires).day == 0 ? 
                            <Text style={{fontWeight:"700",color:"magenta",opacity:0.8}}> Today</Text>
                            :                                        
                            <Text style={{fontWeight:"700",color:"magenta",opacity:0.8}}> { splitDate(format).day - splitDate(data.expires).day} days</Text>
                    :
                    <Text style={{fontWeight:"700",color:"magenta",opacity:0.8}}> {((splitDate(data.expires).month - splitDate(format).month) + ((splitDate(data.expires).year - splitDate(format).year) * 12))* -1  } months</Text>
                    }                              
                </Text>
                <Text style={styles.TaskSubTitle}>Medical research suggest to update your blood work annually for a healthy lifestyle</Text>
                <Pressable onPress={() => handleNavigation("DailyReport")} style={[styles.StartButton,{marginTop:20}]}>
                    <Text>Schedule Now</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                </Pressable>
            </View>}
            </>
        )
    }

    function TodayScreen() {
        return(
            <>
            {allReminders.map((data) => (
                <View style={styles.TodaySection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Reminders</Text>
                        <Text style={styles.titleLeft}>{allReminders.length}</Text>
                    </View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleScrollReminder}               
                        contentContainerStyle={{justifyContent:"center",width:"400%"}}
                        scrollEventThrottle={16}  
                    >         
                    {data.id == "blood_work" && 
                        ReminderBox({data}) 
                    }
                    {data.id == "blood_work" && 
                        ReminderBox({data}) 
                    }               
                    {data.id == "blood_work" && 
                        ReminderBox({data}) 
                    }               
                    {data.id == "blood_work" && 
                        ReminderBox({data}) 
                    }                              
                    </ScrollView>
          
                    <View style={styles.IndicatorContainer}>               
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 0 ? 1 : 0.3 }]} />                     
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 1 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 2 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 3 ? 1 : 0.3 }]} />
                                
                    </View>
                </View>
            ))}            

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
                        <Pressable onPress={() => handleNavigation("SurveyScreen")} style={styles.StartButton}>
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

                <View style={[styles.DataSection]}>
                    <View style={{}}>
                        <Text style={{color:"white",opacity:0.3,fontWeight:"400",fontSize:11,paddingHorizontal:10,marginBottom:-10,paddingVertical:5}}>More data, better prediction</Text>
                        <Text style={styles.title}>Haven't added yet ...</Text>                     
                    </View>

                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleScroll}               
                        contentContainerStyle={{justifyContent:"center",width:"400%"}}
                        scrollEventThrottle={16}  
                    >         
                        <TaskBox 
                        title="Blood Work" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now"
                        nav_page="Add_BloodWork"
                        />
                        <TaskBox 
                        title="Allergies" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now" 
                        />
                        <TaskBox 
                        title="BMI" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now" 
                        />
                        <TaskBox 
                        title="Lifestyle" 
                        icon1="robot" 
                        icon2="magnify" 
                        icon3="doctor" 
                        icon4="calendar" 
                        buttonText="Add Now" 
                        />                 
                    </ScrollView>

                    <View style={styles.IndicatorContainer}>
                        <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPage === 2 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPage === 3 ? 1 : 0.3 }]} />
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
            <View style={{width:"100%",alignItems:"center"}}>                
            <View style={{width:"90%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",height:90,justifyContent:"center",borderRadius:10}}>
                <Text style={{marginBottom:10,fontWeight:"600",opacity:0.3}}>Not avalible yet</Text>
                <Text style={{fontSize:20,fontWeight:"700"}}>
                    {displayCounter}
                </Text>
            </View>
            <View>
            {thisMonthTasks.map((data)=>(
                data.id == selectedDate &&
                
                <View style={styles.TodaySection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Schedule</Text>
                        <Text style={styles.titleLeft}>0/1</Text>
                    </View>

                    <View style={styles.TaskBox}>
                        <Text style={styles.TaskTitle}>Blood Work Update</Text>
                        <Text style={[styles.TaskSubTitle,{color:"white",opacity:0.7}]}>You haven't updated your blood work in <Text style={{fontWeight:"700",color:"magenta",opacity:0.8}}>{"12"} days</Text></Text>
                        <Text style={styles.TaskSubTitle}>Medical research suggest to update your blood work every 6 months for a healthy lifestyle</Text>
                        <Pressable onPress={() => handleNavigation("DailyReport")} style={styles.StartButton}>
                            <Text>Schedule Now</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                        </Pressable>
                    </View> 
                </View>
            ))}
            

                <View style={styles.TodaySection}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{selectedDate} Tasks</Text>
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
                </View>
            </View>
            </View>
        )
    }

    function PastScreen() {
        return(
            <View style={{width:"100%",alignItems:"center"}}>                
            <View style={{width:"90%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",height:90,justifyContent:"center",borderRadius:10}}>
                <Text style={{marginBottom:10,fontWeight:"600",opacity:0.3}}>What happened on</Text>
                <Text style={{fontSize:20,fontWeight:"700"}}>
                    {selectedDate}
                </Text>
            </View>
            <View>

                <View style={styles.TodaySection}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Schedule</Text>
                            <Text style={styles.titleLeft}>0/1</Text>
                        </View>

                        <View style={styles.TaskBox}>
                            <Text style={styles.TaskTitle}>Blood Work Update</Text>
                            <Text style={[styles.TaskSubTitle,{color:"white",opacity:0.7}]}>You haven't updated your blood work in <Text style={{fontWeight:"700",color:"magenta",opacity:0.8}}>{"12"} days</Text></Text>
                            <Text style={styles.TaskSubTitle}>Medical research suggest to update your blood work every 6 months for a healthy lifestyle</Text>
                            <Pressable onPress={() => handleNavigation("DailyReport")} style={styles.StartButton}>
                                <Text>Schedule Now</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
                            </Pressable>
                        </View> 
                </View>

                <View style={styles.TodaySection}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{selectedDate} Tasks</Text>
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
                </View>
            </View>
            </View>
        )
    }

    return (
    <ScrollView style={styles.container}
    refreshControl={
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          colors={['magenta']} // Color for the refresh indicator
          tintColor={'magenta'} // Color for the refresh indicator          
        />
    }>
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} today={format} todayDate={today} />
        <StatusBar style="auto" />
        {format == selectedDate ? 
        TodayScreen()
        :
        !historyShown?
            FutureScreen()
            :
            PastScreen()
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
    DataSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        padding: 10,
        paddingBottom:20,
        borderRadius:5,
        width: '95%',
        marginTop: 20,
        marginLeft:"auto",
        marginRight:"auto",
        justifyContent: 'center',
        flex:1
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
        marginRight:"auto",
        justifyContent: 'center',
        
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
    TaskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color:"#f2f2f2"
    },
    TaskSubTitle: {
        fontSize: 14,
        color: '#7a7a7a',
        marginTop:10,
        maxWidth:"90%",
        textAlign:"left"        
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
    TaskBox: {
        width:"95%",
        padding: 10,
        backgroundColor: '#1a1a1a', 
        margin: 10,
        justifyContent:"center",
        borderRadius: 10,  
      },
      DataBox: {
        width:301,
        padding: 13,
        backgroundColor: '#1a1a1a', 
        margin: 17,
        borderRadius: 10,  
      },
      IndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
      Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'white',
        borderRadius: 3,
        marginHorizontal: 5,
      },

});