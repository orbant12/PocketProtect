import { Text, TouchableOpacity, View } from "react-native";
import { add_styles } from "../../../../styles/blood_styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from "lottie-react-native";

export const ExitModal = ({isSaveModalActive,setIsSaveModalActive,handleBack,setSaveCardModalActive,saveCardModalActive,}) => {
    return(
        <>
        {isSaveModalActive &&
            <View style={add_styles.modal}>
                <View style={add_styles.modalCard}>
                <TouchableOpacity style={{backgroundColor:"black",width:30,height:30,position:"absolute",top:10,right:10,borderRadius:50,alignItems:"center",justifyContent:"center",borderWidth:0,padding:0}} onPress={() => setIsSaveModalActive(!isSaveModalActive)}>
                    <MaterialCommunityIcons 
                        name="close"
                        size={15}
                        color={"white"}
                    />
                </TouchableOpacity>
                    <LottieView 
                        source={require("../../../../components/Common/AnimationSheets/lotties/Warning.json")}
                        style={{
                            width:100,
                            height:100,
                            marginTop:20
                        }}         
                        autoPlay
                        loop       
                    />
                    <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,marginBottom:10}}>
                    <Text style={{fontWeight:"700",fontSize:21,borderWidth:0,paddingTop:0}}>You have unsaved data !</Text>
                    <Text style={{fontWeight:"700",fontSize:17,borderWidth:0,paddingTop:5,opacity:0.7}}>Do you want to save it ?</Text>
                    </View>
                    <View style={{width:"100%",flexDirection:"row-reverse",borderTopWidth:0.3,padding:5,paddingTop:15,alignItems:"flex-end"}}>
                        <TouchableOpacity style={{backgroundColor:"white",padding:12,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20,width:70}} onPress={() => {setSaveCardModalActive(!saveCardModalActive);setIsSaveModalActive(!isSaveModalActive)}}>
                            <Text style={{color:"black",fontWeight:"500"}}>Yes</Text>
                        </TouchableOpacity>    
                        <TouchableOpacity style={{backgroundColor:"red",padding:13,borderRadius:10,alignItems:"center",width:70}} onPress={() => handleBack("force")}>
                            <Text style={{color:"white",fontWeight:"600"}}>No</Text>
                        </TouchableOpacity>                      
                    </View> 
                </View>
            </View>
        }
        </>
    )
}