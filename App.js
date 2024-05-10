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
import FilePage from "./app/pages/Screens/filePage";
import FolderPage from "./app/pages/Screens/folderPage";
import SettingsPage from "./app/pages/Screens/SettingsPage"
import GeneralSettings from "./app/pages/Screens/generalSettings/generalSettings"
import EpisodeEdit from "./app/pages/Screens/generalSettings/creatorSettings/episodeEdit"
import RegisterPage from "./app/pages/register";
import MelanomaAdd from "./app/pages/Screens/Melanoma/melanomaAdd";
import SinglePartAnalasis from "./app/pages/Screens/Melanoma/singlePart";
import SlugAnalasis from "./app/pages/Screens/Melanoma/slugAnalasis";
import MelanomaFullProcess from "./app/pages/ProcessScreens/melanomaFullProcess";
import MelanomaSingleSlug from "./app/pages/ProcessScreens/melanomaSingleSlug";
import AuthHub from "./app/pages/Screens/Login/authHub"
import RegOnBoarding from "./app/pages/Screens/Login/regOnBoarding";


//CREATING THE NAVIGATION STACK
const Stack = createNativeStackNavigator();

export default function App() {
return (
<NavigationContainer>
    <UserAuthContext>
        <Stack.Navigator initialRouteName="AuthHub">
            <Stack.Screen name="AuthHub" component={AuthHub} options={{ headerShown:false}} />
            <Stack.Screen name="RegOnBoarding" component={RegOnBoarding} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="Login" component={LoginPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="Register" component={RegisterPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="Home" component={HomeBottomTabNavigator} options={{ headerShown:false}} />
            <Stack.Screen name="ClipPage" component={FilePage}   options={({ route }) => ({ title: route.params.data.title,headerStyle: { backgroundColor: "#fff"},headerTintColor: "white" })} />
            <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown:true,title:"Settings"}} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings}   options={({ route }) => ({ title: route.params.data,headerStyle: { backgroundColor: "#18191a"},headerTintColor: "white" })} />
            <Stack.Screen name="EpisodeEdit" component={EpisodeEdit}   options={{ headerShown:true,title:"Manage Episodes"}} />
            <Stack.Screen name="MelanomaAdd" component={MelanomaAdd}   options={({ route }) => ({ title:"Add Birthmark", headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="SinglePartAnalasis" component={SinglePartAnalasis}   options={({ route }) => ({ title: route.params.data.melanomaId.charAt(0).toUpperCase() + route.params.data.melanomaId.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="SlugAnalasis" component={SlugAnalasis}   options={({ route }) => ({ title: route.params.data.slug.charAt(0).toUpperCase() + route.params.data.slug.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="FolderPage" component={FolderPage}   options={({ route }) => ({ title: route.params.data.title, headerStyle: { backgroundColor: "#18191a"},headerTintColor: "white"  })} />
            <Stack.Screen name="FullMelanomaProcess" component={MelanomaFullProcess}   options={({ route }) => ({ title: "Body Select",headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
            <Stack.Screen name="MelanomaProcessSingleSlug" component={MelanomaSingleSlug}   options={({ route }) => ({ title: route.params.data.slug.charAt(0).toUpperCase() + route.params.data.slug.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />
        </ Stack.Navigator>
    </UserAuthContext>
</NavigationContainer>   
)
}