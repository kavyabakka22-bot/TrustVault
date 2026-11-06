# 🔐 TrustVault – Secure Document Sharing

TrustVault is a web application that allows users to upload, manage, download and securely share personal documents with other registered users.

## Features

- User registration and login
- Password hashing using bcrypt
- Session-based authentication
- Document upload and download
- Private document storage
- Share documents with registered users
- Viewer and Editor permission selection
- View users who have access to documents
- Revoke document-sharing permissions
- Activity tracking
- File type validation
- Maximum upload size of 10 MB

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- SQLite

**Security and File Handling**
- bcryptjs
- express-session
- Multer
- Helmet

## Project Structure

```text
TrustVault1/
│
├── index1.html
├── register1.html
├── login1.html
├── dashboard1.html
├── documents1.html
├── shared1.html
├── activites.html
│
├── server.js
├── database.js
├── trustvault.db
├── private_uploads/
│
├── package.json
└── README.md
```

## Requirements

- Node.js
- npm
- A web browser

## Installation

1. Download or clone the project.
2. Open the project folder in Command Prompt.
3. Install dependencies:

```bash
npm install
```

If dependencies are not listed in package.json, install them using:

```bash
npm install express sqlite3 bcryptjs express-session multer helmet
```

## Run the Application

Start the backend server:

```bash
node server.js
```

Open the application in your browser:

```text
http://localhost:3000
```

## Supported File Types

- PDF
- DOC
- DOCX
- JPG
- JPEG
- PNG

Maximum file size: 10 MB.

## Security and Access Control

- Passwords are hashed before being stored.
- Protected pages require authentication.
- Users can access their own documents.
- Shared documents can be accessed by authorized recipients.
- Document owners can revoke sharing permissions.
- Unauthorized downloads are rejected.
- Document activities are recorded.

## Testing Performed

- User registration and login
- Document upload and download
- Document sharing between two accounts
- Viewing sharing permissions
- Revoking document access
- Blocking downloads after revocation
- Rejecting unsupported file types
- Rejecting files larger than 10 MB

## Important Notes

This project is currently configured for local development.

Before production deployment, configure a secure session secret, HTTPS, persistent session storage, CSRF protection, rate limiting, stronger file validation and appropriate backup procedures.

The Editor permission is currently selectable, but document-editing functionality has not yet been implemented.

## Author

TrustVault – Secure Document Sharing Project