import { TextInput, ScrollView,View, Text, Image, KeyboardAvoidingView, Platform  } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const ChatLogView = ({
    chatLog,
    handleKeyboardDismiss,
    me,
    end
}) => {
    return(
        <ScrollView onTouchStart={handleKeyboardDismiss} style={{width:"100%",marginBottom:90,borderWidth:0}}>
        {
            chatLog.map((message,index) => (
                <ChatMessage message={message} key={index} me={me} end={end} isLast={index === chatLog.length - 1} />
            ))
        }
        </ScrollView>
    )
}


const ChatMessage = ({ message, me, end, isLast }) => {
return(
<View style={[{flexDirection:"row",width:"100%",borderWidth:0,padding:10,paddingTop:1,paddingBottom:1}, message.user == me ? {backgroundColor:"rgba(0,0,0,0)", flexDirection:"row-reverse"}:{backgroundColor:"rgba(0,0,0,0)"}, isLast && !message.sent && {marginTop:5}]}>
    {message.user == end &&
        <Image
            source={{uri:"https://picsum.photos/200/300"}}
            style={{width:40,height:40,borderRadius:10,marginRight:5}}
        />
    }
    {message.user == end ? (
        <View style={[{alignItems:"start",paddingVertical:8,paddingHorizontal:10,backgroundColor:"rgba(0,0,255,0.4)",borderRadius:10,borderTopLeftRadius:0,borderBottomLeftRadius:2,marginBottom:10}, isLast && {marginBottom:10}]}>
            <Text style={[{maxWidth:290,color:"black"},{fontWeight:"500"}]}>
                {message.message}
            </Text>
        </View>
    ):(
        
        <View style={[{alignItems:"start",paddingVertical:8,paddingHorizontal:10,backgroundColor:"rgba(0,0,255,0.4)",borderRadius:10,borderTopRightRadius:0,borderBottomRightRadius:2,marginBottom:0}, isLast && {marginBottom:10}]}>
            <Text style={[{maxWidth:290,color:"black"},{fontWeight:"500"}]}>
                {message.message}
            </Text>
        </View>
    )
    }
    {message.sent ? (
        isLast ? (
        // <View style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-3,right:10}}>
        //     <MaterialCommunityIcons 
        //         name="check-circle-outline"
        //         size={13}
        //     />
        // </View>
        <View>
            
        </View>
        ): null
    ):(
        <View style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-10,right:15}}>
            <View style={{borderColor:"blue",borderWidth:1,borderRadius:100,height:10,width:10}} />
            <Text style={{fontSize:9,opacity:0.5}}> Sending ...</Text>
        </View>
    )
    }
</View>
)
};


export const ChatInput = ({
    inputValue,
    setInputValue,
    handleSend
}) => {
    return(
        <KeyboardAvoidingView
            
            behavior="position"
            keyboardVerticalOffset={20} 
            
        >
            <View style={{ width: '95%', padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', alignSelf: 'center', borderRadius: 30,marginTop:20}}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {inputValue === '' ? ( 
                <View style={{ padding: 8, backgroundColor: 'rgba(0,0,255,0.7)', justifyContent: 'center', borderRadius: 100, marginRight: 10 }}>
                    <MaterialCommunityIcons
                        name={"camera"}
                        size={23}
                        color={"white"}
                    />
                </View>
                ) : (
                <View style={{ padding: 8, backgroundColor: 'rgba(0,0,255,0.7)', justifyContent: 'center', borderRadius: 100, marginRight: 10 }}>
                    <MaterialCommunityIcons
                    name={"magnify"}
                    size={23}
                    color={"white"}
                    />
                </View>
                )}
                <TextInput
                    placeholder="Write a message ..."
                    value={inputValue}
                    onChangeText={setInputValue}
                    style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170 }}
                    multiline={true}
                />
            </View>
            {inputValue === "" ?(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                    name={"microphone"}
                    size={25}
                    color={"white"}
                    style={{ marginRight: 15 }}
                />
                <MaterialCommunityIcons
                    name={"image"}
                    size={25}
                    color={"white"}
                    style={{ marginRight: 15 }}
                />
                <MaterialCommunityIcons
                    name={"sticker"}
                    size={25}
                    style={{ marginRight: 15 }}
                />
                </View>
            ) : (
                <TouchableOpacity onPress={() => handleSend(inputValue)} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(0,0,255,0.7)', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                    <MaterialCommunityIcons
                        name={"send"}
                        size={23}
                        color={"white"}
                    />
                </TouchableOpacity>
              )}
              </View>
      </KeyboardAvoidingView>
    )
}