import React, { useState } from 'react';
import { handleRegistrationAttempt } from './apis';
import { useAuth } from "./context/AuthProvider";


export const Registration = () => { 
   /*const { value } = useAuth();*/
   const [user, setUser] = useState('');
   const [password, setPassword] = useState('');
   const [password2, setPassword2] = useState('');

   /*const handleLoginAttempt = (username, pass) => {
      if (username === "bj" && pass === "pass424") {
         value.onLogin();
      } else {
         alert("Login Attempt Failed. Invalid username or password.")
      }
   }*/
   
   return (
      <>
         <h2>Register (Public)</h2>
         <form>
            <label>
               <input type="text" placeholder="Username" defaultValue="" onChange={e => setUser(e.target.value)}></input>
            </label>
            <label>
               <input type="password" placeholder="Password" defaultValue="" onChange={e => setPassword(e.target.value)}></input>
            </label>
            <label>
               <input type="password" placeholder="Confirm Password" defaultValue="" onChange={e => setPassword2(e.target.value)}></input>
            </label>
            <label>
               <button type="button" onClick={() => handleRegistrationAttempt({user, password, password2})}>
                  Sign Up
               </button>
            </label>
         </form>
      </>
   );
};