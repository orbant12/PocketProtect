//ALL REMINDERS
import PagerView from 'react-native-pager-view';
import { View, Text,Pressable } from 'react-native';
import { styles } from '../app/styles/home_style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { splitDate } from '../app/utils/date_manipulations';
import { SpotData } from '../app/utils/types';
import { Home_Navigation_Paths } from '../app/pages/Home/home';
import { TaskBox_1 } from '../app/components/HomePage/taskBoxes';
const All_Reminders = ({
    allReminders,
    format,
    handleNavigation,
    currentPageReminder,
    handleScroll
}:{
    allReminders:any;
    format:string;
    handleNavigation:({path,data}:{path:Home_Navigation_Paths, data:SpotData}) => void;
    currentPageReminder:number;
    handleScroll:({nativeEvent}:{nativeEvent: {position:number}}) => void;
}
) => {
    return(
        <>
        {allReminders.map((data:any,index:number) => (
            <View key={index} style={styles.TodaySection}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Blood Work</Text>
                    <View style={styles.titleLeft}>
                        <MaterialCommunityIcons 
                            name="water-plus"
                            color={"white"}                            
                            size={30}
                        />
                    </View>
                </View>    
                <PagerView style={{marginTop:10,height:220 }} onPageScroll={(e) => handleScroll(e)} initialPage={0}>    
                {data.id == "blood_work" && 
                    <ReminderBox data={data} format={format} handleNavigation={handleNavigation} />
                }
                {data.id == "blood_work" && 
                    <ReminderBox data={data} format={format} handleNavigation={handleNavigation} />
                }               
                {data.id == "blood_work" && 
                    <ReminderBox data={data} format={format} handleNavigation={handleNavigation} />
                }               
                {data.id == "blood_work" && 
                    <ReminderBox data={data} format={format} handleNavigation={handleNavigation} />
                }   
                </PagerView>                                                  
                    <View style={styles.IndicatorContainer}>               
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 0 ? 1 : 0.3 }]} />                     
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 1 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 2 ? 1 : 0.3 }]} />
                        <View style={[styles.Indicator, { opacity: currentPageReminder === 3 ? 1 : 0.3 }]} />                                    
                    </View>
            </View>
        ))} 
        </>
    )
}

const ReminderBox = ({data,format,handleNavigation}:{data:any;format:string; handleNavigation:({path,data}:{path:Home_Navigation_Paths, data:SpotData}) => void;}) =>{
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
            <Pressable  style={styles.StartButton}>
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
            <Pressable  style={[styles.StartButton,{marginTop:20}]}>
                <Text>Schedule Now</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
            </Pressable>
        </View>}
        </>
    )
}


//TODAY TASKS

const TodayTasks = ({
    handleNavigation
}:{
    handleNavigation:({path,data}:{path:Home_Navigation_Paths, data:SpotData}) => void;
}) => {
    return(
        <View style={styles.TodaySection}>
        <View style={styles.titleRow}>
            <Text style={styles.title}>Today's Tasks</Text>
            <Text style={styles.titleLeft}>0/1</Text>
        </View>
        <TaskBox_1 
            handleNavigation={handleNavigation}
        />

        <View style={styles.TaskBox}>
            <Text style={styles.TaskTitle}>Jaudance Diagnosis</Text>
            <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
            <Pressable style={styles.StartButton}>
                <Text>Start Now</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
            </Pressable>
        </View>
    </View>
    )
}