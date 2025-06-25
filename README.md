
# Full MERN Authentication App

This is a complete authentication system built with the **MERN Stack**:

* **Frontend**: React
* **Backend**: Node.js + Express
* **Database**: MongoDB

Includes secure user authentication with:

* Registration and login
* Google login using OAuth 2.0
* Email verification after signup
* Password reset via email

---

## Features

### User Authentication

* Register with email and password
* Login using credentials
* Google login with popup
* Logout by clearing session/token

### Email Verification

* Users receive a verification email (OTP or link)
* Only verified users can access protected routes

### Password Reset

* Users can request password reset
* Reset instructions are sent to email
* User can set a new password after verification

---

## Visit the Code

This project has two main folders:

* **`Frontend/`** – contains the React frontend code
* **`Backend/`** – contains the Node.js + Express backend code

To explore the code or make changes:

* Open `Frontend/` for all React files like components, pages, and routes
* Open `Backend/` for backend code including APIs, models, and authentication logic

---

## Backend as NPM Package

The authentication backend is also available as an installable NPM package.

📦**NPM Package Name**: `node-auth-suite`
🔗 **NPM Link**: [[https://www.npmjs.com/package/node-auth-suite](https://www.npmjs.com/package/node-auth-suite)](https://www.npmjs.com/package/node-auth-suite)

### How to Use

You can install it in your backend project using:

```bash
npm install node-auth-suite
```

> This package includes routes for authentication, user model integration, Google OAuth, email verification, and password reset.

Make sure to configure your `.env` and initialize MongoDB and Express properly to integrate it.
