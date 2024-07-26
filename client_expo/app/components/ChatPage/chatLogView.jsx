import { TextInput, ScrollView,View, Text, Image, KeyboardAvoidingView, Platform,TouchableOpacity,Pressable,Animated  } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React, { useRef, useEffect } from "react"
import { styles_shadow } from "../../styles/shadow_styles"

export const ChatLogView = ({
    chatLog,
    handleKeyboardDismiss,
    me,
    end,
    profileUrl,
    chatScrollRef,
    handleScroll
}) => {
    return(
        <ScrollView  onContentSizeChange={() =>  chatScrollRef.current.scrollToEnd({ animated: true })} onScroll={handleScroll} ref={chatScrollRef} onTouchStart={handleKeyboardDismiss} style={{width:"100%",borderWidth:1,height:"70%",marginTop:0}}>
        {
            chatLog.map((message,index) => (
                <ChatMessage 
                    message={message}
                    key={index} 
                    me={me} 
                    end={end} 
                    isLast={index === chatLog.length - 1} 
                    profileUrl={profileUrl}
                    animate={index === chatLog.length - 1}
                />
            ))
        }
        </ScrollView>
    )
}


const ChatMessage = ({ message, me, end, isLast,profileUrl,animate }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animate) {
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500, // Duration of the fade-in animation
            useNativeDriver: true,
          }).start();
        } else {
            opacity.setValue(1);
        }
      }, [animate]);

return(
<Animated.View style={[{flexDirection:"row",width:"100%",borderWidth:0,padding:10,paddingTop:1,paddingBottom:1},{opacity}, message.user == me ? {backgroundColor:"rgba(0,0,0,0)", flexDirection:"row-reverse"}:{backgroundColor:"rgba(0,0,0,0)"}, !message.inline_answer && message.sent && {marginTop:30},isLast && message.user == me && {marginBottom:20},styles_shadow.shadowContainer]}>
    {message.user == end &&
        (
        !message.inline_answer ?
        <Image
            source={message.user == "gpt" ? profileUrl : {uri:profileUrl}}
            style={{width:40,height:40,borderRadius:10,marginRight:5}}
        />
        :
        <View style={{width:40,height:40,marginRight:5}} />
        )
    }
    {message.user == end ? (
        <View style={[{alignItems:"start",paddingVertical:8,paddingHorizontal:10,backgroundColor:"rgba(250,0,250,0.6)",borderRadius:10,borderTopLeftRadius:0,borderBottomLeftRadius:2,marginBottom:0}, isLast && {marginBottom:10}]}>
            <Text style={[{maxWidth:290,color:"black"},{fontWeight:"500"}]}>
                {message.message}
            </Text>
        </View>
    ):(
        
        <View style={[{alignItems:"start",paddingVertical:8,paddingHorizontal:10,backgroundColor:"rgba(250,0,250,0.3)",borderRadius:10,borderTopRightRadius:0,borderBottomRightRadius:2,marginBottom:0}, isLast && {marginBottom:10}]}>
            <Text style={[{maxWidth:290,color:"black"},{fontWeight:"500"}]}>
                {message.message}
            </Text>
        </View>
    )
    }
    {message.sent ? (
        isLast && message.user == me ? (
        <View style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-3,right:10}}>
            <MaterialCommunityIcons 
                name="check-circle-outline"
                size={13}
            />
        </View>
    
        ): null
    ):(
        <View style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-10,right:15}}>
            <View style={{borderColor:"blue",borderWidth:1,borderRadius:100,height:10,width:10}} />
            <Text style={{fontSize:9,opacity:0.5}}> Sending ...</Text>
        </View>
    )
    }
</Animated.View>
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
            keyboardVerticalOffset={0} 
            
        >
            <View style={{ width: '95%', padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', alignSelf: 'center', borderRadius: 30,marginVertical:10,marginBottom:20}}>

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
                    style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170,color:"white",alignSelf:"center",padding:0 }}
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