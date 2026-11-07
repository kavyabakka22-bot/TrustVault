# TrustVault – Security Threat Model (THREATS.md)

## 1. Introduction

TrustVault is a secure document-sharing web application that allows users to register, log in, upload PDF documents, share documents with other registered users, and revoke document access.

This threat model identifies potential security risks, their impact, existing security controls, and the tests required to verify those controls.

## 2. Application Technology

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: SQLite
- Authentication: bcryptjs and express-session
- File Upload: Multer
- Security Middleware: Helmet
- Deployment: Render

## 3. Assets That Need Protection

The following assets are important to TrustVault:

1. User account information.
2. Password hashes.
3. User login sessions.
4. Uploaded PDF documents.
5. Document ownership information.
6. Document-sharing permissions.
7. Activity records.
8. Database contents.
9. Application secrets and environment variables.

## 4. Threat Identification and Analysis

### Threat 1: Unauthorized Access

**Description:** An unauthenticated person may attempt to access private application resources.

**Impact:** Exposure of private documents and user information.

**Mitigation:**
- Require authentication for protected routes.
- Validate user sessions.
- Reject requests from unauthenticated users.

**Testing:**
- Send requests to protected APIs without logging in.
- Verify that access is rejected.

### Threat 2: Password Theft

**Description:** Attackers may obtain user passwords through database exposure or other attacks.

**Impact:** Unauthorized account access.

**Mitigation:**
- Hash passwords using bcryptjs.
- Never store plaintext passwords.
- Use secure authentication practices.

**Testing:**
- Verify that passwords are stored as hashes.
- Verify that incorrect passwords cannot authenticate users.

### Threat 3: Insecure Direct Object Reference (IDOR)

**Description:** A logged-in user may change a document ID in a request to access another user's private document.

**Impact:** Unauthorized document viewing or downloading.

**Mitigation:**
- Check document ownership on every private document request.
- Check sharing permissions before allowing recipient access.
- Never rely only on document IDs for authorization.

**Testing:**
- Create two user accounts.
- Upload a private document using User A.
- Attempt to access it using User B.
- Verify that the request is rejected.

### Threat 4: Unauthorized Document Sharing

**Description:** A user may attempt to share a document that belongs to another user.

**Impact:** Unauthorized distribution of private documents.

**Mitigation:**
- Verify document ownership before sharing.
- Validate the recipient account.
- Enforce permission checks on the server.

**Testing:**
- Log in as User B.
- Attempt to share User A's document.
- Verify that sharing is rejected.

### Threat 5: Revoked Access Abuse

**Description:** A recipient may attempt to access a document after the owner revokes sharing permission.

**Impact:** Continued unauthorized access to private documents.

**Mitigation:**
- Check current sharing permissions during every download request.
- Reject requests when sharing permission has been revoked.

**Testing:**
- Share a document with User B.
- Revoke User B's access.
- Attempt to download the document using User B's account.
- Verify that access is rejected.

### Threat 6: Malicious File Upload

**Description:** An attacker may upload executable files or files disguised as PDFs.

**Impact:** File abuse, storage risks, or possible application compromise.

**Mitigation:**
- Restrict allowed file types.
- Validate file extensions and MIME types.
- Check file signatures where practical.
- Set upload size limits.
- Store files outside publicly accessible directories.

**Testing:**
- Attempt to upload an unsupported file.
- Attempt to upload an oversized file.
- Verify that invalid uploads are rejected.

### Threat 7: Session Hijacking

**Description:** An attacker may steal or misuse a valid session identifier.

**Impact:** Unauthorized access to a user's account.

**Mitigation:**
- Use secure session configuration.
- Enable HttpOnly cookies.
- Enable Secure cookies in production.
- Use an appropriate SameSite setting.
- Regenerate the session identifier after login.
- Protect session secrets.

**Testing:**
- Inspect session cookie security attributes.
- Verify that the session identifier changes after login.
- Verify that logout invalidates the session.

### Threat 8: Cross-Site Scripting (XSS)

**Description:** An attacker may inject malicious JavaScript into application input fields or displayed content.

