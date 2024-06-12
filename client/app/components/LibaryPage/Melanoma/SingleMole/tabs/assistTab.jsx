import { View,Text,ScrollView,StyleSheet,Image,TouchableOpacity } from "react-native"
import assistant from "../../../../../assets/assist/assistant.png"
import medic from "../../../../../assets/assist/medic.png"
import { AssistantAdvertBox } from "../../Assistance/assistantAdvert"

export const AssistTab = () => {
    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <AssistantAdvertBox />
            <AssistantBioBox />
        </View>
    )
}


const AssistantBioBox = () => {
    return(
        <View style={assist_styles.bio_box}>
            <Image 
                source={assistant}
                style={{width:150,height:150,borderRadius:100,borderWidth:3}}
            />
            <TouchableOpacity style={assist_styles.button}>
                <Text>Consult</Text>
            </TouchableOpacity>
        </View>
    )
}



const assist_styles = StyleSheet.create({
    bio_box:{
        width:"80%",
        height:300,
        borderRadius:30,
        borderWidth:1,
        marginTop:50,
        alignItems:"center",
        padding:20,
        justifyContent:"space-between"
    },
    button:{
        width:"100%",
        alignItems:"center",
        borderWidth:1,
        padding:10,
        borderRadius:30
    }
})