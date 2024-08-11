import LottieView from "lottie-react-native"
import { View,TouchableOpacity,Text } from "react-native"

const NoInternetConnectionPage = () => {
    return(
        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
            <LottieView 
                source={require("../../components/Common/AnimationSheets/lotties/DoneAnimation.json")}
                style={{
                    width:100,
                    height:100
                }}
            />
            <Text style={{fontWeight:"700",fontSize:20}}>
                No Internet Connection ...
            </Text>

            <TouchableOpacity style={{width:"80%",padding:15,borderRadius:10,backgroundColor:"rgba(250,0,250,0.4)",borderWidth:1,borderColor:"magenta"}}>
                <Text style={{fontWeight:"700",fontSize:15}}>Reload</Text>
            </TouchableOpacity>

        </View>
    )
}

export default NoInternetConnectionPage;