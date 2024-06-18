import { View, TextInput,TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const Chat_InputField = ({
    inputValue,
    setInputValue,
    handleSend,
    handleOpenBottomSheet
  }) => {
    return(
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={20} 
        >
            <View style={{ width: '95%', padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,1)', alignSelf: 'center', borderRadius: 30,marginVertical:20,marginBottom:0,zIndex:100}}>

              <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
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
                      placeholderTextColor={"white"}
                      style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170,color:"white",fontWeight:"400",alignSelf:"center",padding:5 }}
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
                  <TouchableOpacity onPress={() => handleSend()} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(0,0,255,0.7)', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
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