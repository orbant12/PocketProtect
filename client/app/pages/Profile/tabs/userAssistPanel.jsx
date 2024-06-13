import { View, Text, TouchableOpacity, Image, StyleSheet} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import medic from "../../../assets/assist/assistant.png"
import { AssistPanel_style } from "../../../styles/assistance_style"
import { SessionBar } from "../../../components/ProfilePage/assistancePanel/sessionBar"

const AssistPanel = ({
    navigation
}) => {
    return(
        <View style={AssistPanel_style.container}>
            <Text style={{fontWeight:"700",fontSize:25,opacity:0.8,marginVertical:30}}>Your Assistant Sessions</Text>
            <SessionBar 
                data={{answered:true,assistantData:{profileUrl:medic}}}
            />
        </View>
    )
}

export default AssistPanel;




