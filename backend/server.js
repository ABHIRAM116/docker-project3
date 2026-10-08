const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "taskdb"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL");

    const createTable = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL
        )
    `;

    db.query(createTable, (err) => {
        if (err) {
            console.error("Table creation failed:", err.message);
        } else {
            console.log("Tasks table ready");
        }
    });
});

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    db.query(
        "INSERT INTO tasks (title) VALUES (?)",
        [title],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id: result.insertId,
                title: title
            });
        }
    );
});

app.get("/", (req, res) => {
    res.send("Task Manager Backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
