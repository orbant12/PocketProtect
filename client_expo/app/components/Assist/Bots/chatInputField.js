import { View, TextInput,TouchableOpacity,KeyboardAvoidingView,Text,ScrollView } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { styles_shadow } from '../../../styles/shadow_styles';
import React from 'react';

export const Chat_InputField = ({
    inputValue,
    setInputValue,
    handleSend,
    setSelectedType
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

export const AI_InpitField = ({
    inputValue,
    setInputValue,
    handleSend,
    setSelectedType
  }) => {
    return(
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={80} 
          
        >
            <View style={[{flexDirection:"row",width:"100%",alignItems:"baseline",justifyContent:"center",height:110,backgroundColor:"rgba(0,0,0,0.85)",paddingRight:10,paddingTop:20},styles_shadow.hightShadowContainer]}>
                <ContextActive />
                <View style={{ width: '75%', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', borderRadius: 30,zIndex:100,borderWidth:2,borderColor:"magenta",marginLeft:0}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
                        <TextInput
                            placeholder="Write a message ..."
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholderTextColor={"white"}
                            style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170,color:"white",fontWeight:"500",alignSelf:"center",padding:5 }}
                            multiline={true}
                        />
                    </View>
                </View>
              {inputValue === "" ?(
                
                <TouchableOpacity onPress={() => setSelectedType("context")} style={{ padding: 10, backgroundColor: "magenta", justifyContent: 'center', alignItems:"center", borderRadius: 10,marginLeft:20,height:50,width:50,borderWidth:0,borderColor:"lightgray" }}>
                    <MaterialCommunityIcons
                    name={"eye"}
                    size={23}
                    color={"white"}
                    />
                </TouchableOpacity>
                
          ) : (
              <TouchableOpacity onPress={() => handleSend()} style={{ padding: 10, backgroundColor: 'magenta', justifyContent: 'center', alignItems:"center", borderRadius: 100,marginLeft:10,height:50,width:80,borderWidth:1 }}>
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


const ContextActive = () => {

    const [isActive,setIsActive] = React.useState(false)

    return(
        <>
        {isActive ?
        <ScrollView contentContainerStyle={{flexDirection:"column",alignItems:"center"}} style={{position:"absolute",top:-110,right:10,width:110,padding:0,backgroundColor:"rgba(0,0,0,1)",padding:0,borderRadius:5,maxHeight:110,borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
            <TouchableOpacity onPress={() => setIsActive(!isActive)} style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(255,255,255,0.3)",borderRadius:5,padding:2,borderWidth:2,borderColor:"gray",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
                <MaterialCommunityIcons
                    name='close'
                    size={13}
                    color={"white"}
                />
            </TouchableOpacity>
            <Text style={{fontSize:10,fontWeight:"800",marginBottom:10,color:"white",paddingTop:5}}>Active</Text>
            <View style={{width:"80%",backgroundColor:"white",padding:5,borderRadius:10,flexDirection:"row",alignItems:"center",marginBottom:10}}>
                <MaterialCommunityIcons
                    name={"eye"}
                    size={10}
                    color={"black"}
                />
                <Text style={{color:"black",marginLeft:5,fontSize:7,fontWeight:"700"}}>Blood Work</Text>
            </View>
            <View style={{width:"80%",backgroundColor:"white",padding:5,borderRadius:10,flexDirection:"row",alignItems:"center",marginBottom:10}}>
                <MaterialCommunityIcons
                    name={"eye"}
                    size={10}
                    color={"black"}
                />
                <Text style={{color:"black",marginLeft:5,fontSize:7,fontWeight:"700"}}>Blood Work</Text>
            </View>
            <View style={{width:"80%",backgroundColor:"white",padding:5,borderRadius:10,flexDirection:"row",alignItems:"center",marginBottom:10}}>
                <MaterialCommunityIcons
                    name={"eye"}
                    size={10}
                    color={"black"}
                />
                <Text style={{color:"black",marginLeft:5,fontSize:7,fontWeight:"700"}}>Blood Work</Text>
            </View>
        </ScrollView>
        :
        <TouchableOpacity onPress={() => setIsActive(!isActive)} style={{position:"absolute",top:-20,right:10,width:110,backgroundColor:"black",height:20,justifyContent:"center",alignItems:"center",borderRadius:5,borderBottomLeftRadius:0,borderBottomRightRadius:0,borderWidth:1,borderColor:"gray",flexDirection:"row"}}>
            
            <MaterialCommunityIcons
                name='arrow-up'
                size={13}
                color={"white"}
                style={{opacity:0.7}}
            />
            <Text style={{color:"white",marginLeft:5,fontSize:8,fontWeight:"700",opacity:0.7}}>Context</Text>

        </TouchableOpacity>
        }
        </>
    )
  }