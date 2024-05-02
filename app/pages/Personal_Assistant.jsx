
//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image,TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment, { max } from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';

export default function AssistantPage({navigation}) {


//<**********************VARIABLES******************************>

const [isInputActive,setIsInputActive] = useState(false);

//<********************FUNCTIONS************************>

return (
<View style={styles.container}>
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

  <View style={!isInputActive ? styles.inputContainerNotActive : styles.inputContainerActive}>
    <TextInput placeholder='sdas' style={styles.inputField} onFocus={() => setIsInputActive(true)} onEndEditing={() => setIsInputActive(false)} onSubmitEditing={() => setIsInputActive(false)} onTouchCancel={() => setIsInputActive(false)} />
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
    padding:20,
    borderWidth:1,
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
  },
  inputField:{
    width:'80%',
    height:50,
    borderWidth:1,
    borderRadius:5,
    padding:10,
  }
});