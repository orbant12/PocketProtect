import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function BloodWorkComponent({
    handleBloodWorkDataChange,
    indexPass,
    bloodWorkData,
    setIsFocused
}){

    return(
        <ScrollView style={{width:"100%",paddingTop:10,zIndex:9999}}>
            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                {bloodWorkData[indexPass].data.map((dataFrom,index) =>(
                    <View key={index} style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:20,borderWidth:2,padding:20,borderRadius:20}}>
                        <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom.type}</Text>
                        <View style={{borderLeftWidth:2}}>        
                            {/* <TextInput 
                                keyboardType="numeric"
                                style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                value={`${dataFrom.number}`}
                                onChangeText={(e) => handleBloodWorkDataChange(bloodWorkData[indexPass].title,dataFrom.type,e)}
                                textAlign="center"      
                                onFocus={() => setFocused(true)}      
                            /> */}
                            <TouchableOpacity onPress={() => setIsFocused({type:dataFrom.type,number:dataFrom.number,indexPass:indexPass})} style={{width:70,borderWidth:1,padding:9,borderRadius:10,marginLeft:20,alignItems:"center"}}>
                                <Text>{dataFrom.number}</Text>
                            </TouchableOpacity>             
                        </View> 
                    </View>
                ))
                    
                }       
            </View>
        </ScrollView>
    )
}


export const Chat_InputField = ({
    inputValue,
    setInputValue,
    handleSend,
    isFocused
  }) => {
    return(
        <>
        {isFocused &&
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={20} 
        >
            <View style={{ width: '95%', padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,1)', alignSelf: 'center', borderRadius: 30,marginVertical:20,marginBottom:0,zIndex:100}}>

            <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
                {inputValue === '0' ? ( 
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
                    keyboardType="number-pad"
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
    }
    </>
    )
}