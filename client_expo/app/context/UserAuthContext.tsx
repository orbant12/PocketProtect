//<********************************************>
//LAST EDITED DATE: 2023.12.04
//EDITED BY: Orban Tamas
//DESCRIPTION: Context for user authentication
//<********************************************>

//BASIC IMPORTS
import { useContext, createContext, useEffect, useState} from "react"
import { useNavigation } from "@react-navigation/core";
//FIREBASE AUTH
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,signInWithCredential, GoogleAuthProvider  } from "firebase/auth";

//FIREBASE
import { auth,db} from "../services/firebase";
import { collection, doc, setDoc,getDoc} from "firebase/firestore";
import { UserData } from "../utils/types";
import { RootStackNavigationProp } from "../../App";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { User } from "../models/User";
import { Melanoma } from "../models/Melanoma";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();
export interface AuthContextType {
  currentuser: UserData| null;
  Login: (email: string, password: string) => Promise<boolean>;
  SignUp: (email: string, password: string,FullName:string) => Promise<boolean>;
  handleAuthHandler: (type:"disconnect" | "fetch" | "fetch_w_main") => void;
  handleGoogleAuth: () => void;
  error:any;
  melanoma: Melanoma | null;
}

//CREATE CONTEXT
const userContext = createContext<AuthContextType | undefined>(undefined);

//REFERENC TO ACCESS CODE
export const useAuth = () => { return useContext(userContext) }

const UserAuthContext = ({ children }) => {

//<********************VARIABLES************************>


const [currentuser, setuser] = useState<UserData| null>(null)
const [error, setError] = useState("")
const navigation = useNavigation<RootStackNavigationProp>();
const [isRegisterLoading, setIsRegisterLoading] = useState<boolean | "update" | "reset">("reset");
const [melanoma, setMelanoma] = useState<Melanoma | null>(null)


const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: "567381254436-b0cqltfecu40o0skrmiq77iiqp2h9njl.apps.googleusercontent.com",
  iosClientId: "567381254436-1mi5rsbhrhfe3lhf7if2nhqmf6fnuf22.apps.googleusercontent.com",
  webClientId: "567381254436-lihbplsc0fnmkqcs54460gg3ve93p1rg.apps.googleusercontent.com",
});

const ErrorClientHandler = (err:string,uid:string | null) => {
  console.log(err)
  if(err == "Request timed out" && (uid != null || uid != undefined)){
    setIsRegisterLoading("reset")  
    navigation.navigate("NoInternet", {uid:uid});
  } else if (err == "TypeError: Network request failed" || err == "[TypeError: Network request failed]" || err == "Network request failed"){
    setIsRegisterLoading("reset")  
    navigation.navigate("NoServer");
  } 
}


//<********************FUNCTIONS************************>


const handleSetup = async (currentuser) => {
  if(currentuser != null){
      const melanomaObj = new Melanoma(currentuser.uid,currentuser.gender)
      await melanomaObj.fetchAllMelanomaData()
      console.log("Melanoma Data READY")
      setMelanoma(melanomaObj)
  }
}



const handleLogin = async (uid:string) => {
  try {
    //WE HAVE USER & HE IS LOGGED IN
    const user = new User(uid)
    const response = await user.fetchUserData()
    if (response != null) {
      console.log("You are not logged in");
      ErrorClientHandler(response,uid)
    } else {
      const userData = user.getUserData()
      setuser(userData);
      console.log("You are logged in");
      navigation.navigate("Main");
      await handleSetup(userData)
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    ErrorClientHandler(error,uid)
    navigation.navigate("AuthHub");
  }
  setIsRegisterLoading("reset")
}

const handleUserContextUpdate  = async (uid:string) => {
  try {
    const user = new User(uid)
    await user.fetchUserData()
    const userData = user.getUserData()
    if (userData == null) {
      navigation.navigate("AuthHub");
    } else {
      setuser(userData);
      console.log("You are onboard");
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    navigation.navigate("AuthHub");
  }
  setIsRegisterLoading("reset")
}

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user && isRegisterLoading == false) {
      await handleLogin(user.uid)
    } else if (user && isRegisterLoading == "update"){
      //WE HAVE USER & HE IS Freshly REGISTERED
      await handleUserContextUpdate(user.uid)
    } else if (user && isRegisterLoading == "reset"){
      //FOR USEEFFECT CLEANUP
    } else if (user == null) {
      ErrorClientHandler("TypeError: Network request failed",null)
      setuser(null);
    } 
  });
  
  return () => unsubscribe();
}, [isRegisterLoading]);


