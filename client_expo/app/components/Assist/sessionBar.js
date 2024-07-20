import { View, TouchableOpacity, Text, Image} from "react-native"
import { AssistPanel_style } from "../../styles/assistance_style"
import { timeDistanceFromToday } from "../../utils/date_manipulations"
import { ImageLoaderComponent } from "../../pages/Libary/Melanoma/slugAnalasis"

export const SessionBar = ({data,index,setSelectedChat}) => {
    return(
        <>
    {data.chat.length != 0 &&
        <TouchableOpacity onPress={() => setSelectedChat(data)} key={index} style={AssistPanel_style.sessionBar}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <ImageLoaderComponent
                    w={60}
                    h={60}
                    style={{borderWidth:0.5,borderRadius:10}}
                    data={{melanomaPictureUrl:data.assistantData.profileUrl}}
                />
                <View style={{marginLeft:10,height:40}}>
                    <Text style={{fontSize:16,fontWeight:"600"}}>{data.assistantData.fullname}</Text>
                    {data.answered && data.chat.length != 0 ? 
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:5}}>
                            <Text numberOfLines={1} style={{maxWidth:210,overflow:"hidden",fontWeight:"400",opacity:0.5,marginTop:5}}><Text style={{fontWeight:"600"}}>You: </Text>{data.chat[data.chat.length - 1].message}</Text>
                            <Text> • {timeDistanceFromToday(data.chat[data.chat.length - 1].date)}</Text>
                        </View>
                        :
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:5}}>
                            <Text numberOfLines={1} style={{maxWidth:200,overflow:"hidden",fontWeight:"700",opacity:1}}>{data.chat[data.chat.length - 1].message}</Text>
                            <Text> • {timeDistanceFromToday(data.chat[data.chat.length - 1].date)}</Text>
                        </View>
                    }
                </View>
            </View>
            {!data.answered ? 
                <View style={{width:10,height:10,backgroundColor:"magenta",borderRadius:100}} />
                :
                <View />
            }

        </TouchableOpacity>
    }
    </>
    )
}