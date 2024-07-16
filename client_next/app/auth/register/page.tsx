//FIREBASE LOGIN PAGE FOR AUTH CONTEXT
"use client";

import React, { useState } from 'react';

import "../css/auth.css"
//import { useAuth } from './Context/Userauthcontext'
import { GoogleOriginal, GoogleOriginalWordmark, GooglecloudOriginal, GooglecloudOriginalWordmark, KaggleOriginal, LinuxOriginal, OpenapiOriginalWordmark, } from 'devicons-react';


export default function Register() {
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  //const { login } = useContext(useAuth);

function handleSubmit() {
alert('You have successfully logged in');
}

return (
<div className='register-page'>

    <div className='login-right'>
        <div className='register-right-content'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Email</label>
                    <input type='email' placeholder='Email here' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Fullname</label>
                    <input type='text' placeholder='Name here' value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password' placeholder='Password here' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Confirm Password</label>
                    <input type='password' placeholder='Password again' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <button type='submit'>Register</button>
                </div>
            </form>
        </div>
        <div className='google-login'>
            <GoogleOriginal style={{padding:8,borderRadius:10}} size={50} opacity={1} />
    </div>
    </div>

    <div className='register-details'>
        <div className='details-container'>
            <div className='details-title'>
                <h5>You can provide this later</h5>
                <h1>Additional Details</h1>
            </div>

            <div className='details-form'>
                <div className='form-row'>
                    <div className='form-group'>
                        <label>Birthday</label>
                        <input type='date' />
                    </div>

                    <div className='form-group'>
                        <label>Gender</label>
                        <input type="text" />
                    </div>
                </div>

                <div className='form-row'>
                    <div className='form-group'>
                        <label>Most Recent Bloodtest</label>
                        <input type='file' />
                    </div>

                    <div className='form-group'>
                        <label>Allergy</label>
                        <input type="text" />
                    </div>
                </div>

                <div className='form-row'>
                    <div className='form-group'>
                        <label>Most Recent Bloodtest</label>
                        <input type='file' />
                    </div>

                    <div className='form-group'>
                        <label>Allergy</label>
                        <input type="text" />
                    </div>
                </div>
            </div>
        
        </div>
    </div>
</div>
);
}





