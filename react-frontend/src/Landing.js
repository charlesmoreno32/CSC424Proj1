import React, { useEffect, useState } from "react";
/*import { AuthContext } from "./App.js";*/
import { useAuth } from "./context/AuthProvider";
import {getUsers} from "./apis.js";
import Table from "./components/Table";

export const Landing = () => {
  /*const token = React.useContext(AuthContext);*/
  const { value } = useAuth();
  const [characters, setCharacters] = useState([]);

  async function displayUsers() {
    const cookie = document.cookie.split("=")[1];
    if (cookie) {
      try {
        const response = getUsers(cookie);
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
      <div> Authenticated as {value.token}</div>
    </>
  );
};