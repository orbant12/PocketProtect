//<********************************************>
//LAST EDITED DATE: 2023.12.04
//EDITED BY: Orban Tamas
//DESCRIPTION: Context for user authentication
//<********************************************>

//BASIC IMPORTS
import { useContext, createContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/core";

//FIREBASE AUTH
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,sendEmailVerification, signInWithCredential, GoogleAuthProvider  } from "firebase/auth";

//FIREBASE
import { auth,db} from "../services/firebase";
import { collection, doc, setDoc,getDoc} from "firebase/firestore";
import { UserData } from "../utils/types";
import { RootStackNavigationProp } from "../../App";
import { fetchUserData } from "../services/server";
import { Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
export interface AuthContextType {
  currentuser: UserData| null;
  Login: (email: string, password: string) => Promise<boolean>;
  SignUp: (email: string, password: string,FullName:string) => Promise<boolean>;
  handleAuthHandler: (type:"disconnect" | "fetch" | "fetch_w_main") => void;
  handleGoogleAuth: () => void;
  error:any;
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
const [isRegisterLoading, setIsRegisterLoading] = useState<boolean | "onboard" | "reset">(false);

const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: "567381254436-b0cqltfecu40o0skrmiq77iiqp2h9njl.apps.googleusercontent.com",
  iosClientId: "567381254436-1mi5rsbhrhfe3lhf7if2nhqmf6fnuf22.apps.googleusercontent.com",
  webClientId: "567381254436-lihbplsc0fnmkqcs54460gg3ve93p1rg.apps.googleusercontent.com",
});


//<********************FUNCTIONS************************>

// <====> Auth State Listener <====>

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user && isRegisterLoading == false) {
      try {
        const userData = await fetchUserData({ userId: user.uid });
        if (userData == null) {
          navigation.navigate("AuthHub");
          console.log("You are not logged in");
        } else {
          setuser(userData);
          console.log("You are logged in");
          navigation.navigate("Main");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        navigation.navigate("AuthHub");
      }
    } else if (user && isRegisterLoading == "onboard"){
      try {
        const userData = await fetchUserData({ userId: user.uid });
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
    } else if (user && isRegisterLoading == "reset"){

    } else if (user == null) {
      navigation.navigate("AuthHub");
      setuser(null);
    }
  });

  // Cleanup subscription on unmount
  return () => unsubscribe();
}, [isRegisterLoading]);


// <====> LOGIN HANDLER <====>

const Login = async (email:string,password:string):Promise<boolean> => {
  const logEmail = email;
  const logPass = password
  try {
    await signInWithEmailAndPassword(auth,logEmail,logPass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setIsRegisterLoading(false);
    })
    return true
  } catch(error) {
    console.log(error)
    alert("Wrong Email or Password")
    return false
  }
}


// <====> GOOGLE HANDLER <====>

const GoogleLogin = async (result:any) => {
  const user = result.user;
  console.log(user)
}

// <====> REGISTER HANDLER <====>

const RegisterUserData = async ({
  userId,
  userFullName,
  regEmail,
}):Promise<void> => {
  try {
    const colRef = collection(db, "users");
    await setDoc(doc(colRef, userId),{
      uid: userId,
      fullname: userFullName,
      email: regEmail,
      profileUrl: "",
      user_since: new Date().toLocaleDateString(),
      gender: "",
      birth_date: null,
    });
    console.log("Document successfully added!");
    await sendEmailVerification(regEmail)
    return
  } catch (error) {
    console.error("Error adding document: ", error);
    return
  };
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

    await RegisterUserData({
      userId: userId,
      userFullName: userFullName,
      regEmail: regEmail,
    });
    setIsRegisterLoading("onboard");
    return true
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
    setIsRegisterLoading("onboard");
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
    handleGoogleAuth
}

return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
)}

export default UserAuthContext




