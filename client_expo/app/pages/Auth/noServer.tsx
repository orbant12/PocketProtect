import LottieView from "lottie-react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { View,TouchableOpacity,Text } from "react-native"

const NoServerPage = ({navigation}) => {

    function handleReload(){
        navigation.navigate("AuthHub")
    }

    return(
        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
            <LottieView 
                source={require("../../components/Common/AnimationSheets/lotties/alert.json")}
                style={{
                    width:"80%",
                    height:280,
                    borderWidth:1,
                    backgroundColor:"rgba(0,0,0,.9)",
                    borderRadius:10,
                    padding:30
                }}
                loop
                autoPlay
            />
            <View style={{width:"80%",backgroundColor:"rgba(0,0,0,0.9)",borderRadius:10,padding:20,alignItems:"center",justifyContent:"space-between",marginTop:"30%"}}>
            <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>
                Application is under maintanance ...
            </Text>
            <View style={{width:"100%",alignItems:"center",flexDirection:"row"}}>
            <MaterialCommunityIcons
                name="information"
                size={30}
                color={"white"}
            />
            <Text style={{opacity:0.6,padding:10,margin:5,textAlign:"left",fontSize:12,color:"white",fontWeight:"500"}}>We're unable tonk nd kosndiknsk ndks kdns kndksn dknsk dnksnd ksndk nskdnsklnd ksn</Text>
            </View>
            <TouchableOpacity onPress={() => handleReload()} style={{justifyContent:"center",alignItems:"center",width:"100%",padding:10,borderRadius:10,backgroundColor:"rgba(250,0,250,0.4)",borderWidth:1,borderColor:"magenta"}}>
                <Text style={{fontWeight:"700",fontSize:15,color:"white",opacity:0.6}}>Reload</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default NoServerPage;