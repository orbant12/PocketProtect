
import React, {useEffect, useState,useRef} from 'react';
import { ScrollView,StyleSheet,Text,View, Pressable,TextInput,TouchableOpacity,Switch,ActivityIndicator,Keyboard } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../firebase"
import ChatMessage from "../components/Assistant/chatLog";
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const AssistantPage = ({navigation}) => {


//<==================<[ Variables ]>====================>

const [isInputActive,setIsInputActive] = useState(false);

const [headerSelect, setHeaderSelect] = useState(false)

const [assistantType, setAssistantType] = useState("")

const [inputText,setInputText] = useState('');

const [chatLog,setChatLog] = useState([]);

const [questionLoading,setQuestionLoading] = useState(false);

const [isAddTriggered, setIsAddTriggered] = useState(false)

const [isContextPanelOpen,setIsContextPanelOpen] = useState(false)

const [ contextToggles , setContextToggles ] = useState({
  useBloodWork:false,
  useWeatherEffect:false,
})

const ContextOptions = [
  {
    title:"Blood Work",
    stateName:contextToggles.useBloodWork,
    stateID:"useBloodWork"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
  {
    title:"Weather Effects",
    stateName:contextToggles.useWeatherEffect,
    stateID:"useWeatherEffect"
  },
]
//Bottom Sheet
const bottomSheetRef = useRef(null);
const chatSheetRef = useRef(null);
const snapPoints = ['80%'];
const chatSnapPoints = ["95%"];
const functions = getFunctions(app);
const [ isDiagnosisLoading, setIsDiagnosisLoading] = useState(false)


//<==================<[ Functions ]>====================>

const generateTextFromPrompt = async (request) => {
  const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
  let chatLogNew = [...chatLog, {user: "me", message: `${request}`} ]
  try {
      console.log(request)
      const result = await generateTextFunction({name: request});
      //SETT LOADING FALSE
      setChatLog([...chatLogNew, {user: "gpt", message: `${result.data.data.choices[0].message.content}`}])
      setQuestionLoading(false)
  } catch (error) {
      console.error('Firebase function invocation failed:', error);
  }
};

const handlePromptTrigger = (e) => { 
  if (questionLoading == false){
      setIsInputActive(false)
      // Do something when Enter is pressed, e.g., trigger a function or submit a form
      e.preventDefault();
      setQuestionLoading(true)
      chatSheetRef.current.present()
      const  question =  inputText;
      let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
      //Loading GPT
      setChatLog([...chatLogNew, {user: "gpt", message: "Loading..."}]);
      //FUNCTION EVENT
      generateTextFromPrompt(question);
      setInputText("")
    } else {
        alert("Wait for the answer !")
    }
};

const handleSwitch = (name,e) => {
  if ( name == "useBloodWork"){
    setContextToggles({
      ...contextToggles,
      [name]:e
    })
  }  else if ( name == "useWeatherEffect"){
    setContextToggles({
      ...contextToggles,
      [name]:e
    })
  }
}

const handleOpenBottomSheet = (state) => {
  if(state == "open"){
      bottomSheetRef.current.present();
    
  } else if (state == "hide"){
      bottomSheetRef.current.close();
      setProgress(progress + 0.1)
  }
}

const handleKeyboardDismiss = () => {
  setIsInputActive(false)
  Keyboard.dismiss()

}


//<==================<[ Main Return ]>====================>

return (
  <>
    <GestureHandlerRootView style={{ flex: 1,width:"100%",backgroundColor:"white" }}>
      <BottomSheetModalProvider>
        {/*HEADER*/}
        <Header 
          isContextPanelOpen={isContextPanelOpen}
        />
        {/*AI ASSISTANT*/}
        <AiAssistant 
          setInputText={setInputText}
          inputText={inputText}                    
          handleKeyboardDismiss={handleKeyboardDismiss}
          isInputActive={isInputActive}
          setAssistantType={setAssistantType}
          setIsInputActive={setIsInputActive}
          handlePromptTrigger={handlePromptTrigger}
          handleOpenBottomSheet={handleOpenBottomSheet}
          />      
        <ChatSheet 
          chatSheetRef={chatSheetRef}
          chatSnapPoints={chatSnapPoints}
          setInputText={setInputText}
          setQuestionLoading={setQuestionLoading}          
          chatLog={chatLog}
          setChatLog={setChatLog}
          handleKeyboardDismiss={handleKeyboardDismiss}
          isInputActive={isInputActive}
          setIsInputActive={setIsInputActive}
          inputText={inputText}
          handlePromptTrigger={handlePromptTrigger}
        />
        {/*CONTEXT*/}
        <ContextSheet    
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          isContextPanelOpen={isContextPanelOpen}
          setIsContextPanelOpen={setIsContextPanelOpen}
          ContextOptions={ContextOptions}
          handleSwitch={handleSwitch}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView >
  </>
)}


//<==================<[ Style Sheet ]>====================>

const styles = StyleSheet.create({

  container: {
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:0,
      width:'100%',
      alignItems:'center',
      position:"relative",
      zIndex:0,
      backgroundColor:"white"
  },
  assistantTitle:{
    flexDirection:'column',
    justifyContent:'center',
    padding:20,
    width:'100%',
    borderWidth:0,
  },
  assistantQuestionsContainer:{
    flexDirection:'column',    
    width:'200%',
    height:"100%",
    maxWidth:'100%',
    marginTop:0,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:0,
  },
  assistantQuestionBox:{
    width:150,
    height:0,
    borderWidth:1,
    margin:10,
    borderRadius:1,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    opacity:0.6,
  },
  inputContainerNotActive:{
    width:'100%',
    flexDirection:'row',
    padding:20,
    borderWidth:0,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:0,
    height:110,
    zIndex:0,
    backgroundColor:"transparent"
  },
  inputContainerActive:{
    width:'100%',
    padding:20,
    borderWidth:1,
    alignItems:'flex-start',
    justifyContent:'center',
    position:'absolute',
    bottom:0,
    backgroundColor:'white',
    flexDirection:'row',
    height:"41%",
    zIndex:20
  },
  inputField:{
    width:'80%',
    height:45,
    borderWidth:0.3,
    borderRadius:5,
    padding:10,
    zIndex:5,
  },
  horizontalQuBox:{
    backgroundColor:'black',
    borderRadius:5,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    marginTop:30,
    marginBottom:10,
    opacity:1,
    width:"80%"
  },
  contextBox:{
    height:160,
    width:"90%",
    marginTop:40,
    borderRadius:20,
    flexDirection:"row",
    alignItems:"flex-end",
    justifyContent:"center"
  },
  cardRight:{
    width:"72%",
    height:"90%",
    borderRightWidth:10,
    backgroundColor:"black",
    borderRadius:10,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
    borderBottomRightRadius:0,
    padding:20,
    justifyContent:"space-between"
  },
  cardLeft:{
    padding:8,
    alignItems:"center",
    width:"28%",
    height:"100%",
    borderTopLeftRadius:20,
    borderTopRightRadius:15,
    borderBottomRightRadius:10,
    backgroundColor:"black"
  },
  searchInputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:2,
    width:"80%",
    marginTop:50,
    borderRadius:10,
    padding:10,
    justifyContent:"center",
  },
  searchInput:{
    borderWidth:0,
    width:"70%",
    marginLeft:20,
  },
  addInputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    width:"50%",
    marginTop:40,
    borderRadius:50,
    padding:12,
    backgroundColor:"black",
    justifyContent:"center"
  },
  loadingModal:{
    alignItems:"center",
    justifyContent:"center",
    position:"absolute",
    width:"100%",
    height:"100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingBottom:200
},
});

