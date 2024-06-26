import { View,TouchableOpacity,Text, StyleSheet } from "react-native"

export const DiagnosisBox_Pressable = ({
    data,
    handleOpenFromProgress
}) => {
    return(
        <TouchableOpacity onPress={() => handleOpenFromProgress(data)} style={styles.diagnosisBox}>
        <View>
            <Text style={{fontWeight:"700",fontSize:17,color:"white"}}>{data.id}</Text>
            <Text style={{fontWeight:"600",fontSize:13,marginTop:20,color:"white"}}>Diagnosis: <Text style={{opacity:0.5}}>{data.diagnosis}</Text></Text>
            <Text style={{fontWeight:"600",fontSize:13,marginTop:10,maxWidth:"90%",color:"white"}}>Reported symphtoms: <Text style={{opacity:0.5}}>{data.clientSymphtoms}</Text></Text>
        </View>
        <Text style={{fontWeight:"600",fontSize:10,color:"white",opacity:0.8}}>{data.created_at}</Text>       
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    diagnosisBox:{
        padding:15,
        borderWidth:3,
        borderColor:"#ff9ceb",
        backgroundColor:"black",    
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginTop:30
    }
})