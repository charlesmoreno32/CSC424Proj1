import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
import {handleLoginAttempt,
  handleRegistrationAttempt} from "../apis.js"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await handleLoginAttempt({username: value.username, password: value.password, phone: value.phone});
    console.log(token);
    setToken(token);
    navigate("/landing");
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