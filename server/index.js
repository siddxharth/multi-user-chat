const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

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

app.get("/users", async (req, res) => {
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
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Server error");
    }
});

app.post("/conversation", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Ensure both senderId and receiverId are provided
        if (!senderId || !receiverId) {
            return res
                .status(400)
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

app.get("/conversation/:userId", async (req, res) => {
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
                .status(404)
                .json({ message: "No conversations found for this user" });
        }

        // Return the user's conversations
        return res.status(200).json(userConversations.rows);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log("Server is up and running!");
});
