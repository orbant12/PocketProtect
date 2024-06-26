import { styles } from "../../styles/home_style"
import { View, Text, Pressable } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const TaskBox_2 = ({
    title,
    icon1, 
    icon2, 
    icon3, 
    icon4, 
    buttonText,
    nav_page,
    index,
    handleNavigation
}:
{
    title:string;
    icon1:string;
    icon2:string;
    icon3:string;
    icon4:string;
    buttonText:string;
    nav_page:string;
    index:number;
    handleNavigation:(path:string,data?:any) => void;
}) => {
    return(
        <View key={index} style={styles.DataBox}>
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
        <Pressable onPress={() => handleNavigation(nav_page, {type:"first"})} style={styles.StartButton}>
            <Text>{buttonText}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{ marginLeft: 10 }} />
        </Pressable>
        </View>
    )
}

export const TaskBox_1 = ({handleNavigation}:{handleNavigation:(path:string,data?:any) => void}) => {
    return(
        <View style={styles.TaskBox}>
        <Text style={styles.TaskTitle}>Daily Health Report</Text>
        <Text style={styles.TaskSubTitle}>Do your daily report so our AI model can have a better accuracy in detecting your problems !</Text>
        <Pressable onPress={() => handleNavigation("DailyReport")} style={styles.StartButton}>
            <Text>Start Now</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="magenta" style={{marginLeft:10}} />
        </Pressable>
        </View> 
    )
}