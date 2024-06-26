//<********************************************>
//LAST EDITED: 2023.12.04
//EDITED BY: Orban Tamas
//DESC: This is the bottom tab navigation for the home page. It contains the following tabs: Home, Search, Upload, Inbox, Profile
//<********************************************>

//BASIC IMPORTS
import React,{useState} from 'react';
import {Image, Text,View,TouchableOpacity,Animated,StyleSheet,SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//COMPONENTS
import TabOneScreen from '../pages/Home/home';
import Profile from '../pages/Profile/profile';
import ChatCenter from '../pages/Chat/chatCenter';
import DetectionLibary from '../pages/Libary/detection';
import AddDetection from '../pages/Add/addDetection'
import { HeaderContainer } from '../components/Common/headerContainer';


//ICONS
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

//NAVIGATION TAB CREATION
const Tab = createBottomTabNavigator();


const HomeBottomTabNavigator = ({navigation}) => {

//<**********************FUNCTIONS******************************>

const handleSettingsNavigation = () => {
  navigation.navigate("SettingsPage")
}


return (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "magenta",
      tabBarStyle:{
        backgroundColor: '#ffffff',
      }
    }}>
      {/* HOME NAVIGATION */}
      <Tab.Screen
        name={'Home'}
        component={TabOneScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          tabBarIcon: ({color}) => (
            <Entypo name={'home'} size={25} color={color} />
          ),
        }}
      />

      {/* ASSISTANT NAVIGATION */}
      <Tab.Screen
        name={'Detection'}
        component={DetectionLibary}
        options={{
          headerShown: false,
          headerTransparent: true,
          tabBarIcon: ({color}) => (
            <Entypo name={'folder'} size={25} color={color} />
          ),
        }}
      />


    <Tab.Screen
      name={'add-detection'}
      component={AddDetection}
      options={{ 
        title: "", // Dynamic title
        headerShown:false,
        headerTransparent: true,
        tabBarIcon: ({ color, focused }) => (
          // Enhanced tabBarIcon with a more visually appealing design
          <Animated.View
            style={{
              borderRadius: 5,
              backgroundColor: focused ? "magenta" : "lightgray",
              padding:5,
              opacity:focused ? 1: 0.5,
              transform: [
                {
                  scale: focused ? 1.3 : 1.3, // Animate scale when focused
                },
              ],
            }}
          >
            <Entypo name={'plus'} size={25} color={focused ? "white" : color} />
          </Animated.View>
        ),
      }}
    />


      {/* Detection */}
      <Tab.Screen
        name={'Assistant'}
        component={ChatCenter}
        options={{
          headerShown:false,
          headerTransparent: false,
          tabBarIcon: ({color}) => (
            <Entypo name={'heart'} size={25} color={color} />
          ),
          header:() => HeaderContainer({
            outerBg:"white",
            content:() => <View style={{justifyContent:'center',height:60,backgroundColor: "white",alignItems: 'center'}}>
                            <Text style={{fontSize: 20,fontWeight: "700"}}>Chats</Text>
                          </View>
          }) 
        }}
      />

      {/* PROFILE NAVIGATION */}
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          headerShown:false,
          headerTransparent:false,
          header: () => (
            <View style={{width:"100%",backgroundColor:"white",paddingTop:40,paddingBottom:10}} >
              <View style={{alignItems:"flex-end",width:"100%"}}>           
                  <TouchableOpacity style={{marginRight:30}} onPress={handleSettingsNavigation}>
                    <Icon
                      name='menu'
                      type='material'
                      color='black'
                      size={25}
                    />
                  </TouchableOpacity>
              </View>
            </View>
          ),
          tabBarIcon: ({color}) => (
            <Ionicons name={'person-outline'} size={25} color={color} />
          ),
        }}
  />
  </Tab.Navigator>
  );
};

export default HomeBottomTabNavigator;

const styles = StyleSheet.create({
  safeArea: {// or your desired background color
    flex:0,
  },
  header: {
    justifyContent: 'center',
    height:60,
    backgroundColor: 'white',
  
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
  },
});