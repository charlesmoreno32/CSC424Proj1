import React, { useState } from 'react';
import { handleLoginAttempt } from './apis';
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";


export const Home = ({ onLogin }) => { 
   /*const { value } = useAuth();*/
   const navigate = useNavigate();
   const [username, setUser] = useState('');
   const [password, setPassword] = useState('');

   /*const handleLoginAttempt = (username, pass) => {
      if (username === "bj" && pass === "pass424") {
         value.onLogin();
      } else {
         alert("Login Attempt Failed. Invalid username or password.")
      }
   }*/
   function handleSubmit(event) {
      handleLoginAttempt(
        {
          username: username,
          password: password
        }
      )
        .then((res) => {
          console.log(res);
          navigate("/landing");
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
         </form>
      </>
   );
};