# TrustVault – AI Prompt Engineering Log

This document records how AI tools were used during the development of TrustVault. AI was used as a development assistant. I reviewed the suggestions, tested the application, and worked through errors during implementation.

**Project:** TrustVault – Secure Document Sharing  
**GitHub:** https://github.com/kavyabakka22-bot/TrustVault  
**Live application:** https://trustvault-198a.onrender.com

> Honesty note: The entries below are a draft reconstruction from the available project development history. Verify and edit each date, prompt, AI output, correction, and commit link against your actual work before submitting. Do not present reconstructed details as exact historical records.

---

## Entry 1 – Project Setup and Backend Development

**Date:** 2026-11-06

**Prompt asked:**

"Help me build a secure document-sharing application called TrustVault using Node.js, Express, SQLite, HTML, CSS, and JavaScript. Explain the project structure and implementation step by step."

**What AI produced:**

Suggested the project structure, frontend pages, backend setup, and database integration.

**What was wrong:**

The initial implementation required further integration and testing. The application could not be considered complete just because the code was generated.

**What I did instead:**

I worked through the setup, connected the frontend and backend, and tested the application locally.

**Commit reference:** [Initial TrustVault project](https://github.com/kavyabakka22-bot/TrustVault/commit/135455f)

---

## Entry 2 – Authentication and Access Control

**Date:** 2026-11-06

**Prompt asked:**

"Help me implement user registration, login, password hashing, session authentication, and protected API routes. Make sure users cannot access protected resources without logging in."

**What AI produced:**

Provided authentication and session-management implementation guidance.

**What was wrong:**

A protected route alone does not guarantee that users can access only their own documents. Ownership and permission checks are also necessary.

**What I did instead:**

I worked on session security and protected API routes, then ran automated tests to verify that unauthenticated requests were rejected.

**Commit reference:** [Session security improvements](https://github.com/kavyabakka22-bot/TrustVault/commit/c1cf56f)

---

## Entry 3 – Document Sharing and Authorization

**Date:** 2026-11-06

**Prompt asked:**

"Help me implement secure document sharing between registered users. Only the document owner should be allowed to share a document or revoke another user's access. Recipients should only access documents shared with them."

**What AI produced:**

Provided guidance for document-sharing functionality and permission handling.

**What was wrong:**

Successful sharing does not automatically prove that unauthorized users cannot access documents. Cross-user access and revoked-access behavior need separate verification.

**What I did instead:**

I tested sharing a sample PDF with a second account, verified recipient access and download, and tested revoking access. These were manual checks, not proof that all authorization attacks are prevented.

**Commit reference:** Add the actual GitHub commit URL for the document-sharing implementation after verifying it in the repository history.

---

## Entry 4 – Automated Security Testing

**Date:** 2026-11-07

**Prompt asked:**

"Help me create automated tests using the Node.js built-in test runner. Test backend availability and make sure document, shared-document, and activity APIs require authentication."

**What AI produced:**

Provided test guidance for protected API endpoints.

**What was wrong:**

The initial tests covered unauthenticated API access but did not cover all security risks, such as IDOR, revoked access, and malicious uploads.

**What I did instead:**

I ran `npm test` with the backend running and confirmed that all four existing tests passed. I documented the additional security tests still required.

**Commit reference:** Add the actual GitHub commit URL for the test implementation after verifying it in the repository history.

---

## Entry 5 – Deployment and Storage Troubleshooting

**Date:** 2026-11-07

**Prompt asked:**

"Help me deploy my Node.js and SQLite application on Render. Explain deployment errors, dependency issues, and how to fix them."

**What AI produced:**

Provided deployment troubleshooting guidance for SQLite compatibility and dependency installation.

**What was wrong:**

The initial deployment encountered a SQLite native binary compatibility issue and a package-lock dependency mismatch.

**What I did instead:**

I resolved the dependency issue, added the required `picomatch` dependency, updated the lock file, and verified the deployment.

**Commit reference:** [Add picomatch dependency](https://github.com/kavyabakka22-bot/TrustVault/commit/25255d5)

**Additional observation:**

Render's free service does not have persistent storage configured. Uploaded files and database data may be lost after a restart or redeployment.

---

## AI Usage Reflection

AI helped me understand project architecture, authentication, document sharing, debugging, automated testing, and deployment.

I did not treat AI-generated code as automatically correct. I tested the application, investigated errors, and identified areas where additional security testing was necessary.

The project still requires more comprehensive authorization and security tests before production use.

## Conclusion

AI was used as a development assistant throughout TrustVault development. This log documents the prompts, implementation decisions, testing, corrections, and remaining limitations honestly.