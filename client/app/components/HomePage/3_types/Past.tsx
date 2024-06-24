import { styles } from "../../../styles/home_style"
import { View,Text,Pressable,TouchableOpacity,Image } from "react-native"
import { TaskBox_2,TaskBox_1 } from "../taskBoxes"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"



export function PastScreen({
    selectedDate,
    handleNavigation,    
}) {
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
                        <Text style={styles.TaskTitle}>Blood Work Reminder</Text>
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

                    <TaskBox_1 />
            </View>
        </View>
        </View>
    )
}