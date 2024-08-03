import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "react-native";


export function NotAllSlugModal({
    isModalUp,
    setIsModalUp,
    setProgress,
    progress,
    setCurrentSide
}){
    return(
        <View style={styles.modalOverlay}> 
        <View style={styles.modalBox}>
            <View style={{alignItems:"center",padding:20}}>
                <Text style={{fontWeight:"700",fontSize:18,marginTop:10}}>Not all body parts completed</Text>
                <Text style={{fontWeight:"400",fontSize:15,marginTop:10}}>Sure you want to proceed ?</Text>
            </View>
            <View style={{flexDirection:"row-reverse",width:"100%",borderTopWidth:1,padding:10,paddingRight:20}}>

                <Pressable style={styles.modalYesBtn} onPress={() => setIsModalUp(!isModalUp)}>
                    <Text style={{fontWeight:"700",color:"white"}}>No</Text>
                </Pressable>

                <Pressable onPress={() => {setProgress(progress + 0.1);setIsModalUp(!isModalUp);setCurrentSide("back")}} style={styles.modalNoBtn}>
                    <Text style={{fontWeight:"700"}}>Yes</Text>
                </Pressable>

            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
   
   
    
    modalBox:{
        position:"absolute",
        flexDirection:"column",
        justifyContent:"space-between",
        backgroundColor:"white",
        alignItems:"center",
        width:300,
        height:180,
        borderWidth:1,
        borderRadius:10,
        padding:0,
        shadowColor: '#171717',
        shadowOffset: {width: 4, height: -1},
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    modalYesBtn:{
        padding:5,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:60,
        height:40,
        alignItems:"center",
        marginLeft:30,

    },
    modalNoBtn:{
        padding:5,
        backgroundColor:"white",
        borderRadius:10,
        alignItems:"center",
        borderWidth:1,
        width:60,
        height:40,
        justifyContent:"center",
    },
    modalOverlay:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

})
