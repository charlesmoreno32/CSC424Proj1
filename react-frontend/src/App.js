import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./Home";
import { Landing } from "./Landing";
import { Registration } from "./Registration";
import React, { useState } from "react";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import fakeAuth from "./utils/FakeAuth";
import { useAuth } from "./context/AuthProvider";
import { AuthProvider } from "./context/AuthProvider"

const App = () => {
    const [token, setToken] = React.useState(null);

    return (
        <AuthProvider>
            
            <Navigation />
            <h1>React Router</h1>
            <Routes>
                <Route index element={<Home />} />
                <Route path="landing" element={
                    <ProtectedRoute>
                    <Landing />
                    </ProtectedRoute>
                } />
                <Route path="home" element={ <Home />} />
                <Route path="registration" element={ <Registration />} />
            </Routes>
            
        </AuthProvider>
    );
};

const Navigation = () => {
    const { value } = useAuth();
    return (
        <nav>
            <Link to="/home">Home</Link>
            <Link to="/landing">Landing</Link>
            {value.token && (
                <button type="button" onClick={value.onLogout}>
                    Sign Out
                </button> )}
        </nav>
    )
}

export const AuthContext = React.createContext(null);  // we will use this in other components
export default App;