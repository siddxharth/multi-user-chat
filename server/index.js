const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const authorize = require("./middleware/auth");

const { Server } = require("socket.io");
const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("userAdded", (user) => {
        console.log("New user added:", user);
    });
});

io.listen(3003);

// Socket.io
let users = [];
io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("addUser", (currentUser) => {
        const existingUser = users.find((user) => user.userId === currentUser);
        if (!existingUser) {
            const user = {
                userId: currentUser,
                socketId: socket.id,
                active: true,
            };
            users.push(user);
            io.emit("getUsers", users);
        } else {
            existingUser.socketId = socket.id;
            existingUser.active = true;
            io.emit("getUsers", users);
        }
    });

    socket.on(
        "sendMessage",
        async ({ senderId, receiverId, content, conversationId }) => {
            const receiver = users.find((user) => user.userId === receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("getMessage", {
                    senderId,
                    content,
                    conversationId,
                });
            }
        }
    );

    socket.on("typing", ({ senderId, receiverId }) => {
        const receiver = users.find((user) => user.userId === receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("isTyping", { senderId });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        users = users.filter((user) => user.socketId !== socket.id);
        io.emit("getUsers", users);
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});

const cors = require("cors");

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors());

const pool = require("./database/connection");

app.get("/", (req, res) => {
    return res.send("Hello world!");
});

app.get("/users", authorize, async (req, res) => {
    try {
        // Query the database
        const result = await pool.query("SELECT * FROM users");

        // Send the result back to the client
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Server error");
    }
});

// Register new user
app.post("/register", async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res
            .status(400)
            .json({ message: "Name, username, and password are required" });
    }

    try {
        // Check if the username already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.query(
            "INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
            [name, username, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Server error");
    }
});

// Login a user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    try {
        // Check if the user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res
                .status(400)
                .json({ message: "Invalid username or password" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid username or password" });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Server error");
    }
});

// Validate token
app.post("/validate-token", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(200).json({ message: "Token is valid" });
    });
});

app.post("/conversation", authorize, async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Ensure both senderId and receiverId are provided
        if (!senderId || !receiverId) {
            return res
                .status(200)
                .json({ message: "Both senderId and receiverId are required" });
        }

        // Check if a conversation between the two users already exists
        const existingConversation = await pool.query(
            `SELECT * FROM Conversations 
            WHERE (sender_id = $1 AND receiver_id = $2) 
               OR (sender_id = $2 AND receiver_id = $1)`,
            [senderId, receiverId]
        );

        if (existingConversation.rows.length > 0) {
            // If conversation exists, return it
            return res.status(200).json(existingConversation.rows[0]);
        }

        // If conversation doesn't exist, create a new one
        const newConversation = await pool.query(
            `INSERT INTO Conversations (sender_id, receiver_id) 
            VALUES ($1, $2) RETURNING *`,
            [senderId, receiverId]
        );

        return res.status(201).json(newConversation.rows[0]);
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/conversation/:userId", authorize, async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Query to get all conversations for the user
        const userConversations = await pool.query(
            `SELECT * FROM Conversations 
            WHERE sender_id = $1 OR receiver_id = $1`,
            [userId]
        );

        if (userConversations.rows.length === 0) {
            return res
                .status(200)
                .json({ message: "No conversations found for this user" });
        }

        // Return the user's conversations
        return res.status(200).json(userConversations.rows);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/message", authorize, async (req, res) => {
    try {
        const { conversationId, senderId, content } = req.body;

        // Validate the input
        if (!conversationId || !senderId || !content) {
            return res.status(200).json({
                message: "conversationId, senderId, and content are required",
            });
        }

        // Insert the new message into the Messages table
        const newMessage = await pool.query(
            `INSERT INTO Messages (conversation_id, sender_id, content) 
             VALUES ($1, $2, $3) RETURNING *`,
            [conversationId, senderId, content]
        );

        // Return the newly created message
        return res.status(201).json(newMessage.rows[0]);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/message/:conversationId", authorize, async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Validate the input
        if (!conversationId) {
            return res
                .status(200)
                .json({ message: "conversationId is required" });
        }

        // Query to get all messages for the specific conversation
        const messages = await pool.query(
            `SELECT * FROM Messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
            [conversationId]
        );

        if (messages.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "No messages found for this conversation" });
        }

        // Return the messages
        return res.status(200).json(messages.rows);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log("Server is up and running!");
});
