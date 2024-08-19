import "./App.css";
import Register from "./modules/Form/Register";
import Login from "./modules/Form/Login";
import Dashboard from "./modules/Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="bg-secondary h-screen flex justify-center items-center">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;
