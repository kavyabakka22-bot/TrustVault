
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const db = require("./database");

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

const dataDirectory = process.env.DATA_DIR || __dirname;

fs.mkdirSync(dataDirectory, { recursive: true });

const uploadDirectory = path.join(
    dataDirectory,
    "private_uploads"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

if (
    process.env.NODE_ENV === "production" &&
    !process.env.SESSION_SECRET
) {
    throw new Error("SESSION_SECRET must be configured in production.");
}

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new SQLiteStore({
        db: "sessions.db",
        dir: dataDirectory
    }),
    secret: process.env.SESSION_SECRET ||
        "trustvault-development-secret-change-before-deployment",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Check login
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Please log in first."
        });
    }

    next();
}

// Record activity
function recordActivity(userId, action, details) {
    db.run(
        `INSERT INTO activities (user_id, action, details)
         VALUES (?, ?, ?)`,
        [userId, action, details || ""],
        (error) => {
            if (error) {
                console.error("Activity recording error:", error.message);
            }
        }
    );
}

// Allowed file types
const allowedFiles = {
    ".pdf": ["application/pdf"],
    ".doc": ["application/msword"],
    ".docx": [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    ".jpg": ["image/jpeg"],
    ".jpeg": ["image/jpeg"],
    ".png": ["image/png"]
};

// File storage
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDirectory);
    },

    filename: function (req, file, callback) {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, crypto.randomUUID() + extension);
    }
});

// File validation
function fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedMimeTypes = allowedFiles[extension];

    if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
        return callback(
            new Error("Only PDF, DOC, DOCX, JPG and PNG files are allowed.")
        );
    }

    callback(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

// Validate document ID
function getDocumentId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({
            success: false,
            message: "Invalid document ID."
        });
        return null;
    }

    return id;
}

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index1.html"));
});

// Registration and login pages
app.get("/register1.html", (req, res) => {
    res.sendFile(path.join(__dirname, "register1.html"));
});

app.get("/login1.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login1.html"));
});

// Protected pages
app.get("/dashboard1.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard1.html"));
});

app.get("/documents1.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "documents1.html"));
});

app.get("/shared1.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "shared1.html"));
});

app.get("/activites.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "activites.html"));
});

// Backend status
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "TrustVault backend is running!"
    });
});

// REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (
            !cleanName ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid name and email."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8 to 72 characters."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        db.run(
            `INSERT INTO users (name, email, password_hash)
             VALUES (?, ?, ?)`,
            [cleanName, cleanEmail, passwordHash],
            function (error) {
                if (error) {
                    if (error.message.includes("UNIQUE")) {
                        return res.status(409).json({
                            success: false,
                            message: "This email is already registered."
                        });
                    }

                    console.error(error.message);

                    return res.status(500).json({
                        success: false,
                        message: "Registration failed."
                    });
                }

                const newUserId = this.lastID;

                req.session.regenerate((sessionError) => {
                    if (sessionError) {
                        return res.status(500).json({
                            success: false,
                            message: "Account created. Please log in."
                        });
                    }

                    req.session.userId = newUserId;

                    req.session.save((saveError) => {
                        if (saveError) {
                            return res.status(500).json({
                                success: false,
                                message: "Account created. Please log in."
                            });
                        }

                        recordActivity(
                            newUserId,
                            "Account Registered",
                            "Created a TrustVault account"
                        );

                        res.status(201).json({
                            success: true,
                            message: "Registration successful!",
                            userId: newUserId
                        });
                    });
                });
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email.trim().toLowerCase()],
        async (error, user) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Login failed."
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            try {
                const matches = await bcrypt.compare(
                    password,
                    user.password_hash
                );

                if (!matches) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }

                req.session.regenerate((sessionError) => {
                    if (sessionError) {
                        return res.status(500).json({
                            success: false,
                            message: "Could not start your session."
                        });
                    }

                    req.session.userId = user.id;

                    req.session.save((saveError) => {
                        if (saveError) {
                            return res.status(500).json({
                                success: false,
                                message: "Could not save your session."
                            });
                        }

                        recordActivity(
                            user.id,
                            "Login",
                            "Logged in to TrustVault"
                        );

                        res.json({
                            success: true,
                            message: "Login successful!"
                        });
                    });
                });
            } catch (compareError) {
                console.error(compareError);

                res.status(500).json({
                    success: false,
                    message: "Login failed."
                });
            }
        }
    );
});

// CURRENT USER
app.get("/api/me", requireLogin, (req, res) => {
    db.get(
        "SELECT id, name, email FROM users WHERE id = ?",
        [req.session.userId],
        (error, user) => {
            if (error || !user) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve user details."
                });
            }

            res.json({
                success: true,
                user
            });
        }
    );
});

