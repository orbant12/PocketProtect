
"use client";

import React, { useState } from 'react';
import "../css/auth.css"
import { useAuth } from '@/Context/UserAuthContext';
import { GoogleOriginal, GoogleOriginalWordmark, GooglecloudOriginal, GooglecloudOriginalWordmark, KaggleOriginal, LinuxOriginal, OpenapiOriginalWordmark, } from 'devicons-react';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {Login, currentuser} = useAuth()

const handleSubmit = async () => {
    await Login(email,password)
}

return (
<div className='login-page'>
    <div className='login-left'>
        <div className='login-left-content'>
            <h1>Welcome Back!</h1>
            <p>Login to access your account</p>
        </div>
    </div>

    <div className='login-right'>
        <div className='login-right-content'>
            <h1>Assistant Login</h1>
            <h5 style={{marginTop:-30,width:300,opacity:0.3}}>This login form is for registered assistants working for Pocket Protect</h5>
            <form>
                <div className='form-group'>
                    <label>Email</label>
                    <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='other'>
                    <div className='remember-me'>
                        <input type='checkbox' />
                        <label style={{marginLeft:10,fontWeight:"500",fontSize:13,opacity:0.7}}>Remember me</label>
                    </div>
                    <div className='forgot-pass'>
                        <a href='#'>Forgot Password?</a>
                    </div>
                </div>
                <div className='form-group'>
                    <div onClick={handleSubmit}>
                    <h3>Login</h3>
                    </div>
                </div>
            </form>
        </div>
        <div className='google-login'>
            <GoogleOriginal style={{padding:8,borderRadius:10}} size={50} opacity={1} />
    </div>
    </div>
</div>
);
}



