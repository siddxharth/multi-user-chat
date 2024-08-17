import "./App.css";
import Register from "./modules/Form/Register";
import Login from "./modules/Form/Login";

function App() {
    return (
        <div className="bg-secondary h-screen flex justify-center items-center">
            <Register />
            <Login />
        </div>
    );
}

export default App;
