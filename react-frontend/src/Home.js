import React, { useState } from 'react';
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";
import {HandleLoginAttempt} from "./apis.js"


export const Home = () => { 
   const { value } = useAuth();
   const navigate = useNavigate();
   const [username, setUser] = useState('');
   const [password, setPassword] = useState('');

   function handleSubmit(event) {
      value.username = username;
      value.password = password;
      HandleLoginAttempt({username: value.username, password: value.password})
      .then((res) => res.json())
      .then((res) => {
         value.onLogin(res.token);
      })
      .catch((exception) => console.log(exception));
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
            <label>
               <button type="button" onClick={() => navigate("/registration")}>
                  Register
               </button>
            </label>
         </form>
      </>
   );
};