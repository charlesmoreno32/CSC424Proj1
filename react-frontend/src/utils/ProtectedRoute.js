import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { value } = useAuth();
  const token = document.cookie && document.cookie.split("=")[1];
  if (token === "null") {
    return <Navigate to="/home" replace />;
  }
  return children;
};