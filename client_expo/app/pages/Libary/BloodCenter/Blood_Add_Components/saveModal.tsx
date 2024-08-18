import { Text, TouchableOpacity, View } from "react-native"
import { add_styles } from "../../../../styles/blood_styles"


export const SaveModal = ({saveCardModalActive,setSaveCardModalActive,handleSaveProgress}) => {
    return(
        <>
        {saveCardModalActive &&
            <View style={add_styles.modal}>
                <View style={add_styles.modalSaveCard}>      
                    <View style={{width:"100%",alignItems:"center"}}>
                        <Text style={{fontWeight:"700",fontSize:20,marginTop:20}}>Your Data is Saved Succesfully</Text>   
                    </View> 
        
                    <View style={{width:"60%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                        <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => {setSaveCardModalActive(!saveCardModalActive)}}>
                            <Text style={{color:"white",fontWeight:"500"}}>Go Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() =>  handleSaveProgress()}>
                            <Text style={{color:"black",fontWeight:"500"}}>Leave</Text>
                        </TouchableOpacity>                                    
                    </View> 
                </View>
            </View>
        }
        </>
    )
}