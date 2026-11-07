# TrustVault – AI Usage Log

This document records how AI assistance was used during the development of TrustVault. The prompts below are reconstructed summaries of the development discussions and are not claimed to be exact verbatim chat transcripts.

## 1. Project Setup and Backend Development

**Date:** 2026-11-06

**Prompt given to AI:**

Help me create a secure document-sharing web application called TrustVault. Guide me through the project setup, backend development, database connection, and required application features.

**AI output:**

AI suggested a Node.js and Express backend, SQLite database, user authentication, document uploads, and a frontend for managing documents.

**What was wrong with the AI output:**

The initial suggestions needed to be checked against the actual project requirements. The application also needed proper testing and configuration before deployment.

**What I did instead:**

I created the TrustVault project, configured the backend and database, developed the frontend pages, and tested the application features.

**GitHub commit:**

https://github.com/kavyabakka22-bot/TrustVault/commit/135455fe8da2f91887465e0dd6dd334a65270b84

---

## 2. Authentication and Access Control

**Date:** 2026-11-06

**Prompt given to AI:**

Help me improve TrustVault authentication and session security. Ensure that users must log in before accessing private documents and protected APIs.

**AI output:**

AI suggested password hashing, session-based authentication, protected routes, secure cookie settings, and environment-based session secrets.

**What was wrong with the AI output:**

Security suggestions needed to be checked against the actual application configuration. Session security and access protection also needed testing.

**What I did instead:**

I improved the authentication and session configuration, checked that protected APIs required login, and tested access using separate user accounts.

**GitHub commit:**

https://github.com/kavyabakka22-bot/TrustVault/commit/c1cf56f6a68271a8ce5db20d2b5908638054e2f9

---

## 3. Document Sharing and Authorization

**Date:** 2026-11-06

**Prompt given to AI:**

Help me implement secure document sharing so that a logged-in user can share a document with another registered user and control their access permissions.

**AI output:**

AI suggested implementing document sharing, permission checks, recipient access, and the ability to revoke access.

**What was wrong with the AI output:**

The suggested implementation needed to be checked to ensure that users could not access documents belonging to other users without permission.

**What I did instead:**

I reviewed and tested document ownership and sharing access. I verified that the recipient could access a shared document and that access was denied after revocation.

**GitHub commit:**

https://github.com/kavyabakka22-bot/TrustVault/commit/135455fe8da2f91887465e0dd6dd334a65270b84

---

## 4. Automated Security Testing

**Date:** 2026-11-07

**Prompt given to AI:**

Help me write automated tests to verify that the TrustVault backend runs correctly and that document-related APIs require authentication.

**AI output:**

AI suggested backend tests for server availability and authentication protection for document, shared document, and activity APIs.

**What was wrong with the AI output:**

The initial tests needed to be executed locally to confirm that they passed. Some tests initially failed when the backend server was not running.

**What I did instead:**

I started the backend server in a separate Command Prompt window and ran `npm test`. All four tests passed.

**GitHub commit:**

https://github.com/kavyabakka22-bot/TrustVault/commit/135455fe8da2f91887465e0dd6dd334a65270b84

---

## 5. Deployment and Storage Troubleshooting

**Date:** 2026-11-07

**Prompt given to AI:**

Help me troubleshoot TrustVault deployment on Render and resolve dependency installation problems.

**AI output:**

AI suggested checking the deployment logs, package dependencies, build configuration, and storage limitations.

**What was wrong with the AI output:**

The deployment configuration needed to match the actual dependencies and the hosting environment. The free hosting environment also has limitations on persistent file storage.

**What I did instead:**

I updated the dependency configuration, added the required `picomatch` dependency, checked the package installation, and verified the deployment. I also documented the temporary-storage limitation.

**GitHub commit:**

https://github.com/kavyabakka22-bot/TrustVault/commit/25255d5e7edbf4faeis log documents the prompts, implementation decisions, testing, corrections, and remaining limitations honestly.
