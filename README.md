# 🔐 TrustVault – Secure Document Sharing

## Project Overview

TrustVault is a secure document management and sharing web application developed for the **Snovasys Fresher Hiring Challenge 2026 – RISE**.

It allows registered users to upload, manage, download, and securely share personal documents with other registered users through permission-based access control.

The primary goal is to protect private documents and prevent unauthorized access.

## Project Links

- **Live Application:** https://trustvault-198a.onrender.com
- **GitHub Repository:** https://github.com/kavyabakka22-bot/TrustVault

## Features

- User registration and login.
- Password hashing using bcrypt.
- Session-based authentication.
- Document upload and download.
- Private document storage.
- Share documents with registered users.
- Viewer and Editor permission selection.
- View users who have access to documents.
- Revoke document-sharing permissions.
- Activity tracking.
- File type validation.
- Maximum upload size of 10 MB.

**Permission note:** Viewer access has been tested. Editor permission is selectable, but document-editing functionality has not been implemented or verified.

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite

### Security and File Handling
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
├── package.json
├── package-lock.json
├── THREATS.md
├── PROMPTS.md
└── README.md
```

Private uploaded files and the SQLite database are generated at runtime and are not included in the repository.

## Requirements

- Node.js
- npm
- A web browser

## Installation

Clone the repository:

```bash
git clone https://github.com/kavyabakka22-bot/TrustVault.git
```

Open the project folder:

```bash
cd TrustVault
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Configure the required environment variables for your environment.

Example:

```env
PORT=3000
SESSION_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Keep secrets private. Never commit `.env` files or expose session secrets in GitHub.

## Run the Application

Start the backend server:

```bash
npm start
```

Open the application in your browser:

http://localhost:3000

## Supported File Types

- PDF
- DOC
- DOCX
- JPG
- JPEG
- PNG

**Maximum upload size:** 10 MB.

## Security and Access Control

TrustVault includes the following security measures:

- Passwords are hashed before storage.
- Protected APIs require authentication.
- Users can access their own documents.
- Shared documents can be accessed by authorized recipients.
- Document owners can revoke sharing permissions.
- Unauthorized downloads are rejected.
- Document activities are recorded.
- Helmet is used for HTTP security headers.
- Session-based authentication protects user access.

## Testing Performed

Manual testing includes:

- User registration and login.
- Document upload and download.
- Document sharing between two accounts.
- Viewing sharing permissions.
- Revoking document access.
- Blocking downloads after revocation.

Automated backend tests cover:

1. Backend server response.
2. Authentication requirement for the Documents API.
3. Authentication requirement for the Shared Documents API.
4. Authentication requirement for the Activities API.

Run the automated tests using:

```bash
npm test
```

The application server must be running in a separate terminal while these tests execute.

## Threat Model and AI Documentation

- **THREATS.md:** Documents potential security threats, existing protections, known limitations, and possible security improvements.
- **PROMPTS.md:** Documents AI-assisted development prompts, suggestions, identified issues, corrections, and related development history.

## Deployment and Limitations

The application is deployed on Render.

The current Render free deployment uses temporary filesystem storage. Uploaded files and SQLite database records may be lost after restarts, redeployments, or instance replacements.

Do not upload real confidential documents to the current deployment. Use sample documents for demonstrations.

Additional production improvements include:

- Persistent file and database storage.
- HTTPS and secure production configuration.
- CSRF protection.
- Login rate limiting.
- Stronger file validation.
- Reliable backup and recovery procedures.
- Expanded automated security testing.

## Future Improvements

- Implement complete Editor permission functionality.
- Add persistent cloud file storage.
- Expand automated authorization and security tests.
- Improve audit log protection.
- Introduce additional document-sharing controls.

## Conclusion

TrustVault demonstrates secure document management and sharing through user authentication, permission-based access control, document handling, and activity tracking.

The project focuses on practical application security, backend development, testing, and deployment as part of the Snovasys Fresher Hiring Challenge 2026 – RISE.

## Author

**Project:** TrustVault – Secure Document Sharing  
**Challenge:** Snovasys Fresher Hiring Challenge 2026 – RISE  
**Source Code:** https://github.com/kavyabakka22-bot/TrustVault  
**Live Application:** https://trustvault-198a.onrender.com
