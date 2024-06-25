import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import { TagContainer } from "../../../Common/tagContainer"
import { styles_shadow } from "../../../../styles/shadow_styles"

export const AssistantBioBox = ({
    labels,
    index,
    setSelectedAssistant,
    assistantData,
}) => {
    return(
        <View key={index} style={[assist_styles.bio_box, styles_shadow.shadowContainer ,index == 0 && {marginTop:80}]}>
            {index == 0 &&
            <View style={{position:"absolute",top:-35,borderWidth:1,padding:10,borderRadius:100,paddingVertical:5,opacity:0.8,borderColor:"magenta"}}> 
                <Text style={{fontWeight:"600",color:"black",fontSize:10,opacity:0.5}}>Recommended</Text>
            </View>
            }
            <Text style={{position:"absolute",color:"white",opacity:0.8,right:20,top:20,fontWeight:"700"}}>5$ / Mole</Text>
            <Image 
                source={{uri:assistantData.profileUrl}}
                style={{width:150,height:150,borderRadius:100,borderWidth:3}}
            />
            <View style={{borderBottomWidth:0,borderColor:"white",paddingBottom:0,marginTop:5}}>
                <Text style={{ color:"white",fontWeight:"700",fontSize:20}}>{assistantData.fullname}</Text>
            </View>
                <TagContainer 
                    labels={labels}
                    style={{backgroundColor:"rgba(255,255,255,0.2)",margin:10,width:"100%"}}
                />
            <TouchableOpacity onPress={() => setSelectedAssistant(assistantData)} style={assist_styles.button}>
                <Text style={{color:"white"}}>Select</Text>
            </TouchableOpacity>
        </View>
    )
}

const assist_styles = StyleSheet.create({
    bio_box:{
        width:"80%", 
        borderRadius:30,
        borderWidth:0.5,
        marginTop:50,
        alignItems:"center",
        padding:20,
        justifyContent:"space-between",
        backgroundColor:"black",
        borderColor:"white"
    },
    button:{
        width:"100%",
        alignItems:"center",
        borderWidth:1,
        padding:10,
        borderRadius:30,
        borderColor:"white",
        backgroundColor:"rgba(255,255,255,0.08)"
    }
})