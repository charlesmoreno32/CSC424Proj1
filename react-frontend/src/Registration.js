import React, { useState } from 'react';
import { useAuth } from "./context/AuthProvider";
import {HandleRegistrationAttempt} from "./apis.js";
import { useNavigate } from "react-router-dom";


export const Registration = () => { 
   const { value } = useAuth();
   const navigate = useNavigate();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [password2, setPassword2] = useState('');
   const [phone, setPhone] = useState('');

   function handleSubmit(event) {
      value.username = username;
      value.password = password;
      value.password2 = password2;
      value.phone = phone;
      HandleRegistrationAttempt({username: value.username, password: value.password, password2: value.password2, phone: value.phone})
      .then((res) => res.json())
      .then((res) => {
         value.onLogin(res.token);
         navigate("/landing");
      })
      .catch((exception) => console.log(exception));
   }
   
   return (
      <>
         <h2>Register (Public)</h2>
         <form>
            <label>
               <input type="text" placeholder="Username" defaultValue="" onChange={e => setUsername(e.target.value)}></input>
            </label>
            <label>
               <input type="text" placeholder="Phone #" defaultValue="" onChange={e => setPhone(e.target.value)}></input>
            </label>
            <label>
               <input type="password" placeholder="Password" defaultValue="" onChange={e => setPassword(e.target.value)}></input>
            </label>
            <label>
               <input type="password" placeholder="Confirm Password" defaultValue="" onChange={e => setPassword2(e.target.value)}></input>
            </label>
            <label>
               <button type="button" onClick={() => handleSubmit({username, password, password2, phone})}>
                  Sign Up
               </button>
            </label>
         </form>
      </>
   );
};