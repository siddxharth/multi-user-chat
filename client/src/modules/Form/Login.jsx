import { useState } from "react";
import axios from "axios";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { NavLink, useNavigate } from "react-router-dom";

export default function Form() {
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", {
                username: data.username,
                password: data.password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem("chat_user_tkn", token);
                console.log("Login successful:", response.data);
                navigate("/");
                // Optionally redirect or update UI on successful login
            } else {
                console.error("Login failed:", response.data.message);
                // Optionally show error message to the user
            }
        } catch (error) {
            if (error.response) {
                // Request was made and server responded with a status code
                console.error("Login failed:", error.response.data.message);
                // Optionally show error message to the user
            } else if (error.request) {
                // Request was made but no response was received
                console.error("No response received:", error.request);
                // Optionally show error message to the user
            } else {
                // Something happened in setting up the request
                console.error("An error occurred during login:", error.message);
                // Optionally show error message to the user
            }
        }
    }

    return (
        <form
            onSubmit={handleLogin}
            className="bg-white w-[600px] h-[500px] border shadow-md rounded-lg flex flex-col justify-center items-center"
        >
            <h1 className="text-4xl font-extrabold text-primary">
                Welcome back!
            </h1>
            <h2 className="text-lg text-gray-700 font-light mb-10">
                Log in to get started!
            </h2>
            <div className="w-1/2">
                <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe123"
                    className="mb-6"
                    isRequired={true}
                    value={data.username}
                    onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                    }
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    className="mb-6"
                    isRequired={true}
                    value={data.password}
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />
            </div>
            <Button label="Log In " className="mt-2" type="submit" />
            <p className="mt-2">
                {`Don't have an account?`}{" "}
                <NavLink
                    to="/register"
                    className="text-primary cursor-pointer underline"
                >
                    Sign Up
                </NavLink>
            </p>
        </form>
    );
}
