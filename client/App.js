
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from "./app/pages/Auth/login";
import UserAuthContext from "./app/context/UserAuthContext";
import HomeBottomTabNavigator from "./app/navigation/homeBottomTabNavigation";
import SettingsPage from "./app/pages/Profile/Settings/SettingsPage"
import GeneralSettings from "./app/pages/Profile/Settings/generalSettings/generalSettings"
import RegisterPage from "./app/pages/Auth/register";
import MelanomaAdd from "./app/pages/Libary/Melanoma/melanomaAdd";
import SinglePartAnalasis from "./app/pages/Libary/Melanoma/singlePart";
import SlugAnalasis from "./app/pages/Libary/Melanoma/slugAnalasis";
import MelanomaFullProcess from "./app/pages/Libary/Melanoma/ProcessScreens/melanomaFullProcess";
import MelanomaSingleSlug from "./app/pages/Libary/Melanoma/ProcessScreens/melanomaSingleSlug";
import AuthHub from "./app/pages/Auth/Login/authHub"
import RegOnBoarding from "./app/pages/Auth/Login/regOnBoarding";
import DailyReport from "./app/pages/Home/DailyReportScreens/dailyReportOnboarding";
import SurveyScreeen from "./app/pages/Add/Diagnosis/SurveyScreen";
import BloodWorkPage from "./app/pages/Libary/BloodCenter/bloodWork";
import MelanomaCenter from "./app/pages/Libary/Melanoma/melanomaCenter";
import AllMelanomaAdd from "./app/pages/Libary/Melanoma/allMelanomaAdd";
import BloodCenter from "./app/pages/Libary/BloodCenter/bloodCenter";
import DiagnosisCenter from "./app/pages/Add/Diagnosis/diagnosisCenter";
import AssesmentScreen from "./app/pages/Home/DailyReportScreens/assesmentScreen";
import CameraView from "./app/pages/Libary/Melanoma/components/cameraView";
import { StripeProvider } from '@stripe/stripe-react-native';
import AssistCenter from "./app/pages/Assist/assistCenter";
import AssistantPage from "./app/pages/Chat/Personal_Assistant";

const Stack = createNativeStackNavigator();

export default function App() {
return (
<NavigationContainer>
    <UserAuthContext>
        <StripeProvider
            publishableKey="pk_test_51PRx4QGWClPUuUnF9GNoIEOpKugJy30Sip6vstMnPwaaojxw4vJ2DWZwRPs9mabQcX7DolDjT6s4TJHbZSfBWxZI00nrYjmKNm"
        >
        <Stack.Navigator initialRouteName="AuthHub">
            <Stack.Screen name="AuthHub" component={AuthHub} options={{ headerShown:false}} />
            <Stack.Screen name="RegOnBoarding" component={RegOnBoarding} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerBackVisible:false,headerLeftShown:false,headerTitle:"Welcome !"}} />
            <Stack.Screen name="Login" component={LoginPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="SurveyScreen" component={SurveyScreeen} options={{headerStyle: { backgroundColor: "black", headerShown:false},headerTintColor: "white",headerBackVisible:false,headerLeftShown:false} } />
            <Stack.Screen name="DailyReport" component={DailyReport} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerTitle:"Daily Report" }} />
            <Stack.Screen name="Register" component={RegisterPage} options={{headerStyle: { backgroundColor: "black"},headerTintColor: "white"}} />
            <Stack.Screen name="Main" component={HomeBottomTabNavigator} options={{ headerShown:false}} />
            <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown:true,title:"Settings"}} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings}   options={({ route }) => ({ title: route.params.data,headerStyle: { backgroundColor: "#18191a"},headerTintColor: "white" })} />
            <Stack.Screen name="MelanomaAdd" component={MelanomaAdd}   options={({ route }) => ({ title:"+ Mole", headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black", headerShown:false })} />
            <Stack.Screen name="MelanomaAllAdd" component={AllMelanomaAdd}   options={({ route }) => ({ title:"+ Mole", headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black", headerShown:false  })} />
            <Stack.Screen name="SinglePartAnalasis" component={SinglePartAnalasis}   options={({ route }) => ({ title: route.params.melanomaId.charAt(0).toUpperCase() + route.params.melanomaId.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black", headerShown:false })} />
            <Stack.Screen name="SlugAnalasis" component={SlugAnalasis}   options={({ route }) => ({ title: route.params.data.slug.charAt(0).toUpperCase() + route.params.data.slug.slice(1), headerShown:false, headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black" })} />            
            <Stack.Screen name="MelanomaCenter" component={MelanomaCenter}   options={() => ({ headerStyle: { backgroundColor: "white", },headerTintColor: "black",headerShown:false  })} />
            <Stack.Screen name="BloodCenter" component={BloodCenter}   options={({ route }) => ({ title: "", headerStyle: { backgroundColor: "white"},headerTintColor: "black", headerShown:false  })} />
            <Stack.Screen name="CameraView" component={CameraView}   options={({ route }) => ({ title: "", headerStyle: { backgroundColor: "white"},headerTintColor: "black", headerShown:false  })} />
            <Stack.Screen name="DiagnosisCenter" component={DiagnosisCenter}   options={({ route }) => ({ title: "", headerStyle: { backgroundColor: "white"},headerTintColor: "black", headerShown:false  })} />
            <Stack.Screen name="FullMelanomaProcess" component={MelanomaFullProcess}   options={({ route }) => ({ title: "Melanoma Setup",headerStyle: { backgroundColor: "black"},headerTintColor: "white",headerBackVisible:false,headerTitleStyle:{fontWeight:"700",fontSize:18}})} />          
            <Stack.Screen name="MelanomaProcessSingleSlug" component={MelanomaSingleSlug}   options={({ route }) => ({ title: route.params.bodyPart.slug.charAt(0).toUpperCase() + route.params.bodyPart.slug.slice(1),headerStyle: { backgroundColor: "#ffff"},headerTintColor: "black", headerShown:false })} />
            <Stack.Screen name="Add_BloodWork" component={BloodWorkPage}   options={({ route }) => ({ title: "+ Add Blood Work",headerStyle: { backgroundColor: "black"},headerTintColor: "white" , headerShon:true, headerBackVisible:false})} />
            <Stack.Screen name="AssesmentScreen" component={AssesmentScreen}   options={({ route }) => ({ title: route.title,headerStyle: { backgroundColor: "black"},headerTintColor: "white" , headerShon:true, headerBackVisible:false})} />
            <Stack.Screen name="AssistCenter" component={AssistCenter}   options={({ route }) => ({ title: "",headerStyle: { backgroundColor: "black"},headerTintColor: "white" , headerShown:false,headerBackTitleVisible:false})} />
            <Stack.Screen name="AI_Assistant" component={AssistantPage}   options={({ route }) => ({ title: "",headerStyle: { backgroundColor: "black"},headerTintColor: "white" , headerShown:false,headerBackTitleVisible:false})} />
        </ Stack.Navigator>
    </StripeProvider>
    </UserAuthContext>
</NavigationContainer>   
)
}



