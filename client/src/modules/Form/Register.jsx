import { useState } from "react";
import axios from "axios"; // Import Axios

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

import { NavLink, useNavigate } from "react-router-dom";

export default function Form() {
    const [data, setData] = useState({
        name: "",
        username: "",
        password: "",
    });
    const navigate = useNavigate("");
    async function handleRegistration(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3001/register",
                {
                    name: data.name,
                    username: data.username,
                    password: data.password,
                }
            );

            console.log("Registration successful:", response.data);
            navigate("/login");
            // Optionally redirect or update UI on successful registration
        } catch (error) {
            if (error.response) {
                // Request was made and server responded with a status code
                console.error(
                    "Registration failed:",
                    error.response.data.message
                );
                // Optionally show error message to the user
            } else if (error.request) {
                // Request was made but no response was received
                console.error("No response received:", error.request);
                // Optionally show error message to the user
            } else {
                // Something happened in setting up the request
                console.error(
                    "An error occurred during registration:",
                    error.message
                );
                // Optionally show error message to the user
            }
        }
    }

    return (
        <form
            onSubmit={handleRegistration}
            className="bg-white w-[600px] h-[500px] border shadow-md rounded-lg flex flex-col justify-center items-center"
        >
            <h1 className="text-4xl font-extrabold text-primary">Welcome!</h1>
            <h2 className="text-lg text-gray-700 font-light mb-10">
                Sign up to get started!
            </h2>
            <div className="w-1/2">
                <Input
                    label="Fullname"
                    type="text"
                    placeholder="John Doe"
                    className="mb-6"
                    isRequired={true}
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />
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
            <Button type="submit" label="Sign Up " className="mt-2" />
            <p className="mt-2">
                Already have an account?{" "}
                <NavLink
                    to="/login"
                    className="text-primary cursor-pointer underline"
                >
                    Log In
                </NavLink>
            </p>
        </form>
    );
}
