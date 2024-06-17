
import { View, Text, Image,TouchableOpacity} from "react-native"
import medic from "../../../../assets/assist/medic.png"
import { Navigation_AssistCenter } from "../../../../navigation/navigation"
import { styles_shadow } from "../../../../styles/shadow_styles"


export const AssistantAdvertBox = ({navigation}) => {
    return(
        <View style={[{width:"90%",marginTop:20,alignItems:"center",backgroundColor:"black",padding:0,borderRadius:10,flexDirection:"row",height:170,borderWidth:4,borderColor:"white"},styles_shadow.shadowContainer]}>
        <View style={{width:130,marginRight:15,padding:10}}>
            <Text style={{fontWeight:"700",fontSize:10,color:"white",opacity:0.4,position:"absolute",width:200,top:0,marginLeft:10,marginTop:5}}>Registered Dermotologists</Text>
            <Text style={{marginTop:5,fontWeight:"800",fontSize:16,color:"white",opacity:0.8,marginTop:20}}>Get Professional Help</Text>
            <TouchableOpacity onPress={() => Navigation_AssistCenter({navigation})} style={{width:"100%",borderWidth:1,padding:6,borderColor:"white",borderRadius:100,alignItems:"center",opacity:0.5,marginTop:20}}>
                <Text style={{color:"white",fontWeight:"600",fontSize:10,opacity:1}}>How it works ?</Text>
            </TouchableOpacity>
        </View>
        <Image 
            source={medic}
            style={{width:210,height:190}}
        />
    </View>
    )
}