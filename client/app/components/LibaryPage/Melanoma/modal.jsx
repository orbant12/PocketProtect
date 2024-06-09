import { Mstyles } from "../../../styles/libary_style"
import {View, Text,Pressable,TouchableOpacity} from "react-native"

export const SkinModal = ({
    visible,
    melanomaMetaData,
    handleMelanomaDataChange,
    setSkinModal
}) => {
    return(
        <>
        {visible &&
        <View style={Mstyles.modalOverlay}> 
        <View style={Mstyles.modalBox}>
            <View style={{marginTop:30,alignItems:"center"}}>  
                <Text style={{fontWeight:"700",fontSize:20,backgroundColor:"white"}}>What is your skin type ?</Text>        
            </View>
            <View style={{flexDirection:"row",width:"85%",justifyContent:"space-between",alignItems:"center",marginBottom:10,marginTop:10}}>
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",0)} style={[{ backgroundColor:"#fde3ce"}, melanomaMetaData.skin_type == 0 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                    
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",1)} style={[{ backgroundColor:"#fbc79d"},melanomaMetaData.skin_type  == 1 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                                    
            </View>

            <View style={{flexDirection:"row",width:"85%",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",2)} style={[{ backgroundColor:"#934506"},melanomaMetaData.skin_type  == 2 ? Mstyles.skinTypeOptionButtonA: Mstyles.skinTypeOptionButton]} />                
                <Pressable onPress={() => handleMelanomaDataChange("skin_type",3)} style={[{ backgroundColor:"#311702"},melanomaMetaData.skin_type == 3 ? Mstyles.skinTypeOptionButtonA : Mstyles.skinTypeOptionButton]} />                
            </View>
            <TouchableOpacity onPress={() => setSkinModal(!visible)} style={Mstyles.startButton}>
                <Text style={{padding:15,fontWeight:"600",color:"white"}}>Done</Text>
            </TouchableOpacity>
        </View>
        </View>
        }
        </>
    )
}