// UPLOAD DOCUMENT
app.post("/api/documents", requireLogin, (req, res) => {
    upload.single("document")(req, res, (uploadError) => {
        if (uploadError) {
            return res.status(400).json({
                success: false,
                message: uploadError.code === "LIMIT_FILE_SIZE"
                    ? "File size must not exceed 10 MB."
                    : uploadError.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a document."
            });
        }

        const originalName = path.basename(req.file.originalname)
            .replace(/[\u0000-\u001f\u007f]/g, "_")
            .slice(0, 255);

        db.run(
            `INSERT INTO documents
             (user_id, original_name, stored_name, mime_type, file_size)
             VALUES (?, ?, ?, ?, ?)`,
            [
                req.session.userId,
                originalName,
                req.file.filename,
                req.file.mimetype,
                req.file.size
            ],
            function (error) {
                if (error) {
                    fs.unlink(req.file.path, () => {});

                    return res.status(500).json({
                        success: false,
                        message: "Could not save document information."
                    });
                }

                recordActivity(
                    req.session.userId,
                    "Document Uploaded",
                    originalName
                );

                res.status(201).json({
                    success: true,
                    message: "Document uploaded successfully!",
                    documentId: this.lastID,
                    fileName: originalName
                });
            }
        );
    });
});

// GET OWN DOCUMENTS
app.get("/api/documents", requireLogin, (req, res) => {
    db.all(
        `SELECT id, original_name, mime_type, file_size, uploaded_at
         FROM documents
         WHERE user_id = ?
         ORDER BY uploaded_at DESC`,
        [req.session.userId],
        (error, documents) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve documents."
                });
            }

            res.json({
                success: true,
                documents
            });
        }
    );
});

// SHARE DOCUMENT WITH ANOTHER REGISTERED USER
app.post("/api/documents/:id/share", requireLogin, (req, res) => {
    const documentId = getDocumentId(req, res);
    if (!documentId) return;

    const email = req.body.email;
    const permission = req.body.permission;

    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
            success: false,
            message: "Enter the recipient's email address."
        });
    }

    if (!["viewer", "editor"].includes(permission)) {
        return res.status(400).json({
            success: false,
            message: "Permission must be viewer or editor."
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.get(
        `SELECT id, original_name
         FROM documents
         WHERE id = ? AND user_id = ?`,
        [documentId, req.session.userId],
        (documentError, document) => {
            if (documentError) {
                return res.status(500).json({
                    success: false,
                    message: "Could not check document ownership."
                });
            }

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found or you are not its owner."
                });
            }

            db.get(
                "SELECT id FROM users WHERE email = ?",
                [cleanEmail],
                (userError, recipient) => {
                    if (userError) {
                        return res.status(500).json({
                            success: false,
                            message: "Could not find recipient."
                        });
                    }

                    if (!recipient) {
                        return res.status(404).json({
                            success: false,
                            message: "No registered user has that email."
                        });
                    }

                    if (recipient.id === req.session.userId) {
                        return res.status(400).json({
                            success: false,
                            message: "You cannot share a document with yourself."
                        });
                    }

                    db.run(
                        `INSERT INTO document_shares
                         (document_id, shared_with_user_id, permission)
                         VALUES (?, ?, ?)
                         ON CONFLICT(document_id, shared_with_user_id)
                         DO UPDATE SET permission = excluded.permission`,
                        [documentId, recipient.id, permission],
                        (shareError) => {
                            if (shareError) {
                                console.error(shareError.message);

                                return res.status(500).json({
                                    success: false,
                                    message: "Could not share document."
                                });
                            }

                            recordActivity(
                                req.session.userId,
                                "Document Shared",
                                document.original_name + " shared with " +
                                cleanEmail + " (" + permission + ")"
                            );

                            recordActivity(
                                recipient.id,
                                "Document Received",
                                document.original_name +
                                " shared with you (" + permission + ")"
                            );

                            res.json({
                                success: true,
                                message: "Document shared successfully!",
                                permission
                            });
                        }
                    );
                }
            );
        }
    );
});

// LIST USERS WHO HAVE ACCESS TO AN OWNED DOCUMENT
app.get("/api/documents/:id/shares", requireLogin, (req, res) => {
    const documentId = getDocumentId(req, res);
    if (!documentId) return;

    db.get(
        `SELECT id FROM documents
         WHERE id = ? AND user_id = ?`,
        [documentId, req.session.userId],
        (documentError, document) => {
            if (documentError) {
                return res.status(500).json({
                    success: false,
                    message: "Could not check document ownership."
                });
            }

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found or you are not its owner."
                });
            }

            db.all(
                `SELECT
                    u.id AS user_id,
                    u.name,
                    u.email,
                    s.permission,
                    s.created_at
                 FROM document_shares s
                 JOIN users u ON u.id = s.shared_with_user_id
                 WHERE s.document_id = ?
                 ORDER BY s.created_at DESC`,
                [documentId],
                (shareError, shares) => {
                    if (shareError) {
                        return res.status(500).json({
                            success: false,
                            message: "Could not retrieve sharing details."
                        });
                    }

                    res.json({
                        success: true,
                        shares
                    });
                }
            );
        }
    );
});