const Cstyles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:0,
      width:'100%',
      alignItems:'center',
      position:"relative",
      height:"100%",
      zIndex:10
  },        
});

const Dstyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingTop:0,
    width:'100%',
    alignItems:'center',
    position:"relative",
    height:"100%",
    justifyContent:"center"
},
diagnosisPage:{
  alignItems:"center",
  width:"100%",
  height:"100%",
  paddingBottom:40,
}
});

export default AssistantPage


//<==================<[ Coponents ]>====================>

  const Header = ({
    isContextPanelOpen
  }) => {
    return(
      <Pressable onPress={() => {handleKeyboardDismiss()}} style={[{width:"100%",backgroundColor:"rgba(0,0,0,1)",padding:10,textAlign:"center",position:"relative",height:"20%",justifyContent:"center",alignItems:"center",paddingTop:30},]}>
      {!isContextPanelOpen ?
      
              <View style={{paddingTop:30}}>
                <Text style={{fontWeight:"500",fontSize:13,color:"white",opacity:0.6}}>Are you having suspicious sympthoms ?</Text>
                <Text style={{fontWeight:"800",fontSize:20,marginTop:5,color:"white"}}>Ask anything</Text>
              </View>
        :
        <View style={{paddingTop:30, width:"100%"}}>
        <Text style={{fontWeight:"700",fontSize:20,width:"100%",color:"white",textAlign:"center",position:"relative"}}>
          <Text style={{color:"gray",fontWeight:"800",}}> Pick the data </Text>
          you want <Text style={{color:"gray",fontWeight:"800"}}>Ai</Text> to see during your assistance
        </Text> 
        </View>
        
      }
    </Pressable>   
    )
  }

  const AiAssistant = ({
      setInputText,
      inputText,
      handleKeyboardDismiss,
      isInputActive,
      setAssistantType,
      setIsInputActive,
      handlePromptTrigger,
      handleOpenBottomSheet
  }) => {
    return(
      <>
          <Pressable style={styles.container}>    
              <ScrollView horizontal style={!isInputActive? {borderWidth:3,height:"50%",opacity:0.8,zIndex:3} : {opacity:0.1,borderWidth:3,height:"50%", zIndex:3}} >
                  <Pressable onPress={handleKeyboardDismiss}  style={[styles.assistantQuestionsContainer,{marginLeft:30}]}>
                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>

                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>
                    </View>    

                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                        
                    
                        <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                    </View> 
                  </Pressable> 
                  <Pressable onPress={handleKeyboardDismiss}  style={styles.assistantQuestionsContainer}>
                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>

                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>
                    </View>    

                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                        
                    
                        <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                    </View> 
                  </Pressable> 

                  <Pressable onPress={handleKeyboardDismiss}  style={styles.assistantQuestionsContainer}>
                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>

                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                        <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                        <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                            <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                            <MaterialCommunityIcons 
                              name='arrow-right'
                              color={"magenta"}
                              size={15}
                            />
                          </Pressable>
                      </View>
                    </View>    

                    <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                      <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:20,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                        
                    
                        <View style={{borderWidth:2,padding:10,width:"40%",marginTop:20,borderRadius:10,marginRight:0,opacity:0.7}}>
                          <Text style={{fontWeight:"800",fontSize:12,marginTop:3}}>Ask anything</Text>
                          <Pressable onPress={() => setAssistantType("chat")} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:20,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:8}]}>
                              <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
                              <MaterialCommunityIcons 
                                name='arrow-right'
                                color={"magenta"}
                                size={15}
                              />
                            </Pressable>
                        </View>
                    </View> 
                  </Pressable> 

              </ScrollView> 

          </Pressable>
            <View style={{width:"100%",alignItems:"center",backgroundColor:"transpaerent",paddingTop:0,zIndex:0,position:"absolute",bottom:90}}>
            <Pressable onPress={() => handleOpenBottomSheet("open")} style={styles.horizontalQuBox}>
                  <Text style={{padding:10,fontSize:12,fontWeight:"600",color:"white"}}>Open Context Panel</Text>
              </Pressable>  
            </View>
            <View style={[!isInputActive ? styles.inputContainerNotActive : styles.inputContainerActive]}>
              
              <TextInput 
                placeholder='Type here ...' 
                style={styles.inputField} 
                onChangeText={(e) => setInputText(e)} 
                onFocus={() => setIsInputActive(!isInputActive)} 
                onSubmitEditing={handlePromptTrigger} 
                value={inputText}
              />
              <TouchableOpacity onPress={handlePromptTrigger} style={{backgroundColor:"magenta",marginLeft:20,borderWidth:0.3,borderRadius:10,width:45,height:45,justifyContent:"center",alignItems:"center",opacity:0.6}}>
                <MaterialCommunityIcons 
                  name="send"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            </>
    )
  }

  const ChatSheet = ({
    chatSheetRef,
    chatSnapPoints,
    setInputText,
    setChatLog,
    setQuestionLoading,
    chatLog,
    handleKeyboardDismiss,
    isInputActive,
    setIsInputActive,
    inputText,
    handlePromptTrigger
  }) => {
      //<========<[ Child Components ]>==========>
      function HandleComponent(){
        return(
          <View style={{width:"100%",height:60,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0,zIndex:50}}>
          <View style={{borderWidth:1,borderColor:"white",width:30}} />
          <Text style={{color:"white",marginTop:10,fontWeight:"700",fontSize:15}}>AI Chat Log</Text>
          <MaterialCommunityIcons 
            name='close'
            color={"white"}
            size={20}
            style={{position:"absolute",right:10,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6}}
            onPress={() => {chatSheetRef.current.close();setQuestionLoading(false);setChatLog([])}}
          />
        </View>
        )
      }
      function ChatLogView(){
        return(
          <ScrollView onTouchStart={handleKeyboardDismiss} style={{width:"100%",marginBottom:90,borderWidth:1}}>
          {chatLog.map((message,index) => (
              <ChatMessage message={message} key={index} />
          ))}
          </ScrollView>
        )
      }
      function ChatInputField(){
        return(
          <View style={[!isInputActive ? styles.inputContainerNotActive : [styles.inputContainerActive,{ height:"48%"}]]}>
          <TextInput 
            placeholder='Type here ...' 
            style={styles.inputField} 
            onChangeText={(e) => setInputText(e)} 
            onFocus={() => setIsInputActive(true)} 
            onSubmitEditing={handlePromptTrigger}
            value={inputText}
          />
          <TouchableOpacity onPress={handlePromptTrigger} style={{backgroundColor:"magenta",marginLeft:20,borderWidth:0.3,borderRadius:10,width:45,height:45,justifyContent:"center",alignItems:"center",opacity:0.6}}>
            <MaterialCommunityIcons 
              name="send"
              size={25}
              color="white"
            />
          </TouchableOpacity>
        </View>
        )
      }
      //<===========<[ Main ]>===========>
      return(
        <BottomSheetModal
            ref={chatSheetRef}
            snapPoints={chatSnapPoints}
            enablePanDownToClose={true}
            onDismiss={() => {setQuestionLoading(false);setChatLog([]);setInputText("")}}
            handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
            handleIndicatorStyle={{backgroundColor:"white"}}
            handleComponent={() => 
              HandleComponent()          
            }
          >
            {ChatLogView()}
            {ChatInputField()}
          </BottomSheetModal>
      )
  }

  const ContextSheet = ({
    bottomSheetRef,
    snapPoints,
    isContextPanelOpen,
    setIsContextPanelOpen,
    ContextOptions,
    handleSwitch,    
  }) => {

    function ContextPanel(){
      return(      
        <View style={[Cstyles.container,{zIndex:30}]}>
          <ScrollView style={{width:"100%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",height:"100%",paddingTop:0}} showsVerticalScrollIndicator={false}>
            <View style={{width:"100%",alignItems:"center"}}>
            {ContextOptions.map((data,index)=>(
                <View key={index} style={[styles.contextBox, !data.stateName ? {backgroundColor:"magenta"} : {backgroundColor:"lightgreen"}]}>
                <View style={[styles.cardRight, !data.stateName && {}]}>
                  <View>
                    {!data.stateName ? 
                      <Text style={{color:"magenta",fontWeight:"500",fontSize:10}}>Not Active</Text>
                    :
                      <Text style={{color:"lightgreen",fontWeight:"500",fontSize:10}}>Active  </Text>
                    }
              
                    <Text style={{color:"white",fontWeight:"700",fontSize:20}}>
                      {data.title}
                  </Text>
                  </View>
  
                  <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:20,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
                      <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>See Data</Text>
                      <MaterialCommunityIcons 
                        name='arrow-right'
                        color={!data.stateName? "magenta" : "lightgreen"}
                        size={15}
                      />
                  </Pressable>
                </View>
                <View style={[styles.cardLeft,  !data.stateName && {}]}>
                  <Switch value={data.stateName} onValueChange={(e) => handleSwitch(data.stateID,e)} thumbColor={"white"} trackColor={"magenta"} ios_backgroundColor={"magenta"} />
                </View>
                </View>
            ))
            }     
            </View>
          </ScrollView>
        </View>
      )
    }

    return(
      <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={() => setIsContextPanelOpen(!isContextPanelOpen)}
      enablePanDownToClose={true}
      handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:40,color:"white",zIndex:20}}
      handleIndicatorStyle={{backgroundColor:"white"}}

    >
      {ContextPanel()}
    </BottomSheetModal>
    )
  }