import "./App.css";
import Register from "./modules/Form/Register";
import Login from "./modules/Form/Login";
import Dashboard from "./modules/Dashboard/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";

// ProtectedRoutes wrapper component
const ProtectedRoutes = ({ children }) => {
    const isLoggedIn = localStorage.getItem("chat_user_tkn") !== null;

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
