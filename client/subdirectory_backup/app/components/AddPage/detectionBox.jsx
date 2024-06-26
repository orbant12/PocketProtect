import { View,Text,Pressable } from "react-native"
import { FontAwesome6 } from '@expo/vector-icons';

export function DetectionBox({
    item
}){
    return(
        <Pressable onPress={() => handleNavigation(item.id)} key={item.id} style={item.state == "soon" ? styles.DetBoxSoon : styles.DetBox }>
            <View    style={{padding:10,borderWidth:0,borderRadius:25,backgroundColor:"white"}}>
                <FontAwesome6 name={item.icon} size={24} color="black" />
            </View>
            <View>
                <Text style={{marginLeft:10,fontWeight:"600"}} >{item.title}</Text>
                <Text style={{marginLeft:10,fontWeight:"300",fontSize:10,maxWidth:"90%",marginTop:3}} >{item.desc}</Text>
            </View>
        </Pressable> 
    )
}