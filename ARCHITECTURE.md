# JUUMATO API — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     JUUMATO REST API                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   Student User   │        │  Food Partner    │        │ Delivery Partner │
│   (API Client)   │        │   (API Client)   │        │   (API Client)   │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                            │                          │
         │ HTTP + JWT Cookie          │ HTTP + JWT Cookie        │ HTTP + JWT Cookie
         │                            │                          │
         └────────────────────────────┴──────────────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │    EXPRESS.JS API SERVER          │
                    │    • REST API                     │
                    │    • JWT Authentication           │
                    │    • Cookie-based Sessions        │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │    API Routes               │  │
                    │  │  ├─ /api/auth (10 endpoints)│  │
                    │  │  ├─ /api/food (6 endpoints) │  │
                    │  │  └─ /api/orders (7 endpoints)│  │
                    │  └─────────────────────────────┘  │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │    Middleware               │  │
                    │  │  ├─ authUserMiddleware      │  │
                    │  │  ├─ authfoodpartnermiddle   │  │
                    │  │  ├─ authDeliveryPartner...  │  │
                    │  │  ├─ cors                    │  │
                    │  │  └─ cookie-parser           │  │
                    │  └─────────────────────────────┘  │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │    Controllers              │  │
                    │  │  ├─ auth.controller.js      │  │
                    │  │  ├─ food.controller.js      │  │
                    │  │  └─ order.controller.js     │  │
                    │  └─────────────────────────────┘  │
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │    MONGOOSE ODM LAYER             │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │    Data Models              │  │
                    │  │  ├─ userModel               │  │
                    │  │  ├─ foodPartnerModel        │  │
                    │  │  ├─ deliveryPartnerModel    │  │
                    │  │  ├─ foodModel               │  │
                    │  │  └─ orderModel              │  │
                    │  └─────────────────────────────┘  │
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │    MONGODB                        │
                    │    • users                        │
                    │    • foodpartners                 │
                    │    • deliverypartners             │
                    │    • foods                        │
                    │    • orders                       │
                    │                                   │
                    └─────────────────────────────────┘

    EXTERNAL SERVICES:
    ┌────────────────────────────────────────────┐
    │         ImageKit (CDN)                      │
    │  • Video Upload & Storage                   │
    │  • Media Delivery                           │
    └────────────────────────────────────────────┘
```

---

## Authentication Flow

```
CLIENT                           SERVER
  │                                │
  ├─ POST /api/auth/user/register  │
  │─────────────────────────────→  │
  │                           Hash password (bcrypt)
  │                           Create user document
  │                           Sign JWT token
  │                           Set httpOnly cookie
  │  ← ─────────────────────────── │
  │   JWT in httpOnly cookie        │
  │   User data in response         │
  │                                │
  ├─ GET /api/food                 │
  │─────────────────────────────→  │
  │  (cookie sent automatically)    │
  │                           authUserMiddleware
  │                           Verify JWT signature
  │                           Lookup user by ID
  │                           Attach req.user
  │  ← ─────────────────────────── │
  │   Food items array              │
```

---

## Order Lifecycle Flow

```
STUDENT          FOOD PARTNER      DELIVERY PARTNER       DATABASE
   │                  │                    │                  │
   ├──────────────────────────────────────────────→ Create Order
   │ POST /api/orders                      │        [status: pending]
   │                  │                    │              │
   │                  ├─ GET /partner ─────────────→ Read Order
   │                  │                   │        [status: pending]
   │                  ├─ PATCH /status ──────────→ Update Order
   │                  │ (confirmed)        │      [status: confirmed]
   │                  │                    │              │
   │                  ├─ PATCH /status ──────────→ Update Order
   │                  │ (preparing)        │      [status: preparing]
   │                  │                    │              │
   │                  ├─ PATCH /status ──────────→ Update Order
   │                  │ (ready)            │      [status: ready]
   │                  │                    │      [deliveryPartner assigned]
   │                  │                    │              │
   │                  │                    ├─ GET /delivery
   │                  │                    │              │
   │                  │                    ├─ PATCH /delivery-status
   │                  │                    │ (on-the-way)  [status: on-the-way]
   │                  │                    │              │
   │                  │                    ├─ PATCH /delivery-status
   │                  │                    │ (delivered)   [status: delivered]
   │                  │                    │              │
   ├─ GET /my ──────────────────────────────→ Read Order
   │                  │                    │  [populated refs]
