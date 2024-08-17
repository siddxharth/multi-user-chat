import { useState } from "react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export default function Form() {
    const [data, setData] = useState({
        username: "",
        password: "",
    });
    return (
        <form className="bg-white w-[600px] h-[500px] border shadow-md rounded-lg flex flex-col justify-center items-center">
            <h1 className="text-4xl font-extrabold text-primary">
                Welcome back!
            </h1>
            <h2 className="text-lg text-gray-700 font-light mb-10">
                Log in to get started!
            </h2>
            <Input
                label="Username"
                type="text"
                placeholder="johndoe123"
                className="mb-6"
                isRequired={true}
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <Input
                label="Password"
                type="password"
                placeholder="Password"
                className="mb-6"
                isRequired={true}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button label="Log In " className="mt-2" onClick={() => {}} />
            <p className="mt-2">
                {`Don't have an account?`}{" "}
                <a
                    href="/register"
                    className="text-primary cursor-pointer underline"
                >
                    Sign Up
                </a>
            </p>
        </form>
    );
}
