import { createContext, useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import {checkToken} from "../apis.js";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  async function validateCookie() {
    try {
        const token = document.cookie && document.cookie.split("=")[1];
        if (token) {
          checkToken(token)
          .then((res) => res.json())
          .then((json) => {
            const user = json[0];
            value.username = user.username;
            value.password = user.password;
            value.onLogin(user.token);
          })
          .catch(() => {  
              return false;
          });
        } else {
          return false;
        }
    } catch (error) {
        return false;
    }
  } 

  const handleLogin = async (token) => {
    document.cookie = `token=${token}`;
    setToken(token);
  };

  const handleLogout = () => {
    document.cookie = `token=${null}`;
    setToken(null);
    navigate("/");
  };

  const value = {
    token,
    setToken: setToken,
    username: "",
    password: "",
    phone: "",
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  useEffect(() => {
    validateCookie()
  }, [] );

  return (
    <AuthContext.Provider value={{ value }}>
      {children}
    </AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);