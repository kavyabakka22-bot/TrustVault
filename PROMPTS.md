# PROMPTS.md

# TrustVault — AI-Assisted Development Record

**Project:** TrustVault — Secure Document Sharing with a Real Audit Trail  
**Challenge:** Snovasys Fresher Hiring Challenge 2026 — RISE  
**Technology:** Node.js, Express.js, SQLite, HTML, CSS, JavaScript  
**AI Tool:** ChatGPT

## Important Note

This document records how AI assistance was used during the development of TrustVault.

It was prepared retrospectively on November 7, 2026, using my development discussions, project notes, implementation work, and GitHub history.

The prompts below are reconstructed summaries of the development discussions and are not claimed to be exact verbatim chat transcripts.

AI was used as a development assistant for understanding requirements, generating suggestions, troubleshooting errors, and improving the application. I reviewed the suggestions, integrated the required changes, and tested the application.

---

## Entry 1 — Project Setup and Backend Development

**Date:** November 6, 2026

**Prompt given to AI:**

Help me create a secure document-sharing web application called TrustVault. Guide me through the project setup, backend development, database connection, and required application features.

**AI output:**

AI suggested a Node.js and Express.js backend, SQLite database, user authentication, document uploads, and a frontend for managing documents.

**What needed improvement:**

The initial suggestions needed to be checked against the actual project requirements. The application also needed proper testing and configuration before deployment.

**What I did:**

I created the TrustVault project, configured the backend and database, developed the frontend pages, and worked on implementing and testing the application features.

**GitHub evidence:**

[Initial TrustVault project](https://github.com/kavyabakka22-bot/TrustVault/commit/135455fe8da2f91887465e0dd6dd334a65270b84)

---

## Entry 2 — Authentication and Access Control

**Date:** November 6, 2026

**Prompt given to AI:**

Help me improve TrustVault authentication and session security. Ensure that users must log in before accessing private documents and protected APIs.

**AI output:**

AI suggested password hashing, session-based authentication, protected routes, secure cookie settings, and environment-based session secrets.

**What needed improvement:**

Security suggestions needed to be checked against the actual application configuration. Session security and access protection also needed testing.

**What I did:**

I improved the authentication and session configuration, checked that protected APIs required login, and tested access using separate user accounts.

**GitHub evidence:**

[Improve session security and persistent storage](https://github.com/kavyabakka22-bot/TrustVault/commit/c1cf56f6a68271a8ce5db20d2b5908638054e2f9)

---

## Entry 3 — Document Sharing and Authorization

**Date:** November 6, 2026

**Prompt given to AI:**

Help me implement secure document sharing so that a logged-in user can share a document with another registered user and control their access permissions.

**AI output:**

AI suggested implementing document sharing, permission checks, recipient access, and the ability to revoke access.

**What needed improvement:**

The suggested implementation needed to be checked to ensure that users could not access documents belonging to other users without permission.

**What I did:**

I reviewed and tested document ownership and sharing access. I checked whether an authorized recipient could access a shared document and whether access was denied after revocation.

**GitHub evidence:**

[TrustVault source repository](https://github.com/kavyabakka22-bot/TrustVault)

---

## Entry 4 — Automated Security Testing

**Date:** November 7, 2026

**Prompt given to AI:**

Help me write automated tests to verify that the TrustVault backend runs correctly and that document-related APIs require authentication.

**AI output:**

AI suggested backend tests for server availability and authentication protection for document, shared document, and activity APIs.

**What needed improvement:**

The initial tests needed to be executed locally to confirm that they passed. Some tests initially failed when the backend server was not running.

**What I did:**

I started the backend server in a separate Command Prompt window and ran the following command:

`npm test`

All four tests passed in my local testing environment.

**GitHub evidence:**

[TrustVault source repository and test files](https://github.com/kavyabakka22-bot/TrustVault)

---

## Entry 5 — Deployment and Storage Troubleshooting

**Date:** November 7, 2026

**Prompt given to AI:**

Help me troubleshoot TrustVault deployment on Render and resolve dependency installation problems.

**AI output:**

AI suggested checking deployment logs, package dependencies, build configuration, and storage limitations.

**What needed improvement:**

The deployment configuration needed to match the actual dependencies and hosting environment. The free hosting environment also has limitations on persistent file storage.

**What I did:**

I updated the dependency configuration, added the required `picomatch` dependency, checked package installation, and verified the deployed application. I also documented the temporary-storage limitation.

**GitHub evidence:**

[TrustVault GitHub commit history — Add picomatch dependency for deployment](https://github.com/kavyabakka22-bot/TrustVault/commits/main/)

---

## What I Learned

1. AI-generated code must be reviewed and tested before implementation.
2. Authentication and authorization are different security concepts.
3. Server-side permission checks are important for secure document sharing.
4. SHA-256 helps verify file integrity by detecting changes in file contents.
5. Audit logs help track important application activities.
6. Debugging errors improved my understanding of backend development.
7. Automated testing helps identify problems before deployment.
8. Deployment helped me understand how a web application works online.
9. Secure session configuration and access control are important for protecting user information.

---

## My Responsibility

I used ChatGPT as an AI development assistant for understanding requirements, generating guidance, and troubleshooting errors.

I reviewed the suggestions, integrated the required code into my project, tested the application, and worked on correcting problems.

The implementation, integration, testing, and project development involved my own effort and decisions. AI assistance supported my learning and development process.

This project helped me gain practical experience with Node.js, Express.js, SQLite, authentication, authorization, document sharing, automated testing, security, and deployment.

---

## Project Links

**Live Application:**  
https://trustvault-198a.onrender.com

**GitHub Repository:**  
https://github.com/kavyabakka22-bot/TrustVault

**Challenge:**  
Snovasys Fresher Hiring Challenge 2026 — RISE