**Impact:** Theft of session information or unwanted actions in a user's browser.

**Mitigation:**
- Escape untrusted content before displaying it.
- Avoid unsafe HTML insertion.
- Use Helmet security headers.
- Consider a suitable Content Security Policy.

**Testing:**
- Submit script-like input in relevant fields.
- Verify that it is displayed as harmless text and not executed.

### Threat 9: Brute-Force Login Attempts

**Description:** Attackers may repeatedly attempt to guess user passwords.

**Impact:** Account compromise.

**Mitigation:**
- Add rate limiting to authentication endpoints.
- Use strong password requirements.
- Monitor repeated failed login attempts.

**Testing:**
- Send repeated login attempts.
- Verify that configured rate limits block excessive requests.

### Threat 10: Data Loss

**Description:** Application restarts or deployment changes may remove data stored on temporary storage.

**Impact:** Loss of user accounts, database records, and uploaded documents.

**Mitigation:**
- Configure persistent database storage.
- Configure persistent file storage.
- Maintain secure backups.
- Test backup restoration.

**Testing:**
- Verify that database and uploaded files survive a controlled restart after persistent storage is configured.

## 5. Existing Security Controls

The TrustVault project includes the following security-related controls:

- Password hashing using bcryptjs.
- Session-based authentication.
- Protected API routes.
- Helmet middleware.
- Private document upload storage.
- Session cookie security configuration.
- Environment-based session secret configuration.
- Document-sharing functionality.
- Access revocation functionality.

These controls must be tested individually. Their presence alone does not prove that they are correctly implemented.

## 6. Existing Automated Test Coverage

The existing test suite contains four tests:

| Test | Purpose |
|---|---|
| Backend availability | Checks whether the backend responds |
| Documents API authentication | Checks that login is required |
| Shared Documents API authentication | Checks that login is required |
| Activities API authentication | Checks that login is required |

These tests provide basic backend and authentication coverage.

They do not currently prove protection against every threat identified in this document.

## 7. Additional Automated Tests Required

The following tests should be implemented:

1. Verify that one user cannot download another user's private document.
2. Verify that one user cannot share another user's document.
3. Verify that revoked recipients cannot download documents.
4. Verify that invalid file types are rejected.
5. Verify that oversized files are rejected.
6. Verify that logout invalidates the session.
7. Verify that session identifiers are regenerated after login.
8. Verify that login rate limiting works.
9. Verify that untrusted user input is safely displayed.
10. Verify persistent storage after a controlled restart.

## 8. Risk Assessment

| Threat | Risk Level |
|---|---|
| Unauthorized access | High |
| Password theft | High |
| IDOR | High |
| Unauthorized sharing | High |
| Revoked access abuse | High |
| Malicious file upload | High |
| Session hijacking | High |
| Cross-site scripting | High |
| Brute-force login | Medium |
| Data loss | High |

Risk levels are preliminary assessments and should be reviewed through security testing.

## 9. Known Limitations

- The current four automated tests cover only basic backend availability and unauthenticated API access.
- Cross-user authorization has not been verified through automated tests.
- File upload security requires additional testing.
- Session security requires additional testing.
- Persistent storage is not configured on the current Render free deployment.
- The application has not undergone an independent penetration test.

## 10. Future Security Improvements

- Implement comprehensive authorization tests.
- Add file validation and upload security tests.
- Add login rate limiting.
- Improve session lifecycle testing.
- Configure persistent database and file storage.
- Review and update vulnerable dependencies.
- Implement security monitoring and backups.
- Perform an independent security assessment before production use.

## 11. Conclusion

TrustVault includes important security features such as password hashing, session authentication, protected APIs, document sharing, and access revocation.

However, a secure application requires more than implementing security controls. Each control must be verified through appropriate automated and manual testing.

The current automated tests provide a starting point. Additional security tests are necessary before TrustVault can be considered ready for production use.

---

**Document:** THREATS.md  
**Project:** TrustVault – Secure Document Sharing  
**Status:** Initial threat model documentation