```

---

## Three-Role Authentication System

Each role has its own model, controller methods, routes, and middleware:

```
ROLE: Student/User
├─ Model: userModel
│  └─ Fields: name, email, password, phone
├─ Controller: registerUser, loginUser, logoutUser
├─ Routes: /api/auth/user/register, /api/auth/user/login
└─ Middleware: authUserMiddleware → req.user

ROLE: Food Partner
├─ Model: foodPartnerModel
│  └─ Fields: name, email, password, phone, address, contactname
├─ Controller: registerfoodpartner, loginfoodpartner, logoutFoodPartner
├─ Routes: /api/auth/food-partner/register, /api/auth/food-partner/login
└─ Middleware: authfoodpartnermiddle → req.foodPartner

ROLE: Delivery Partner
├─ Model: deliveryPartnerModel
│  └─ Fields: name, email, password, phone, vehicle, zone
├─ Controller: registerDeliveryPartner, loginDeliveryPartner, logoutDeliveryPartner
├─ Routes: /api/auth/delivery-partner/register, /api/auth/delivery-partner/login
└─ Middleware: authDeliveryPartnerMiddleware → req.deliveryPartner
```

### JWT and Role Detection

```javascript
// JWT Payload
{ id: ObjectId }

// GET /api/auth/me logic:
// 1. Verify JWT from cookie
// 2. Try userModel.findById(id)       → role = "user"
// 3. Try foodPartnerModel.findById(id) → role = "foodPartner"
// 4. Try deliveryPartnerModel.findById(id) → role = "deliveryPartner"
// 5. Return { loggedIn, role, profile }
```

---

## Data Model Relationships

```
Order
├─ user ──→ User (many-to-one)
├─ items (embedded array)
│   ├─ food ──→ Food (reference)
│   ├─ foodPartner ──→ FoodPartner (reference)
│   ├─ name, price (snapshot at order time)
│   └─ quantity
└─ deliveryPartner ──→ DeliveryPartner (optional, assigned at "ready")

Food
├─ foodPartner ──→ FoodPartner (many-to-one)
├─ likes ──→ User[] (many-to-many)
└─ savedBy ──→ User[] (many-to-many)
```

---

## API Response Patterns

### Success (Order Creation)

```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439012",
    "items": [
      {
        "food": "507f1f77bcf86cd799439013",
        "foodPartner": "507f1f77bcf86cd799439014",
        "name": "Paneer Wrap",
        "price": 120,
        "quantity": 2
      }
    ],
    "hostel": "North Hostel",
    "deliveryAddress": "Room 101",
    "totalAmount": 270,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Error

```json
{
  "message": "Invalid order status"
}
```

---

## Order Status Workflow

```
pending → confirmed → preparing → ready → on-the-way → delivered
   ↓
cancelled (only from pending or confirmed)
```

---

## Key Design Decisions

### 1. Automatic Delivery Assignment
When order status reaches `ready`, the first available delivery partner is assigned automatically. Simple for MVP; a zone-based queue system would scale better.

### 2. httpOnly Cookies for JWT
JWT stored in httpOnly cookies rather than response bodies. Protects against XSS; requires `credentials: true` on CORS and cookie forwarding in API clients.

### 3. Price Snapshot in Orders
Item name and price are copied into the order document at creation time. Protects against menu price changes affecting historical orders.

### 4. Single MongoDB Database
All roles share one database instance. Simplifies development; multi-tenant isolation can be added later if needed.

### 5. Separate Auth Flows per Role
Each role has dedicated register/login endpoints and middleware. Clear separation of concerns at the cost of some route duplication.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│   Railway / Render / Fly.io                 │
│   • Express.js API                          │
│   • Node.js runtime                         │
│   • Environment variables                   │
└──────────┬──────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│   MongoDB Atlas                             │
│   • Managed cluster                         │
│   • Automatic backups                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│   ImageKit                                  │
│   • Video storage & CDN                     │
└─────────────────────────────────────────────┘
```

---

## Scalability Considerations

### Current Limitations
1. Automatic delivery assignment does not scale with multiple riders
2. No caching layer — every request hits MongoDB
3. Single database instance with no read replicas
4. Video processing is synchronous

### Recommended Improvements
1. Redis for session caching and rate limiting
2. Message queue (Bull/RabbitMQ) for async video processing
3. Database indexes on `status`, `user`, `foodPartner` fields
4. Zone-based delivery partner queue system
