"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification, User, signOut } from "firebase/auth";
import { auth } from "../services/firebase.js";
import { fetchAllAssistantIDs } from "../services/api";

interface UserAuthContextProps {
  children: ReactNode;
}

interface AuthContextType {
  currentuser: User | null;
  Login: (email: string, password: string) => Promise<void>;
  SignUp?: () => void;
  error?: any;
}

const unauth_accessed_paths = [
  "/auth/login",
  "/"
]

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserAuthContextProvider");
  }
  return context;
}

const UserAuthContextProvider = ({ children }: UserAuthContextProps) => {

  const [currentuser, setuser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setuser(user);
        if (window.location.pathname === "/auth/login" || window.location.pathname === "/register") {
          window.location.href = "/assistant";
        }
        console.log(user.uid)
      } else {
        setuser(null);
        if (!unauth_accessed_paths.includes(window.location.pathname)) {
          window.location.replace("/");
        }
      }
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const Login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const response = await fetchAllAssistantIDs();
      if (response.includes(user.uid)) {
        window.location.href = "/assistant/dashboard";
      } else {
        alert("You do not have access to this!");
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
      alert("Wrong Email or Password");
    }
  }

  const value: AuthContextType = {
    currentuser,
    Login,
  }

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}

export default UserAuthContextProvider;
