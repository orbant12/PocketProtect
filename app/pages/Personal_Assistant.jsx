
//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//FIREBASE CLASSES
import moment from 'moment'

//COMPONENTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import Calendar from '../components/HomePage/HorizontalCallendar';

export default function AssistantPage({navigation}) {


//<********************FUNCTIONS************************>

return (
<View style={styles.container}>

</View>

);
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop:50
  },
});