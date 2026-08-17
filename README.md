# JUUMATO API

REST API for a campus food ordering platform. Students place orders from campus cafés and nearby restaurants with hostel-based delivery; food partners manage menus and fulfillment; delivery partners handle last-mile delivery.

Built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication** across three distinct user roles.

---

## Highlights

- **Multi-role authentication** — Students, food partners, and delivery partners each have dedicated register/login flows with role-specific middleware
- **Full order lifecycle** — Seven-state workflow from `pending` through `delivered`, with cancellation support
- **RESTful API design** — 20+ endpoints with consistent request/response patterns and HTTP status codes
- **Secure auth** — bcrypt password hashing, JWT in httpOnly cookies, role-based route protection
- **Media uploads** — Video storage for food items via ImageKit CDN
- **MongoDB data modeling** — Relational references, populated queries, and embedded order line items

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + httpOnly cookies |
| Password hashing | bcryptjs |
| File uploads | Multer + ImageKit |
| Dev tooling | nodemon |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- ImageKit account (for video uploads)

### Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=your-url-endpoint
CLIENT_ORIGIN=http://localhost:3000
```

### Run

```bash
npm run dev    # development with nodemon
npm start      # production
```

Server starts on `http://localhost:3000`.

---

## API Overview

### Authentication (`/api/auth`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/user/register` | Public | Register a student |
| POST | `/user/login` | Public | Student login |
| GET | `/user/logout` | User | Student logout |
| POST | `/food-partner/register` | Public | Register a food partner |
| POST | `/food-partner/login` | Public | Food partner login |
| GET | `/food-partner/logout` | Food partner | Food partner logout |
| POST | `/delivery-partner/register` | Public | Register a delivery partner |
| POST | `/delivery-partner/login` | Public | Delivery partner login |
| GET | `/delivery-partner/logout` | Delivery partner | Delivery partner logout |
| GET | `/me` | Any | Get current authenticated user |

### Food Items (`/api/food`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/` | User | List food items (reel feed) |
| POST | `/` | Food partner | Create food item with video upload |
| GET | `/partner` | Food partner | List partner's own food items |
| POST | `/like` | User | Toggle like on a food item |
| POST | `/save` | User | Toggle save on a food item |
| GET | `/save` | User | Get saved food items |

### Orders (`/api/orders`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/` | User | Place an order |
| GET | `/my` | User | Get student's order history |
| GET | `/partner` | Food partner | Get incoming orders |
| GET | `/delivery` | Delivery partner | Get assigned deliveries |
| PATCH | `/:id/status` | Food partner | Update order status |
| PATCH | `/:id/delivery-status` | Delivery partner | Update delivery status |
| PATCH | `/:id/cancel` | User | Cancel a pending/confirmed order |

---

## Order Lifecycle

```
pending → confirmed → preparing → ready → on-the-way → delivered
   ↓
cancelled (only from pending or confirmed)
```

When an order reaches `ready`, a delivery partner is automatically assigned.

---

## Project Structure

```
JUUmato/
├── backend/
│   ├── src/
│   │   ├── controller/       # Request handlers
│   │   ├── model/            # Mongoose schemas
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── routes/           # Route definitions
│   │   ├── services/         # ImageKit upload service
│   │   ├── db/               # MongoDB connection
│   │   └── app.js            # Express app setup
│   ├── server.js             # Entry point
│   └── package.json
├── ARCHITECTURE.md           # System design details
├── QUICK_START.md            # Setup and API testing guide
├── FEATURE_ROADMAP.md        # Planned enhancements
└── COMPLETION_SUMMARY.md     # Feature checklist
```

---

## Testing with Postman / cURL

All authenticated requests require the JWT cookie set after login. Use `credentials: include` or Postman's cookie jar.

**Register a student:**

```bash
curl -X POST http://localhost:3000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ashish","email":"ashish@campus.edu","password":"secret123","phone":"9876543210"}'
```

**Login (saves cookie):**

```bash
curl -X POST http://localhost:3000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"ashish@campus.edu","password":"secret123"}'
```

**Place an order:**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"items":[{"foodId":"<food-id>","quantity":2}],"hostel":"North Hostel","deliveryAddress":"Room 101","paymentMethod":"cod"}'
```

---

## Documentation

| File | Description |
|------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Environment setup and end-to-end API testing flows |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Auth flows, data models, and design decisions |
| [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) | Completed features and future enhancements |
| [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) | Full feature checklist |

---

## License

ISC
