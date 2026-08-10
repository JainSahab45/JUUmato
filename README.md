# JUUmato

A simple MERN-style starter app with a Node.js + Express backend, MongoDB user model, and authentication routes.

## Project structure

- `backend/` - Express server and API implementation
  - `server.js` - application entry point
  - `src/app.js` - Express app configuration
  - `src/db/db.js` - MongoDB connection helper
  - `src/routes/auth.routes.js` - authentication route definitions
  - `src/controller/auth.controller.js` - register/login controller logic
  - `src/model/user.model.js` - MongoDB user schema
- `frontend/` - frontend application folder (not documented here)

## Features

- User registration
- User login
- Password hashing with `bcryptjs`
- JWT token creation stored in an HTTP cookie
- MongoDB persistence via Mongoose

## Requirements

- Node.js 18+ (or compatible)
- npm
- MongoDB database

## Setup

1. Open a terminal and install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` with the following values:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

3. Start the development server:

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

The backend listens on port `3000` by default.

## API Endpoints

### Register new user

- URL: `POST /api/auth/user/register`
- Body:
  - `username` (string)
  - `email` (string)
  - `password` (string)

Example request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login user

- URL: `POST /api/auth/user/login`
- Body:
  - `email` (string)
  - `password` (string)

Example request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

## Notes

- The server sets a JWT cookie on successful registration and login.
- The backend currently exposes only authentication routes.
- Add frontend instructions in `frontend/` once that app is configured.
