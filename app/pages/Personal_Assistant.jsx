
//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image,TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment, { max } from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../firebase"
import ChatMessage from "../components/Assistant/chatLog";
//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';

export default function AssistantPage({navigation}) {


//<**********************VARIABLES******************************>

const [isInputActive,setIsInputActive] = useState(false);

const [inputText,setInputText] = useState('');

const [chatLog,setChatLog] = useState([]);

const [isFirstQuestion,setIsFirstQuestion] = useState(true);

const [questionLoading,setQuestionLoading] = useState(false);

const functions = getFunctions(app);

//<********************FUNCTIONS************************>

const generateTextFromPrompt = async (request) => {
  const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
  let chatLogNew = [...chatLog, {user: "me", message: `${request}`} ]
  try {
      console.log(request)
      const result = await generateTextFunction({name: request});
      //SETT LOADING FALSE
      setChatLog([...chatLogNew, {user: "gpt", message: `${result.data.data.choices[0].message.content}`}])
      setSummerisingIsLoading(false)
      setQuestionLoading(false)
  } catch (error) {
      console.error('Firebase function invocation failed:', error);
  }
};

const handlePromptTrigger = (e) => { 
  if (questionLoading == false){
      setIsFirstQuestion(false)
      setIsInputActive(false)
      // Do something when Enter is pressed, e.g., trigger a function or submit a form
      e.preventDefault();
      setQuestionLoading(true)

      const  question =  inputText;
      let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
      //Loading GPT
      setChatLog([...chatLogNew, {user: "gpt", message: "Loading..."}]);
      //FUNCTION EVENT
      generateTextFromPrompt(question);
      setIsFirstQuestion(false)
      setInputText("")
    } else {
        alert("Wait for the answer !")
    }
};

return (
<View style={styles.container}>

  {isFirstQuestion ? (
    <>
      <View style={styles.assistantTitle}>
      <Text style={{fontSize:25,fontWeight:600}}>Hi,</Text>
      <Text style={{fontSize:25,fontWeight:600}}>How can I help you ?</Text>
    </View>
      <ScrollView style={{flexDirection:"row"}} horizontal>
      <View style={styles.assistantQuestionsContainer}>
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
      </View>
      <View style={styles.assistantQuestionsContainer}>
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
  
        <View style={styles.assistantQuestionBox}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={25}
            color="black"
          />
          <Text style={{fontSize:20,fontWeight:500}}>Health</Text>
          <Text style={{fontSize:13,fontWeight:400}}>Can you list all ?</Text>
        </View>
      </View>
    </ScrollView>
    </>
  ):(
    <ScrollView style={{height:100,marginTop:20,width:"100%"}}>
      {chatLog.map((message,index) => (
          <ChatMessage message={message} key={index} />
      ))}
    </ScrollView>
    )}

  <ScrollView horizontal style={!isInputActive ? {width:"100%",position:"absolute",bottom:80,left:20}:{width:"100%",position:"absolute",bottom:235,left:20,backgroundColor:"white",paddingBottom:30,paddingTop:20}} showsHorizontalScrollIndicator={false}>
    <View style={styles.horizontalQuBox}>
      <Text style={{padding:10,fontSize:10}}>What is my .... ?</Text>
    </View>
    <View style={styles.horizontalQuBox}>
      <Text style={{padding:10,fontSize:10}}>What is my .... ?</Text>
    </View>

    <View style={styles.horizontalQuBox}>
      <Text style={{padding:10,fontSize:10}}>What is my .... ?</Text>
    </View>

    <View style={styles.horizontalQuBox}>
      <Text style={{padding:10,fontSize:10}}>What is my .... ?</Text>
    </View>

    <View style={styles.horizontalQuBox}>
      <Text style={{padding:10,fontSize:10}}>What is my .... ?</Text>
    </View>
  </ScrollView>

  <View style={!isInputActive ? styles.inputContainerNotActive : styles.inputContainerActive}>
    <TextInput 
      placeholder='Type here ...' 
      style={styles.inputField} 
      onChangeText={(e) => setInputText(e)} 
      onFocus={() => setIsInputActive(true)} 
      onEndEditing={() => setIsInputActive(false)} 
      onSubmitEditing={handlePromptTrigger} 
      onTouchCancel={() => setIsInputActive(false)} 
      onTouchEnd={() => setIsInputActive(false)}
    />
    <Pressable onPress={handlePromptTrigger} style={{backgroundColor:"#CFFFFE",marginLeft:20,borderWidth:0.3,borderRadius:5,width:50,height:50,justifyContent:"center",alignItems:"center"}}>
      <MaterialCommunityIcons 
        name="send"
        size={25}
        color="black"
      />
    </Pressable>
  </View>
</View>

);
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:100,
      width:'100%',
      alignItems:'center'
  },
  assistantTitle:{
    flexDirection:'column',
    justifyContent:'center',
    padding:20,
    width:'100%',
    borderWidth:0,
  },
  assistantQuestionsContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    width:'100%',
    maxWidth:'100%',
    height:100,
    justifyContent:'center',
    alignItems:'center',
  },
  assistantQuestionBox:{
    width:150,
    height:90,
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
  },
  inputContainerActive:{
    width:'100%',
    padding:20,
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:160,
    backgroundColor:'white',
    flexDirection:'row',
  },
  inputField:{
    width:'80%',
    height:50,
    borderWidth:1,
    borderRadius:5,
    padding:10,
  },
  horizontalQuBox:{
    backgroundColor:'lightgrey',
    borderRadius:5,
    height:30,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    opacity:0.6,
    marginRight:15
  }
});