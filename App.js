//<********************************************>
//Last Update: 2024/05/10
//Edited by: Orban Tamas
//Desc: This is the main file of the application. It contains the navigation stack and the context provider.
//<********************************************>

//BASE IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//COMPONENTS
import LoginPage from "./app/pages/login";
import UserAuthContext from "./app/context/UserAuthContext";
import HomeBottomTabNavigator from "./app/navigation/homeBottomTabNavigation";
import FolderPage from "./app/pages/Screens/folderPage";
import SettingsPage from "./app/pages/Screens/SettingsPage"
import GeneralSettings from "./app/pages/Screens/generalSettings/generalSettings"
import RegisterPage from "./app/pages/register";
import MelanomaAdd from "./app/pages/Screens/Melanoma/melanomaAdd";
import SinglePartAnalasis from "./app/pages/Screens/Melanoma/singlePart";
import SlugAnalasis from "./app/pages/Screens/Melanoma/slugAnalasis";
import MelanomaFullProcess from "./app/pages/ProcessScreens/melanomaFullProcess";
import MelanomaSingleSlug from "./app/pages/ProcessScreens/melanomaSingleSlug";
import AuthHub from "./app/pages/Screens/Login/authHub"
import RegOnBoarding from "./app/pages/Screens/Login/regOnBoarding";
import DailyReport from "./app/pages/DailyReportScreens/dailyReportOnboarding";
import SurveyScreeen from "./app/pages/Screens/Diagnosis/SurveyScreen";

import { View, Text } from "react-native"
import BloodWorkPage from "./app/pages/PersonalData/bloodWork";
import SingleFeature from "./app/pages/Screens/DetectionMenu/singleFeature";


//CREATING THE NAVIGATION STACK
const Stack = createNativeStackNavigator();

export default function App() {
return (
<NavigationContainer>
    <UserAuthContext>
        <Stack.Navigator initialRouteName="AuthHub">
            <Stack.Screen name="AuthHub" component={AuthHub} options={{ headerShown:false}} />
            <Stack.Screen name="RegOnBoarding" component={RegOnBoarding} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerBackVisible:false,headerLeftShown:false,headerTitle:"Welcome !"}} />
            <Stack.Screen name="Login" component={LoginPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="SurveyScreen" component={SurveyScreeen} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerBackVisible:false,headerLeftShown:false,
                header : () => (
                    <View style={{width:"100%",height:100,justifyContent:"center",backgroundColor:"black",padding:20,alignItems:"center"}}>
                        <View style={{justifyContent:"center",borderWidth:0,borderColor:"white"}}>
                            <Text style={{fontWeight:"600",color:"white",fontSize:15,opacity:0.6,marginBottom:5}}>
                                For a more accurate diagnosis !
                            </Text>

                            <Text style={{fontWeight:"700",color:"white",fontSize:20}}>
                                Please answer these questions
                            </Text>
                        </View>                                            
                    </View>
            ),} } />
            <Stack.Screen name="DailyReport" component={DailyReport} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerTitle:"Daily Report" }} />
            <Stack.Screen name="Register" component={RegisterPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="Main" component={HomeBottomTabNavigator} options={{ headerShown:false}} />
            <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown:true,title:"Settings"}} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings}   options={({ route }) => ({ title: route.params.data,headerStyle: { backgroundColor: "#18191a"},headerTintColor: "white" })} />
            <Stack.Screen name="MelanomaAdd" component={MelanomaAdd}   options={({ route }) => ({ title:"+ Mole", headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="SinglePartAnalasis" component={SinglePartAnalasis}   options={({ route }) => ({ title: route.params.data.melanomaId.charAt(0).toUpperCase() + route.params.data.melanomaId.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="SlugAnalasis" component={SlugAnalasis}   options={({ route }) => ({ title: route.params.data.slug.charAt(0).toUpperCase() + route.params.data.slug.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="FolderPage" component={FolderPage}   options={({ route }) => ({ title: route.params.data.title, headerStyle: { backgroundColor: "#18191a"},headerTintColor: "white"  })} />
            <Stack.Screen name="FeaturePage" component={SingleFeature}   options={({ route }) => ({ title: route.params.data.title, headerStyle: { backgroundColor: "white"},headerTintColor: "black"  })} />
            <Stack.Screen name="FullMelanomaProcess" component={MelanomaFullProcess}   options={({ route }) => ({ title: "Body Select",headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" , 
                header : () => (
                        <View style={{width:"100%",height:80,justifyContent:"center",backgroundColor:"black",padding:20,alignItems:"center"}}>
                            <View style={{justifyContent:"center",borderWidth:0,borderColor:"white"}}>
                                <Text style={{fontWeight:"600",color:"white",fontSize:15,opacity:0.6,marginBottom:5}}>
                                    Setup
                                </Text>

                                <Text style={{fontWeight:"700",color:"white",fontSize:20}}>
                                    Melanoma Monitor
                                </Text>
                            </View>                                            
                        </View>
            )})} />            
            <Stack.Screen name="MelanomaProcessSingleSlug" component={MelanomaSingleSlug}   options={({ route }) => ({ title: route.params.data.slug.charAt(0).toUpperCase() + route.params.data.slug.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="Add_BloodWork" component={BloodWorkPage}   options={({ route }) => ({ title: "Body Select",headerStyle: { backgroundColor: "white"},headerTintColor: "black" , 
                header : () => (
                        <View style={{width:"100%",height:80,justifyContent:"center",backgroundColor:"black",padding:20,alignItems:"center"}}>
                            <View style={{justifyContent:"center",borderWidth:0,borderColor:"white"}}>
                                <Text style={{fontWeight:"600",color:"white",fontSize:15,opacity:0.6,marginBottom:5}}>
                                    Setup
                                </Text>

                                <Text style={{fontWeight:"700",color:"white",fontSize:20}}>
                                    Melanoma Monitor
                                </Text>
                            </View>                                            
                        </View>
            )})} />
        </ Stack.Navigator>
    </UserAuthContext>
</NavigationContainer>   
)
}