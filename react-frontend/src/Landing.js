import React, { useEffect, useState } from "react";
/*import { AuthContext } from "./App.js";*/
import { useAuth, setToken } from "./context/AuthProvider";
import {getUsers, checkGoogleToken} from "./apis.js";
import Table from "./components/Table";
const queryParameters = new URLSearchParams(window.location.search);
const google_token = queryParameters.get("token");
if (google_token) {
  try { 
        checkGoogleToken(google_token)
        .then((res) => {
          if (res.status == 200) {
            document.cookie = `token=${google_token}`;
          } else {
            console.log("Google token no bueno");
          }
        })
        .catch((err) => {  
          console.log(err)
        });
      } catch (err) {
        console.log(err);
      }
}

export const Landing = () => {
  /*const token = React.useContext(AuthContext);*/
  const { value } = useAuth();
  const [characters, setCharacters] = useState([]);

  async function displayUsers() {
    const token = document.cookie.split("=")[1];
    if (token) {
      try {
        const response = getUsers(token);
        return response;
      } catch (error) {
        if (error.response.status === 401) alert("Unauthorized access");
        return false;
      }
    }
  }

  useEffect(() => {
    displayUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json))
    .catch((error) => { console.log(error); });
  }, [] );

  return (
    <>
      <h2>Landing (Protected)</h2>
      <Table characterData={characters}/>
      <div> Authenticated as {(document.cookie.split("=")[1])}</div>
    </>
  );
};