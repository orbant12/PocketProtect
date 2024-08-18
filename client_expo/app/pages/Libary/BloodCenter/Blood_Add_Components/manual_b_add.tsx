import { Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { add_styles } from "../../../../styles/blood_styles";
import { BloodWorkComponent } from "./bloodWorkComponent";
import { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ManualBloodAddPage = ({
    progress,
    handleUpload,
    setProgress,
    handleBloodWorkDataChange,
    bloodWorkData,
    initialProgress,
    setInitialProgress
}) => {

    const [isFocused, setIsFocused] = useState(null)

    const manual = [
        {
            q:"Basic Health Indicators",
            component: <BloodWorkComponent 
                indexPass={0}
                setIsFocused={setIsFocused}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Lipid Panel",
            component:<BloodWorkComponent 
                indexPass={1}
                setIsFocused={setIsFocused}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Metabolic Panel",
            component:<BloodWorkComponent 
                indexPass={2}
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Liver Function Tests",
            component:<BloodWorkComponent 
                indexPass={3} 
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Thyroid Panel",
            component:<BloodWorkComponent 
                indexPass={4} 
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Iron Studies",
            component:<BloodWorkComponent 
                indexPass={5} 
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Vitamins and Minerals",
            component:<BloodWorkComponent 
                indexPass={6}
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Inflammatory Markers",
            component:<BloodWorkComponent 
                indexPass={7}
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        },
        {
            q:"Hormonal Panel",
            component:<BloodWorkComponent 
                indexPass={8}
                bloodWorkData={bloodWorkData}
                setIsFocused={setIsFocused}
            />
        }
    ]

    const inputRef = useRef(null)

    useEffect(() => {
        if(isFocused != null){
            inputRef.current.focus()
        }
    },[isFocused])

    return(
        <>
        
            <View style={[{width:"100%",height:"90%",alignItems:"center",justifyContent:"space-between",borderWidth:0},isFocused == null && {marginBottom:"20%"}]}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:10,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[initialProgress].q}</Text>            
                </View> 
            {manual[initialProgress].component}
            {isFocused != null ?
                <>
                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={20} 
                    style={{width:"100%",backgroundColor:"rgba(0,0,0,0.9)",borderTopRightRadius:10,borderTopLeftRadius:10}} 
                >
                    <View style={{flexDirection:"row",width:"100%",justifyContent:"center",alignItems:"center",marginVertical:20}}>
                    <View style={{ width: '50%', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(250,0,250,0.5)', alignSelf: 'center', borderRadius: 10,marginBottom:0,zIndex:100,borderWidth:1,borderColor:"magenta"}}>
        
                        <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
                            <TextInput
                                placeholder="Type in the value ..."
                                value={`${isFocused.number}`}
                                keyboardType="number-pad"
                                onChangeText={(e) => {handleBloodWorkDataChange(bloodWorkData[isFocused.indexPass].title,isFocused.type,e);setIsFocused(focusData => ({...focusData,number:e}))}}
                                placeholderTextColor={"white"}
                                style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170,color:"white",fontWeight:"400",alignSelf:"center",padding:5 }}
                                multiline={true}
                                ref={inputRef}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setIsFocused(null)} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(250,0,250,1)', alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft:30 }}>
                            <MaterialCommunityIcons
                                name={"send"}
                                size={23}
                                color={"white"}
                            />
                    </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </>
                :
                <TouchableOpacity onPress={() => {setProgress(progress + 0.1),setInitialProgress(initialProgress + 1)}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                </TouchableOpacity>
            }
            </View>
        </>
    )
}




const Chat_InputField = ({
    inputValue,
    setInputValue,
    handleSend,
  }) => {
    return(
        <>
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={20} 
            style={{width:"100%",backgroundColor:"black"}}
        >
            <View style={{flexDirection:"row",width:"100%",justifyContent:"center",alignItems:"center",marginVertical:20,backgroundColor:"black"}}>
            <View style={{ width: '50%', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(250,0,250,0.5)', alignSelf: 'center', borderRadius: 10,marginBottom:0,zIndex:100,borderWidth:1,borderColor:"magenta"}}>

                <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
                    <TextInput
                        placeholder="Type in the value ..."
                        value={inputValue}
                        keyboardType="numeric"
                        onChangeText={(e) => setInputValue(e)}
                        placeholderTextColor={"white"}
                        style={{ maxWidth: 240, flexWrap: 'wrap',minWidth:170,color:"white",fontWeight:"400",alignSelf:"center",padding:5 }}
                        multiline={true}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => handleSend()} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(250,0,250,1)', alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft:30 }}>
                    <MaterialCommunityIcons
                        name={"send"}
                        size={23}
                        color={"white"}
                    />
            </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </>
    )
}