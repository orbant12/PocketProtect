import { View, TouchableOpacity, Text, Image} from "react-native"
import { AssistPanel_style } from "../../../styles/assistance_style"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { TagContainer } from "../../Common/tagContainer"

export const ChatBotBar = ({data,index}) => {
    return(
        <TouchableOpacity onPress={data.action} key={index} style={AssistPanel_style.sessionBar}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Image
                    source={data.profileUrl}
                    style={{
                        width:60,
                        height:60,
                        borderWidth:0.5,
                        borderRadius:10,
                        marginBottom:0
                    }}
                />
                <View style={{marginLeft:15}}>
                    <Text style={{fontSize:16,fontWeight:"600"}}>{data.name}</Text>
                    <View>
                        <Text style={{fontSize:13,fontWeight:"500",maxWidth:"93%",opacity:0.6,marginTop:3}}>Get quick and accurate advice and insight to your concerns and sympthoms</Text>
                    </View>
                    <TagContainer
                        style={{width:"85%",marginTop:10}}
                        labels={data.tags}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}