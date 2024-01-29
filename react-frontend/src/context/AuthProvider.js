import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const handleLogin = async (token) => {
    document.cookie = `token=${token}`;
    setToken(token);
    navigate("/landing");
  };

  const handleLogout = () => {
    document.cookie = `token=${null}`;
    setToken(null);
    navigate("/");
  };

  const value = {
    token,
    username: "",
    password: "",
    password2: "",
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