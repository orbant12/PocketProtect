//<********************************************>
//LAST EDITED DATE: 2023.12.04
//EDITED BY: Orban Tamas
//DESCRIPTION: Context for user authentication
//<********************************************>

//BASIC IMPORTS
import { useContext, createContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/core";

//FIREBASE AUTH
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,sendEmailVerification  } from "firebase/auth";

//FIREBASE
import { auth,db} from "../services/firebase";
import { collection, doc, setDoc,getDoc} from "firebase/firestore";

//CREATE CONTEXT
const userContext = createContext();

//REFERENC TO ACCESS CODE
export const useAuth = () => { return useContext(userContext) }

const UserAuthContext = ({ children }) => {

//<********************VARIABLES************************>

const [currentuser, setuser] = useState()
const [error, setError] = useState("")
const navigation = useNavigation();

//<********************FUNCTIONS************************>

// <====> Auth State Listener <====>

onAuthStateChanged(auth, user => {
  console.log(user)
    if (user) {
      setuser(user)
      console.log("u are logged in")
      navigation.navigate("Main") 
    }
    else {
      navigation.navigate("AuthHub") 
    }
})


// <====> LOGIN HANDLER <====>

const Login = async (email,password) => {
  const logEmail = email;
  const logPass = password
  try {
    await signInWithEmailAndPassword(auth,logEmail,logPass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    
    })
  } catch(error) {
    console.log(error)
    alert("Wrong Email or Password")
  }
}


// <====> GOOGLE HANDLER <====>

const GoogleLogin = async (result) => {
  const user = result.user;
  console.log(user)
}

// <====> REGISTER HANDLER <====>

const RegisterUserData = async ({
  userId,
  userFullName,
  regEmail,
}) => {
  try {
    const colRef = collection(db, "users");
    await setDoc(doc(colRef, userId),{
      id: userId,
      fullname: userFullName,
      email: regEmail,
      profilePictureURL: "",
      user_since: new Date().toLocaleDateString(),
      gender: "",
      birth_date: null,
    });
    console.log("Document successfully added!");
    await sendEmailVerification(signeduser)
  } catch (error) {
    console.error("Error adding document: ", error);
  };
}

const SignUp = async (email, password, FullName) => {

  const userFullName = FullName;
  const regEmail = email;
  const userPassword = password;

  try {
    const result = await createUserWithEmailAndPassword(auth, regEmail, userPassword);

    const signeduser = result.user;
    const userId = signeduser.uid;

    await RegisterUserData({
      userId,
      userFullName,
      regEmail,
    });
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


//<********************RETURN************************>

const value = {
    SignUp,
    error,
    currentuser,
    Login,
}

return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
)}

export default UserAuthContext