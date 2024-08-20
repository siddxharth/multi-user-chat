import { useEffect, useState, useCallback } from "react";
import User from "../../assets/user.svg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import

export default function Dashboard() {
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem("chat_user_tkn");
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                setCurrentUser(userId);
                console.log("Current User ID: ", userId);
            }
        } catch (error) {
            console.error("Error decoding token: ", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("chat_user_tkn");
            const response = await axios.get("http://localhost:3001/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const filteredUsers = response.data.filter(
                (user) => user.id !== currentUser
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    const fetchConversations = useCallback(async () => {
        if (!activeUser || !currentUser) return;
        try {
            const token = localStorage.getItem("chat_user_tkn");
            const response = await axios.get(
                `http://localhost:3001/conversation/${currentUser}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Map activeUser to sender_id or receiver_id and currentUser to the opposite
            const conversation = response.data.find((conv) => {
                return (
                    (conv.sender_id === currentUser &&
                        conv.receiver_id === activeUser.id) ||
                    (conv.receiver_id === currentUser &&
                        conv.sender_id === activeUser.id)
                );
            });

            if (conversation) {
                setConversationId(conversation.id);
                // Fetch messages for the conversation
                const messagesResponse = await axios.get(
                    `http://localhost:3001/conversation/${conversation.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setMessages(messagesResponse.data);
            }
        } catch (error) {
            console.error("Error fetching conversations: ", error);
        }
    }, [activeUser, currentUser]);

    const fetchMessages = useCallback(async () => {
        try {
            const token = localStorage.getItem("chat_user_tkn");
            const response = await axios.get(
                `http://localhost:3001/message/${conversationId}`,
                {
                    headers: {
                        Authorization: ` Bearer ${token}`,
                    },
                }
            );
            setMessages(response.data);
        } catch (error) {
            console.error("Error while fetching messages: ", error);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
            setMessages([]); // Clear messages when currentUser changes
            setConversationId(null); // Clear conversationId when currentUser changes
        }
    }, [currentUser]);

    useEffect(() => {
        fetchConversations();
    }, [activeUser, fetchConversations]);

    useEffect(() => {
        fetchMessages();
    }, [conversationId, fetchMessages]);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    // Reset messages when activeUser changes
    useEffect(() => {
        setMessages([]);
        setConversationId(null);
    }, [activeUser]);

    const handleTyping = () => {
        if (activeUser) {
            const updatedContacts = users.map((contact) =>
                contact.id === activeUser.id
                    ? { ...contact, typing: true }
                    : contact
            );
            setUsers(updatedContacts);
            setTimeout(() => {
                const resetContacts = updatedContacts.map((contact) =>
                    contact.id === activeUser.id
                        ? { ...contact, typing: false }
                        : contact
                );
                setUsers(resetContacts);
            }, 3000); // Adjust delay as necessary
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "") return;

        try {
            const token = localStorage.getItem("chat_user_tkn");
            const response = await axios.post(
                "http://localhost:3001/message",
                {
                    senderId: currentUser,
                    receiverId: activeUser.id,
                    message,
                    conversationId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessages([...messages, response.data]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
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
                        Users
                    </h1>
                </div>
                <div className="flex-1 px-2 overflow-y-auto">
                    {users
                        .filter((contact) =>
                            contact.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map(({ id, name, active }) => (
                            <div
                                key={id}
                                onClick={() => {
                                    setActiveUser(
                                        users.find(
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
                                            src={User}
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
                            setCurrentUser(null); // Clear currentUser on logout
                            setUsers([]); // Clear users on logout
                            setMessages([]); // Clear messages on logout
                            setConversationId(null); // Clear conversationId on logout
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
                            src={User}
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
                    <div className="h-full bg-white text-black overflow-scroll">
                        <div className="px-10 py-14">
                            {messages.length > 0 ? (
                                messages.map((conversation) => (
                                    <div key={conversation.id}>
                                        <div
                                            className={`${
                                                conversation.sender_id ==
                                                currentUser
                                                    ? "max-w-[60%] bg-primary-light text-white rounded-bl-xl rounded-t-xl ml-auto p-4 my-2"
                                                    : "max-w-[40%] bg-secondary text-black rounded-b-xl rounded-tr-xl mr-auto p-4 my-2"
                                            }`}
                                        >
                                            {conversation.content}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-black">
                                    No conversations yet.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <hr />
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                handleTyping(); // Trigger typing indicator
                            }}
                            className="w-full max-w-full border rounded h-10 p-2 my-2 focus:outline-primary"
                        />
                        <Button
                            label="Send"
                            onClick={handleSendMessage}
                            className="w-full max-w-fit"
                        />
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
