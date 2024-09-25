import { Text, TouchableOpacity, View } from "react-native"
import { deleteUser } from "@firebase/auth"
import { UserData } from "../../../../utils/types"
import { auth } from "../../../../services/firebase"

export const UserDelete = () => {

    return(
        <View style={{width:"90%",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"95%",alignSelf:"center"}}>
            <View style={{alignItems:"center",padding:10,backgroundColor:"rgba(0,0,0,0.2)",borderRadius:10}}>
                <Text style={{fontSize:20,fontWeight:700,marginBottom:10}}>WARNING</Text>
                <Text style={{textAlign:"center",fontWeight:500}}>Your account will be terminated and deleted forever !</Text>
            </View>

            <TouchableOpacity onPress={() => deleteUser(auth.currentUser) } style={{padding:8,borderRadius:7,backgroundColor:"rgba(255,0,0,0.8)",width:"60%",alignItems:"center",marginTop:50}}>
                <Text style={{fontSize:16,fontWeight:"600",color:"white"}}>Delete Forever</Text>
            </TouchableOpacity>
        </View>
    )
}