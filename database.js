
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDirectory = process.env.DATA_DIR || __dirname;

fs.mkdirSync(dataDirectory, { recursive: true });

const dbPath = path.join(dataDirectory, "trustvault.db");
const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("TrustVault database connected successfully!");

        db.run("PRAGMA foreign_keys = ON;");
    }
});

// Create Users Table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (error) => {
    if (error) {
        console.error("Users table error:", error.message);
    } else {
        console.log("Users table is ready!");
    }
});

// Create Documents Table
db.run(`
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        original_name TEXT NOT NULL,
        stored_name TEXT NOT NULL UNIQUE,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`, (error) => {
    if (error) {
        console.error("Documents table error:", error.message);
    } else {
        console.log("Documents table is ready!");
    }
});

// Create Activities Table
db.run(`
    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`, (error) => {
    if (error) {
        console.error("Activities table error:", error.message);
    } else {
        console.log("Activities table is ready!");
    }
});

// Create Document Sharing Table
db.run(`
    CREATE TABLE IF NOT EXISTS document_shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        shared_with_user_id INTEGER NOT NULL,
        permission TEXT NOT NULL
            CHECK(permission IN ('viewer', 'editor')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (document_id)
            REFERENCES documents(id)
            ON DELETE CASCADE,

        FOREIGN KEY (shared_with_user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        UNIQUE(document_id, shared_with_user_id)
    )
`, (error) => {
    if (error) {
        console.error("Document sharing table error:", error.message);
    } else {
        console.log("Document sharing table is ready!");
    }
});

module.exports = db;
