import React, { useState } from 'react';
import { HandleLoginAttempt } from './apis';
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";


export const Home = () => { 
   const { value } = useAuth();
   const navigate = useNavigate();
   const [username, setUser] = useState('');
   const [password, setPassword] = useState('');

   function handleSubmit(event) {
      value.username = username;
      value.password = password;
      value.onLogin();
   }
   
   return (
      <>
         <h2>Home (Public)</h2>
         <form>
            <label>
               <input type="text" placeholder="Username" defaultValue="" onChange={e => setUser(e.target.value)}></input>
            </label>
            <label>
               <input type="password" placeholder="Password" defaultValue="" onChange={e => setPassword(e.target.value)}></input>
            </label>
            <label>
               <button type="button" onClick={() => handleSubmit({username, password})}>
                  Sign In
               </button>
            </label>
         </form>
      </>
   );
};