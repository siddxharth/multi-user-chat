import { useState } from "react";
import User from "../../assets/user.svg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const contactsStorage = [
    {
        id: 1,
        name: "Jonesy Doe",
        active: true,
        image: User,
        typing: false,
    },
    {
        id: 2,
        name: "Jane Doe",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 3,
        name: "Summer Doe",
        active: true,
        image: User,
        typing: false,
    },
    {
        id: 4,
        name: "James Doe",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 5,
        name: "Domino",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 6,
        name: "Deadpool",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 7,
        name: "Spiderman",
        active: true,
        image: User,
        typing: false,
    },
    {
        id: 8,
        name: "James Doe",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 9,
        name: "Domino",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 10,
        name: "Deadpool",
        active: false,
        image: User,
        typing: false,
    },
    {
        id: 11,
        name: "Spiderman",
        active: true,
        image: User,
        typing: false,
    },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState(contactsStorage);
    const [activeUser, setActiveUser] = useState(null);

    // Typing indicator logic
    const handleTyping = () => {
        if (activeUser) {
            const updatedContacts = contacts.map((contact) =>
                contact.id === activeUser.id
                    ? { ...contact, typing: true }
                    : contact
            );
            setContacts(updatedContacts);
            setTimeout(() => {
                const resetContacts = updatedContacts.map((contact) =>
                    contact.id === activeUser.id
                        ? { ...contact, typing: false }
                        : contact
                );
                setContacts(resetContacts);
            }, 3000); // Adjust delay as necessary
        }
    };

    return (
        <div className="w-screen flex">
            <div className="w-1/4 h-screen bg-secondary flex flex-col border-r-2">
                <div className="sticky top-0 bg-secondary px-2 z-10">
                    <Input
                        type="text"
                        placeholder="Search"
                        isRequired={false}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded h-10 p-2 my-2 focus:outline-primary"
                    />
                    <h1 className="text-xl text-left font-medium text-primary">
                        Messages
                    </h1>
                </div>
                <div className="flex-1 px-2 overflow-y-auto">
                    {contacts
                        .filter((contact) =>
                            contact.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map(({ id, name, active, image }) => (
                            <div
                                key={id}
                                onClick={() => {
                                    setActiveUser(
                                        contacts.find(
                                            (contact) => contact.id === id
                                        )
                                    );
                                }}
                                className={`cursor-pointer ${
                                    activeUser && id === activeUser.id
                                        ? "bg-white"
                                        : "bg-secondary"
                                }`}
                            >
                                <div className="flex justify-start items-center m-4">
                                    <div className="border-primary rounded-full">
                                        <img
                                            className="rounded-full"
                                            src={image}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <h3 className="text-base font-medium">
                                            {name}
                                        </h3>
                                        <p
                                            className={`text-xs font-normal italic ${
                                                active
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {active ? "Online" : "Offline"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="flex flex-row justify-center sticky bottom-0 bg-secondary p-4 z-10 items-center border-t-2">
                    <Button
                        label="Log Out"
                        className="w-full"
                        onClick={() => {
                            localStorage.removeItem("chat_user_tkn");
                            navigate("/login");
                        }}
                    />
                </div>
            </div>
            {activeUser ? (
                <div className="w-3/4 h-screen bg-white flex flex-col items-left">
                    <div className="flex flex-row items-center bg-secondary px-2">
                        <img
                            className="rounded-full"
                            src={activeUser.image}
                            width={50}
                            height={50}
                        />
                        <div className="m-4">
                            <p className="font-bold">
                                {activeUser.name}{" "}
                                <span
                                    className={`text-xl font-bold italic ${
                                        activeUser.active
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {activeUser.active ? "•" : "•"}
                                </span>
                            </p>
                            <p className="text-xs font-normal italic text-gray-500">
                                {activeUser.typing ? "typing..." : ""}
                            </p>
                        </div>
                    </div>
                    <div className="h-full bg-white overflow-scroll">
                        <div className="px-10 py-14">
                            {/* Example messages */}
                            <div className="max-w-[40%] bg-secondary text-black rounded-b-xl rounded-tr-xl mr-auto p-4 my-2">
                                Hi Samaira!!!
                            </div>
                            <div className="max-w-[40%] bg-secondary text-black rounded-b-xl rounded-tr-xl mr-auto p-4 my-2">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </div>
                            <div className="max-w-[60%] bg-primary-light text-white rounded-bl-xl rounded-t-xl ml-auto p-4 my-2">
                                Hey Spidey!
                            </div>
                            <div className="max-w-[60%] bg-primary-light text-white rounded-bl-xl rounded-t-xl ml-auto p-4 my-2">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </div>
                        </div>
                    </div>
                    <div className="px-2">
                        <hr />
                        <div className="flex items-center px-2">
                            <Input
                                type="text"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    handleTyping(); // Trigger typing indicator
                                }}
                                className="w-full border rounded h-10 p-2 my-2 focus:outline-primary"
                            />
                            <Button label="Send" className="ml-2" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row justify-center text-center items-center w-full">
                    <p className="text-xl text-primary font-semibold">
                        Select a chat
                    </p>
                </div>
            )}
        </div>
    );
}