// LIST DOCUMENTS SHARED WITH LOGGED-IN USER
app.get("/api/shared-documents", requireLogin, (req, res) => {
    db.all(
        `SELECT
            d.id,
            d.original_name,
            d.mime_type,
            d.file_size,
            d.uploaded_at,
            u.name AS owner_name,
            u.email AS owner_email,
            s.permission
         FROM document_shares s
         JOIN documents d ON d.id = s.document_id
         JOIN users u ON u.id = d.user_id
         WHERE s.shared_with_user_id = ?
         ORDER BY s.created_at DESC`,
        [req.session.userId],
        (error, documents) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve shared documents."
                });
            }

            res.json({
                success: true,
                documents
            });
        }
    );
});

// OWNER REVOKES SHARING ACCESS
app.delete("/api/documents/:id/share/:userId", requireLogin, (req, res) => {
    const documentId = getDocumentId(req, res);
    if (!documentId) return;

    const recipientId = Number(req.params.userId);

    if (!Number.isInteger(recipientId) || recipientId < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid recipient ID."
        });
    }

    db.get(
        `SELECT original_name
         FROM documents
         WHERE id = ? AND user_id = ?`,
        [documentId, req.session.userId],
        (error, document) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not check document."
                });
            }

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found or you are not its owner."
                });
            }

            db.run(
                `DELETE FROM document_shares
                 WHERE document_id = ? AND shared_with_user_id = ?`,
                [documentId, recipientId],
                function (deleteError) {
                    if (deleteError) {
                        return res.status(500).json({
                            success: false,
                            message: "Could not revoke sharing access."
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "Sharing permission not found."
                        });
                    }

                    recordActivity(
                        req.session.userId,
                        "Sharing Revoked",
                        document.original_name
                    );

                    recordActivity(
                        recipientId,
                        "Document Access Revoked",
                        document.original_name
                    );

                    res.json({
                        success: true,
                        message: "Sharing access revoked successfully."
                    });
                }
            );
        }
    );
});

// DOWNLOAD DOCUMENT: OWNER OR AUTHORIZED RECIPIENT
app.get("/api/documents/:id/download", requireLogin, (req, res) => {
    const documentId = getDocumentId(req, res);
    if (!documentId) return;

    db.get(
        `SELECT
            d.*,
            s.permission
         FROM documents d
         LEFT JOIN document_shares s
            ON s.document_id = d.id
            AND s.shared_with_user_id = ?
         WHERE d.id = ?
           AND (
                d.user_id = ?
                OR s.shared_with_user_id = ?
           )`,
        [
            req.session.userId,
            documentId,
            req.session.userId,
            req.session.userId
        ],
        (error, document) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve document."
                });
            }

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found or you do not have access."
                });
            }

            const filePath = path.join(
                uploadDirectory,
                document.stored_name
            );

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: "Stored file could not be found."
                });
            }

            recordActivity(
                req.session.userId,
                "Document Downloaded",
                document.original_name
            );

            res.download(filePath, document.original_name);
        }
    );
});

// DASHBOARD STATISTICS
app.get("/api/dashboard-stats", requireLogin, (req, res) => {
    db.get(
        `SELECT
            COUNT(*) AS totalDocuments,
            COALESCE(SUM(file_size), 0) AS totalBytes
         FROM documents
         WHERE user_id = ?`,
        [req.session.userId],
        (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve dashboard statistics."
                });
            }

            db.get(
                `SELECT COUNT(DISTINCT document_id) AS sharedDocuments
                 FROM document_shares
                 JOIN documents ON documents.id = document_shares.document_id
                 WHERE documents.user_id = ?`,
                [req.session.userId],
                (shareError, shareResult) => {
                    if (shareError) {
                        return res.status(500).json({
                            success: false,
                            message: "Could not retrieve sharing statistics."
                        });
                    }

                    res.json({
                        success: true,
                        totalDocuments: result.totalDocuments,
                        sharedDocuments: shareResult.sharedDocuments,
                        storageMB: Number(
                            (result.totalBytes / (1024 * 1024)).toFixed(2)
                        )
                    });
                }
            );
        }
    );
});

// ACTIVITIES
app.get("/api/activities", requireLogin, (req, res) => {
    db.all(
        `SELECT id, action, details, created_at
         FROM activities
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
        [req.session.userId],
        (error, activities) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Could not retrieve activities."
                });
            }

            res.json({
                success: true,
                activities
            });
        }
    );
});

// LOGOUT
app.post("/api/logout", requireLogin, (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});

// Handle unexpected errors
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`TrustVault server running on port ${PORT}`);
});
