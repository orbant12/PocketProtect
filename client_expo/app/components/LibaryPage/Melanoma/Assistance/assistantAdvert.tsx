
import { View, Text, Image,TouchableOpacity} from "react-native"
const medic = require('../../../../assets/assist/medic.png');
import { Navigation_AssistCenter } from "../../../../navigation/navigation"
import { styles_shadow } from "../../../../styles/shadow_styles"


export const AssistantAdvertBox = ({navigation}:{navigation?:any}) => {
    return(
        <View style={[{width:"90%",marginTop:20,alignItems:"center",backgroundColor:"black",padding:0,borderRadius:10,flexDirection:"row",height:170,borderWidth:4,borderColor:"white"},styles_shadow.shadowContainer]}>
        <View style={{width:130,marginRight:15,padding:10}}>
            <Text style={{fontWeight:"700",fontSize:10,color:"white",opacity:0.4,position:"absolute",width:200,top:0,marginLeft:10,marginTop:5}}>Registered Dermotologists</Text>
            <Text style={{fontWeight:"800",fontSize:16,color:"white",opacity:0.8,marginTop:20}}>Get Professional Help</Text>
            <TouchableOpacity onPress={() => navigation != undefined ?  alert("We have no professional yet, but we are going to make it happen very soon !") : {}} style={[{width:"150%",borderWidth:2,padding:8,borderColor:"white",borderRadius:100,alignItems:"center",opacity:1,marginTop:20,zIndex:100,backgroundColor:"black"},styles_shadow.hightShadowContainer]}>
                <Text style={{color:"white",fontWeight:"800",fontSize:12,opacity:1}}>Not Avalible Yet !</Text>
            </TouchableOpacity>
        </View>
        <Image 
            source={medic}
            style={{width:210,height:190,position:"absolute",right:0,zIndex:-1}}
        />
    </View>
    )
}
//<Text style={{color:"white",fontWeight:"800",fontSize:12,opacity:1}}>Get Assistance Now !</Text>
//<TouchableOpacity onPress={() => navigation != undefined ?  Navigation_AssistCenter({navigation}) : {}} style={[{width:"150%",borderWidth:2,padding:8,borderColor:"white",borderRadius:100,alignItems:"center",opacity:1,marginTop:20,zIndex:100,backgroundColor:"black"},styles_shadow.hightShadowContainer]}>