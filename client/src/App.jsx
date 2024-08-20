import "./App.css";
import Register from "./modules/Form/Register";
import Login from "./modules/Form/Login";
import Dashboard from "./modules/Dashboard/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// ProtectedRoutes wrapper component
const ProtectedRoutes = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("chat_user_tkn");

        if (token) {
            // Validate the token with the backend
            axios
                .post(
                    "http://localhost:3001/validate-token",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                })
                .catch((error) => {
                    console.error("Token validation error:", error);
                    setIsLoggedIn(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // If not logged in, navigate to register page
    if (!isLoggedIn) {
        return <Navigate to="/register" />;
    }

    // Otherwise, return the children (protected components)
    return children;
};

function App() {
    return (
        <div className="bg-secondary h-screen flex justify-center items-center">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes>
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
