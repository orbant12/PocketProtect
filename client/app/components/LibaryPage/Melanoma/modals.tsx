import { Mstyles, SingleSlugStyle,spotUpload_2_styles } from "../../../styles/libary_style"
import {View, Text,Pressable,TouchableOpacity} from "react-native"
import { SpotData } from "../../../utils/types"
import { MelanomaMetaData } from "../../../pages/Libary/Melanoma/melanomaCenter"

export const SkinModal = ({
    visible,
    melanomaMetaData,
    handleMelanomaDataChange,
    setSkinModal
}:{
    visible:boolean,
    melanomaMetaData:MelanomaMetaData,
    handleMelanomaDataChange:(key:string,value:any) => void,
    setSkinModal:(arg:boolean) => void
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

export function SureModal({
    moleToDelete,
    handleSpotDelete,
    setDeleteModal,
    visible
}:{
    moleToDelete:SpotData,
    handleSpotDelete:(moleToDelete:SpotData) => void,
    setDeleteModal:(arg:boolean) => void,
    visible:boolean

}){
    return(
        <>
        {visible &&
        <View style={SingleSlugStyle.modalOverlay}> 
        <View style={SingleSlugStyle.modalBox}>
            <View style={{alignItems:"center",padding:20}}>
                <Text style={{fontWeight:"700",fontSize:18,marginTop:10,textAlign:"center"}}>Are you sure about deleting {moleToDelete.storage_name}</Text>
                <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>It will be lost forever !</Text>
            </View>
            <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                <TouchableOpacity onPress={() => {moleToDelete != null && handleSpotDelete(moleToDelete)}} style={SingleSlugStyle.modalNoBtn}>
                    <Text style={{fontWeight:"700",color:"white"}}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={SingleSlugStyle.modalYesBtn} onPress={() => setDeleteModal(!visible)}>
                    <Text style={{fontWeight:"700",color:"black"}}>No</Text>
                </TouchableOpacity>

            </View>
        </View>
    </View>
        }
        </>
    )
}

export function SureModal_MoleUpload({
    moleToDeleteId,
    setIsModalUp,
    visible,
    handleSpotDelete
}){
    return(
        <>
    {visible && 
    <View style={spotUpload_2_styles.modalOverlay}> 
        <View style={spotUpload_2_styles.modalBox}>
            <View style={{alignItems:"center",padding:20}}>
                <Text style={{fontWeight:"700",fontSize:18,marginTop:10,textAlign:"center"}}>Are you sure about deleting {moleToDeleteId}</Text>
                <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>It will be lost forever !</Text>
            </View>
            <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                <TouchableOpacity onPress={() => {moleToDeleteId != "" && handleSpotDelete(moleToDeleteId)}} style={spotUpload_2_styles.modalNoBtn}>
                    <Text style={{fontWeight:"700",color:"white"}}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={spotUpload_2_styles.modalYesBtn} onPress={() => setIsModalUp(!visible)}>
                    <Text style={{fontWeight:"700",color:"black"}}>No</Text>
                </TouchableOpacity>

            </View>
        </View>
    </View>}
    </>
    )
}
