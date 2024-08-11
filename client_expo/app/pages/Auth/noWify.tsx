import LottieView from "lottie-react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { View,TouchableOpacity,Text, ActivityIndicator } from "react-native"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/UserAuthContext"
import { User } from "../../models/User"

const NoInternetConnectionPage = ({navigation,route}) => {

    // function handleReload(){
    //     navigation.navigate("AuthHub")
    // }

    const uid = route.params.uid

    const {melanoma} = useAuth()


    const [tries, setTries] = useState(5)
    // IF 0 'All retries exhausted. Please check your internet connection.'

    const handleReload = async () => {
        
        setTries(5)
        const user = new User(uid);

        
        const fetchDataWithRetries = async (attemptsLeft: number) => {
            try {
                const response = await user.fetchUserData(2);

                if (response) {
                    
                    if (attemptsLeft > 1) {
                        setTries(attemptsLeft - 1)
                        await fetchDataWithRetries(attemptsLeft - 1);
                    } else {
                        //'All retries exhausted. Please check your internet connection.'
                        setTries(0)
                    }
                } else {
                    navigation.navigate("AuthHub")
                }
            } catch (error) {

                if (attemptsLeft > 1) {
                    navigation.navigate("AuthHub")
                } else {
                    setTries(0)
                }
            }
        };

        await fetchDataWithRetries(5);
    };

    useEffect(() => {
        handleReload()
    },[])

    return(
        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
            <View style={{borderWidth:1,backgroundColor:"rgba(0,0,0,.9)",borderRadius:10,padding:30,width:"80%"}}>
                <LottieView 
                    source={require("../../components/Common/AnimationSheets/lotties/alert.json")}
                    style={{
                        width:"100%",
                        height:230,
                    }}
                    loop
                    autoPlay
                />
                <View style={[{width:"80%",flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"},tries == 0 && {width:"100%"}]}>
                    {tries != 0 &&
                        <ActivityIndicator />
                    }
                    <Text style={{color:"white",opacity:0.6,marginLeft:10,fontWeight:"800"}}>{tries != 0 ? `( ${tries} )` : null} <Text style={{fontWeight:"700",opacity:0.5}}>{tries != 0 ? "~ Request time out" : "All retries exhausted. Please check your internet connection"}</Text></Text>
                </View>
            </View>

            <View style={{width:"80%",backgroundColor:"rgba(0,0,0,0.9)",borderRadius:10,padding:20,alignItems:"center",justifyContent:"space-between",marginTop:"30%"}}>
            <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>
                No Internet Connection ...
            </Text>
            <View style={{width:"100%",alignItems:"center",flexDirection:"row"}}>
            <MaterialCommunityIcons
                name="information"
                size={30}
                color={"white"}
            />
            <Text style={{opacity:0.6,padding:10,margin:5,textAlign:"left",fontSize:12,color:"white",fontWeight:"500"}}>We're unable tonk nd kosndiknsk ndks kdns kndksn dknsk dnksnd ksndk nskdnsklnd ksn</Text>
            </View>
            {tries != 0 ?
            <TouchableOpacity onPress={() => handleReload()} style={{justifyContent:"center",alignItems:"center",width:"100%",padding:10,borderRadius:10,backgroundColor:"rgba(250,0,250,0.4)",borderWidth:1,borderColor:"magenta",opacity:0.3}}>
                <Text style={{fontWeight:"700",fontSize:15,color:"white",opacity:0.6}}>Searching for connection</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => handleReload()} style={{justifyContent:"center",alignItems:"center",width:"100%",padding:10,borderRadius:10,backgroundColor:"rgba(250,0,250,0.4)",borderWidth:1,borderColor:"magenta"}}>
                <Text style={{fontWeight:"700",fontSize:15,color:"white",opacity:0.6}}>Reload</Text>
            </TouchableOpacity>
            }
            </View>
        </View>
    )
}

export default NoInternetConnectionPage;