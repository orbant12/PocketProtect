
import { useCallback, useEffect, useState } from 'react';
import { ScrollView,Dimensions,RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/UserAuthContext';
import Calendar from '../../components/HomePage/Callendar/HorizontalCallendar';
import {useTimer}  from '../../components/HomePage/timer';
import { fetchMonthTasks, fetchReminders,fetchOutDatedSpots,fetchRiskySpots, fetchUnfinishedSpots, fetchUserData } from '../../services/server';
import { styles } from "../../styles/home_style";
import { TodayScreen } from '../../components/HomePage/3_types/Today';
import { DateToString, splitDate, parseDateToMidnight } from '../../utils/date_manipulations';
import { FutureScreen } from '../../components/HomePage/3_types/Future';
import { PastScreen } from '../../components/HomePage/3_types/Past';
import { Navigation_SingleSpotAnalysis } from '../../navigation/navigation';


export default function TabOneScreen({navigation}) {

//<==================<[ Variables ]>====================>

const { currentuser } = useAuth()
//DATE
const today = new Date();
const format = DateToString(today)
const [selectedDate, setSelectedDate] = useState(format);
//COUNTDOWN
const [ dateCountdown, setDateCountdown] = useState(10)
const [historyShown, setHistoryShown ] = useState(true)
const displayCounter = useTimer(dateCountdown);
//DATA
const [thisMonthTasks, setThisMonthTasks] = useState([])
const [affectedDays,setAffectedDays] = useState([])
const [allReminders, setAllReminders] = useState([])
//H-SCROLL
const [currentPage, setCurrentPage] = useState(0);
const [currentPageReminder, setCurrentPageReminder] = useState(0);
//REFRESH
const [refreshing, setRefreshing] = useState(false);
const [ outdatedMelanomaData, setOutdatedMelanomaData ] = useState([])
const [ riskyMelanomaData, setRiskyMelanomaData ] = useState([])
const [ unfinishedMelanomaData, setUnfinishedMelanomaData ] = useState([])
const [ userData, setUserData] = useState([])


//<==================<[ Functions ]>====================>

    const handleNavigation  = (path,data) => {
        if (path == "dasdas"){
            navigation.navigate(path,{data:[{q:"valami",type:"binary"}], outcomes:""}) // DAILY REPORT
        } else if ( path == "risk" || path == ""  || path == "unfinished" ){
            Navigation_SingleSpotAnalysis({
                melanomaId: data.melanomaId,
                userData: userData,
                gender: userData.gender,
                skin_type: 0,
                navigation
            })
        } 
    }

    const handleScroll = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPageReminder(page);
    }

    const handleScrollReminder = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    }

    const ThisDayCounter = () => { 
        const selectedDateStr = String(selectedDate)
        const selectedDateF = parseDateToMidnight(selectedDateStr);    
        const calc = Math.floor((selectedDateF - today) / 1000);
        if (calc > 0) { 
            setDateCountdown(calc);
            setHistoryShown(false)
        } else {
            setHistoryShown(true)
        }
    }

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
                setAffectedDays(response.map(singleDate => singleDate.date));
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

    const fetchAllSpots = async () => {
        if(currentuser){
            const response = await fetchOutDatedSpots({
                userId: currentuser.uid,            
            });
            const melanomaData = response;
            if(melanomaData != false){
                setOutdatedMelanomaData(melanomaData);
            } else {
                setOutdatedMelanomaData([])
            }
            const responseRisk = await fetchRiskySpots({
                userId: currentuser.uid,            
            });
            const melanomaDataRisk = responseRisk;
            if(melanomaDataRisk != false){
                setRiskyMelanomaData(melanomaDataRisk);
            } else {
                setRiskyMelanomaData([])
            }
            const responseUnf = await fetchUnfinishedSpots({
                userId: currentuser.uid,            
            });
            const melanomaDataUnf = responseUnf;
            if(melanomaDataUnf != false){
                setUnfinishedMelanomaData(melanomaDataUnf);
            } else {
                setUnfinishedMelanomaData([])
            }
        }
    }

    const fetchAllUserData = async () =>{
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response)
    }

    const handleLoadPage = () => {
        fetchThisMonthTasks()
        fetchAllReminders()
        fetchAllSpots()
        fetchAllUserData()
    }

    useEffect(() =>{
        ThisDayCounter()
    },[selectedDate])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleLoadPage()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Example: setTimeout for simulating a delay
    }, []);

    useEffect(() => {
        handleLoadPage()
    },[])


//<==================<[ Main Return ]>====================> 

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['magenta']}
                    tintColor={'magenta'}
                />
            }
        >
            <Calendar affectedDays={affectedDays} onSelectDate={setSelectedDate} selected={selectedDate} today={format} todayDate={today} />
            <StatusBar style="auto" />
            {format == selectedDate ? 
                <TodayScreen 
                    handleNavigation={handleNavigation}
                    handleScrollReminder={handleScrollReminder}
                    allReminders={allReminders} 
                    currentPage={currentPage} 
                    currentPageReminder={currentPageReminder}
                    handleScroll={handleScroll}
                    format={format}
                    outdatedMelanomaData={outdatedMelanomaData}
                    riskyMelanomaData={riskyMelanomaData}
                    unfinishedMelanomaData={unfinishedMelanomaData}                    
                />
            :
            !historyShown?
                <FutureScreen 
                    handleNavigation={handleNavigation} 
                    thisMonthTasks={thisMonthTasks}
                    displayCounter={displayCounter}
                    selectedDate={selectedDate}
                />
                :
                <PastScreen 
                    selectedDate={selectedDate}
                    handleNavigation={handleNavigation}
                />
            }
        </ScrollView>
    );
}