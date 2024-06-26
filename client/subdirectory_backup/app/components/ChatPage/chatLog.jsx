
import { View, Text, Image } from 'react-native';

const ChatMessage = ({ message }) => {
return(
<View style={[{flexDirection:"row",width:"100%",marginTop:0,alignItems:"center",borderWidth:0,padding:10,paddingTop:20,paddingBottom:20}, message.user == "me" ? {backgroundColor:"rgba(0,0,0,0)"}:{backgroundColor:"#ffd1fa"}]}>
    <Image
        source={{uri:"https://picsum.photos/200/300"}}
        style={{width:50,height:50,borderRadius:10}}
    />
    <Text style={[{marginLeft:15,maxWidth:290,color:"black"}, message.user == "gpt" ? {fontWeight:"700"} : {fontWeight:"500"}]}>
        {message.message}
    </Text>
</View>
)
};

export default ChatMessage;