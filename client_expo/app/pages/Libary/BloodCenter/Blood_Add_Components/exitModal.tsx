import { Text, TouchableOpacity, View } from "react-native";
import { add_styles } from "../../../../styles/blood_styles";

export const ExitModal = ({isSaveModalActive,setIsSaveModalActive,handleBack,setSaveCardModalActive,saveCardModalActive,}) => {
    return(
        <>
        {isSaveModalActive &&
            <View style={add_styles.modal}>
                <View style={add_styles.modalCard}>
                    <Text style={{fontWeight:"700",fontSize:17,borderWidth:0,paddingTop:30}}>Your provided data is going to be lost. Do you want to save it ?</Text>
                    <View style={{width:"100%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                        <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => setIsSaveModalActive(!isSaveModalActive)}>
                            <Text style={{color:"white",fontWeight:"500"}}>Go Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:100}} onPress={() => {setSaveCardModalActive(!saveCardModalActive);setIsSaveModalActive(!isSaveModalActive)}}>
                            <Text style={{color:"black",fontWeight:"500"}}>Yes</Text>
                        </TouchableOpacity>    
                        <TouchableOpacity style={{backgroundColor:"red",padding:10,borderRadius:10,alignItems:"center",}} onPress={() => handleBack(true)}>
                            <Text style={{color:"white",fontWeight:"600"}}>No</Text>
                        </TouchableOpacity>                      
                    </View> 
                </View>
            </View>
        }
        </>
    )
}