useEffect(() => {
  setIsRegisterLoading(false)
},[])






// <====> LOGIN HANDLER <====>

const Login = async (email:string,password:string):Promise<boolean> => {
  const logEmail = email;
  const logPass = password
  try {
    await signInWithEmailAndPassword(auth,logEmail,logPass)
    .then((userCredential) => {
      setIsRegisterLoading(false);
    })
    return true
  } catch(error) {
    ErrorClientHandler(error,null)
    return false
  }
}


const SignUp = async (email:string, password:string, FullName:string) : Promise<boolean> => {
  
  const userFullName = FullName;
  const regEmail = email;
  const userPassword = password;

  try {
    setIsRegisterLoading(true);
    const result = await createUserWithEmailAndPassword(auth, regEmail, userPassword);
    const signeduser = result.user;
    const userId = signeduser.uid;
    const user = new User(userId)
    const resultData = await user.registerUser(userFullName,regEmail)
    if(resultData == true){
      setIsRegisterLoading("update");
    } 
    return resultData;
  } catch(err) {
    //ERROR IF ITS IN ALREADY USE
    if (err.code === "auth/email-already-in-use") {
      alert("Email already in use, try another email");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
      alert("Password must be at least 6 characters");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      setError(err.message);
    }
    return err.message
  }
}

const handleAuthHandler = (type:"disconnect" | "fetch" | "fetch_w_main") => {
  if (type == "disconnect") {
    setIsRegisterLoading(true);
  } else if (type == "fetch") {
    setIsRegisterLoading("update");
  } else if (type == "fetch_w_main") {
    setIsRegisterLoading(false);
  }
}


const checkIfNewUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  return !userDoc.exists();
};

const handleMore = async ({credential}) => {
  try {
      const userCredential = await signInWithCredential(auth, credential);
      
      const user = userCredential.user;
      const isNewUser = await checkIfNewUser(user.uid);

      const userData = {
          email: user.email,
          fullname: user.displayName,
          profileUrl: user.photoURL,
          uid: user.uid,
          gender:"",
          user_since: new Date().toLocaleDateString(),
          birth_date: null,
      };
      if (isNewUser) {
          await saveUserToDatabase(userData);
          console.log("New user registered and saved to database");
          navigation.navigate("RegOnBoarding");
          handleAuthHandler("fetch")
      } else {
          console.log("Existing user logged in");
          handleAuthHandler("fetch_w_main")
      }

      // You can perform additional actions here, like updating UI or navigating to a new screen
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(`Error during sign-in: ${error.message}`);
    }
}

const saveUserToDatabase = async (userData) => {
  const colRef = collection(db, "users")
  await setDoc(doc(colRef, userData.uid), userData);
};


const handleGoogleAuth = async () => {
  try {
      console.log("Starting Google Auth");
      await promptAsync();
  } catch (error) {
    console.error("Error during Google Auth:", error);
    alert(`Error during Google Auth: ${error.message}`);
  }
};

useEffect(() => {
  if(response !== null){
  if (response.type === "success") {
      console.log("Full result.params:", JSON.stringify(response, null, 2));

      if (!response.params.id_token) {
          throw new Error("No ID token received from Google");
      }
      const credential = GoogleAuthProvider.credential(response.params.id_token);
      console.log("Credential created");
      handleAuthHandler("disconnect") 
      handleMore({credential:credential});
}
}
},[response])


//<********************RETURN************************>

const value = {
    SignUp,
    error,
    currentuser,
    Login,
    handleAuthHandler,
    handleGoogleAuth,
    melanoma
}

return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
)}

export default UserAuthContext




