import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
import {HandleLoginAttempt,
  HandleRegistrationAttempt} from "../apis.js"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    HandleLoginAttempt({username: value.username, password: value.password})
    .then((res) => res.json())
    .then((res) => {
        if(res.token == "2342f2f1d131rf12"){
          setToken(res.token);
          navigate("/landing")
        } else {
          console.log("Login Attempt Failed. Invalid username or password")
        };
      })
    .catch((exception) => console.log(exception));
  };

  const handleRegistration = async () => {
    HandleRegistrationAttempt({username: value.username, password: value.password, password2: value.password2, phone: value.phone})
    .then((res) => res.json())
    .then((res) => {
        if(res.token == "2342f2f1d131rf12"){
          setToken(res.token);
          navigate("/landing")
        } else {
          console.log("Login Attempt Failed. Invalid username or password")
        };
      })
    .catch((exception) => console.log(exception));
  }

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    username: "",
    password: "",
    password2: "",
    phone: "",
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegistration: handleRegistration,
  };

  return (
    <AuthContext.Provider value={{ value }}>
      {children}
    </AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);