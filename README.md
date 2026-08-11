# JUUmato

A MERN-style starter app with a Node.js + Express backend, MongoDB persistence, authentication, and food partner upload APIs.

## Project structure

- `backend/` - Express server and API implementation
  - `server.js` - application entry point
  - `src/app.js` - Express app configuration
  - `src/db/db.js` - MongoDB connection helper
  - `src/routes/auth.routes.js` - authentication route definitions
  - `src/routes/food.routes.js` - food upload and listing routes
  - `src/controller/auth.controller.js` - user and food partner auth logic
  - `src/controller/food.controller.js` - food item creation and retrieval
  - `src/model/user.model.js` - user schema
  - `src/model/foodpartner.model.js` - food partner schema
  - `src/model/fooditem.model.js` - food item schema
  - `src/services/storage.service.js` - ImageKit file upload service
- `frontend/` - frontend application folder (not documented here)

## Features

- User registration and login
- Food partner registration and login
- JWT authentication stored in cookies
- MongoDB persistence with Mongoose
- ImageKit-based video uploading for food items
- Protected food creation and listing endpoints

## Requirements

- Node.js 18+ (or compatible)
- npm
- MongoDB database
- ImageKit account and API keys for file upload

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` with the required values:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
IMAGEKIT_URL_ENDPOINT=<your-imagekit-url-endpoint>
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

### User authentication

#### Register user

- URL: `POST /api/auth/user/register`
- Body:
  - `username` (string)
  - `email` (string)
  - `password` (string)

Example:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Login user

- URL: `POST /api/auth/user/login`
- Body:
  - `email` (string)
  - `password` (string)

Example:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Logout user

- URL: `GET /api/auth/user/logout`

### Food partner authentication

#### Register food partner

- URL: `POST /api/auth/food-partner/register`
- Body:
  - `name` (string)
  - `email` (string)
  - `password` (string)

#### Login food partner

- URL: `POST /api/auth/food-partner/login`
- Body:
  - `email` (string)
  - `password` (string)

#### Logout food partner

- URL: `GET /api/auth/food-partner/logout`

### Food endpoints

#### Create food item

- URL: `POST /api/food`
- Protected by food partner authentication
- Content type: `multipart/form-data`
- Fields:
  - `video` (file)
  - `name` (string)
  - `description` (string)

#### List food items

- URL: `GET /api/food/`
- Protected by regular user authentication

## Notes

- Authentication uses a JWT stored in a cookie named `token`.
- Food creation uploads a video file via ImageKit and stores the returned URL.
- Update `frontend/` documentation once the client app is ready.
