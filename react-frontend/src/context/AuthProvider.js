import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
import {HandleLoginAttempt,
  handleRegistrationAttempt} from "../apis.js"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    HandleLoginAttempt({username: value.username, password: value.password})
      .then((res) => {
          if(res.status == 200){
            console.log(res.body.token);
            setToken(res.token);
            navigate("/landing")
          } else {
            console.log("Login Attempt Failed. Invalid username or password")
          };
        })
      .catch((exception) => console.log(exception));
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    username: "",
    password: "",
    phone: "",
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={{ value }}>
      {children}
    </AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);