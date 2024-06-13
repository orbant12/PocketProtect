import { View, TouchableOpacity, Text, Image} from "react-native"
import { AssistPanel_style } from "../../../styles/assistance_style"

export const SessionBar = ({data}) => {
    return(
        <TouchableOpacity style={AssistPanel_style.sessionBar}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Image
                    source={data.assistantData.profileUrl}
                    style={{
                        width:70,
                        height:70,
                        borderWidth:0.5,
                        borderRadius:100
                    }}
                />
                <View style={{marginLeft:10,height:40}}>
                    <Text style={{fontSize:16,fontWeight:"600"}}>Dr Orban Tamas</Text>
                    {!data.answered ? 
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:5}}>
                            <Text numberOfLines={1} style={{maxWidth:210,overflow:"hidden",fontWeight:"400",opacity:0.5,marginTop:5}}><Text style={{fontWeight:"600"}}>You: </Text>ndjsjdiosdios disndnsmd id dkn kn nj njnj njn jn sds dsd  j</Text>
                            <Text> • 7m</Text>
                        </View>
                        :
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:5}}>
                            <Text numberOfLines={1} style={{maxWidth:200,overflow:"hidden",fontWeight:"700",opacity:1}}>How can I help you sir ? :)</Text>
                            <Text> • 7m</Text>
                        </View>
                    }
                </View>
            </View>
            {data.answered ? 
                <View style={{width:10,height:10,backgroundColor:"magenta",borderRadius:100}} />
                :
                <View />
            }

        </TouchableOpacity>
    )
}