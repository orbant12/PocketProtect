//<********************************************>
//LAST EDITED: 2023.12.04
//EDITED BY: Orban Tamas
//DESC: This is the bottom tab navigation for the home page. It contains the following tabs: Home, Search, Upload, Inbox, Profile
//<********************************************>

//BASIC IMPORTS
import React,{useState} from 'react';
import {Image, Text,View,TouchableOpacity,Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//COMPONENTS
import TabOneScreen from '../pages/home';
import ForYouPage from '../pages/DetectionScreens/melanoma';
import Profile from '../pages/profile';
import AssistantPage from '../pages/Personal_Assistant';
import Detecttion from '../pages/detection';
import HealthMesure from '../pages/DetectionScreens/healthMesure';
import AddDetection from '../pages/addDetection'


//ICONS
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

//NAVIGATION TAB CREATION
const Tab = createBottomTabNavigator();


const HomeBottomTabNavigator = ({navigation}) => {

//<**********************FUNCTIONS******************************>

//SETTINGS NAVIGATION
const handleSettingsNavigation = () => {
  navigation.navigate("SettingsPage")
}

//<**********************VARIABLES******************************>
const [isExplore,setIsExplore] = useState(true);

return (
  <Tab.Navigator
    tabBarOptions={{
      tabStyle: {
        backgroundColor: '#fff',
      },
      activeTintColor: 'magenta',
   
    }}>
      {/* HOME NAVIGATION */}
      <Tab.Screen
        name={'Home'}
        component={isExplore ? TabOneScreen : ForYouPage}
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
        component={HealthMesure}
        options={{
          headerShown: false,
          headerTransparent: true,
          header : () => (
            <></>
          ),
          tabBarIcon: ({color}) => (
            <Entypo name={'folder'} size={25} color={color} />
          ),
        }}
      />


    <Tab.Screen
      name={'add-detection'}
      component={AddDetection}
      options={{
        header: () => (
          // Customized header component with a unique visual element
          <>
          </>
        ),
        title: "", // Dynamic title
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
        component={AssistantPage}
        options={{
          header : () => (
            <>
              <View style={{marginTop:60,marginLeft:65,marginRight:"auto",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",width:"65%",zIndex:5}}>
                <TouchableOpacity onPress={() => setIsExplore(true)} style={isExplore? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                  <Text style={isExplore?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:800,color:"black"}}>AI Assistant</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsExplore(false)} style={!isExplore? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                  <Text style={isExplore?{opacity:0.4,fontWeight:800,color:"black"}:{fontWeight:"800",color:"black"}}>Context Panel</Text>
                </TouchableOpacity>
              </View>
            </>
            ),
          headerTransparent: true,
          tabBarIcon: ({color}) => (
            <Entypo name={'heart'} size={25} color={color} />
          ),
        }}
      />

      {/* PROFILE NAVIGATION */}
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          headerShown:true,
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