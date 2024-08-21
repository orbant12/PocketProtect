
import { useCallback, useEffect, useState } from 'react';
import { ScrollView,RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/UserAuthContext';
import Calendar from '../../components/HomePage/Callendar/HorizontalCallendar';
import {useTimer}  from '../../components/HomePage/timer';
import { styles } from "../../styles/home_style";
import { TodayScreen } from '../../components/HomePage/3_types/Today';
import { DateToString, parseDateToMidnight } from '../../utils/date_manipulations';
import { FutureScreen } from '../../components/HomePage/3_types/Future';
import { PastScreen } from '../../components/HomePage/3_types/Past';
import { Navigation_SingleSpotAnalysis } from '../../navigation/navigation';
import { SpotData } from '../../utils/types';


type CustomScrollEvent = {
    nativeEvent: {
        position: number;
    };
};

export type MonthlyTasksData = {
    date:Date,
    data:any
}

export type Home_Navigation_Paths = "risk" | "" | "unfinished" | "other";


export default function TabOneScreen({navigation}) {

//<==================<[ Variables ]>====================>

const { melanoma } = useAuth();
//DATE
const today: Date = new Date();
const format = DateToString(today);
const [selectedDate, setSelectedDate] = useState<string>(format);
//COUNTDOWN
const [dateCountdown, setDateCountdown] = useState<number>(10);
const [historyShown, setHistoryShown] = useState<boolean>(true);
const displayCounter = useTimer(dateCountdown,()=>{});
//DATA
const [thisMonthTasks, setThisMonthTasks] = useState<MonthlyTasksData[]>([]);
const [affectedDays, setAffectedDays] = useState<any[]>([]);
const [allReminders, setAllReminders] = useState<any[]>([]);
//H-SCROLL
const [currentPage, setCurrentPage] = useState<number>(0);
//REFRESH
const [refreshing, setRefreshing] = useState<boolean>(false);
const [outdatedMelanomaData, setOutdatedMelanomaData] = useState<SpotData[]>([]);
const [riskyMelanomaData, setRiskyMelanomaData] = useState<SpotData[]>([]);
const [unfinishedMelanomaData, setUnfinishedMelanomaData] = useState<SpotData[]>([]);

//<==================<[ Functions ]>====================>

    const handleNavigation  = ({path,data}:{path:Home_Navigation_Paths ; data: SpotData}) => {
        if (path == "other"){
            navigation.navigate(path,{data:[{q:"valami",type:"binary"}], outcomes:""}) // DAILY REPORT
        } else if ( path == "risk" || path == ""  || path == "unfinished" ){
            Navigation_SingleSpotAnalysis({
                melanomaId: data.melanomaId,
                skin_type: 0,
                navigation
            })
        } 
    }


    const handleScrollReminder = (e: CustomScrollEvent) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    }

    const ThisDayCounter = () => { 
        const selectedDateStr:string = String(selectedDate)
        const selectedDateF:Date = parseDateToMidnight(selectedDateStr);    

        // Convert dates to milliseconds
        const selectedDateMillis: number = selectedDateF.getTime();
        const todayMillis: number = today.getTime();
        const dateDiffMillis: number = selectedDateMillis - todayMillis;

        const calc = Math.floor(dateDiffMillis / 1000);
        if (calc > 0) { 
            setDateCountdown(calc);
            setHistoryShown(false)
        } else {
            setHistoryShown(true)
        }
    }

    const fetchAllSpots = async () => {
        if(melanoma != null){
            const response = melanoma.getSpecialMoles()
            setOutdatedMelanomaData(response.outdated);
            setRiskyMelanomaData(response.risky);
            setUnfinishedMelanomaData(response.unfinished);
        }
    }

    const handleLoadPage = () => {
        fetchAllSpots()
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
    },[melanoma])


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
            contentContainerStyle={{paddingBottom: 60}}
        >
            <Calendar affectedDays={affectedDays} onSelectDate={setSelectedDate} selected={selectedDate} today={format} todayDate={today} />
            <StatusBar style="auto" />
            {format == selectedDate ? 
                <TodayScreen 
                    handleNavigation={handleNavigation}
                    handleScrollReminder={handleScrollReminder}
                    allReminders={allReminders} 
                    currentPage={currentPage} 
                    date={format}
                    outdatedMelanomaData={outdatedMelanomaData}
                    riskyMelanomaData={riskyMelanomaData}
                    unfinishedMelanomaData={unfinishedMelanomaData}          
                    navigation={navigation}
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
