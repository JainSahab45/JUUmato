# JUUMATO - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     JUUMATO Platform                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   Student User   │        │  Food Partner    │        │ Delivery Partner │
│   (Frontend)     │        │   (Frontend)     │        │   (Frontend)     │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                            │                          │
         │ HTTP/CORS                  │ HTTP/CORS                │ HTTP/CORS
         │                            │                          │
         └────────────────────────────┴──────────────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │    FRONTEND (React + Vite)        │
                    │    • Vite Dev Server              │
                    │    • React Router (SPA)           │
                    │    • localStorage (cart)          │
                    │    • Axios (HTTP client)          │
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                                      │ Port 5173
                                      │ CORS: localhost:3000
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │    EXPRESS.JS BACKEND             │
                    │    • Port 3000                    │
                    │    • REST API                     │
                    │    • JWT Authentication           │
                    │    • Cookie-based Sessions        │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │    API Routes               │  │
                    │  │  ├─ /api/auth (6 endpoints) │  │
                    │  │  ├─ /api/food (5 endpoints) │  │
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
                    │    • Collections                  │
                    │      ├─ users                     │
                    │      ├─ foodpartners              │
                    │      ├─ deliverypartners          │
                    │      ├─ foods                     │
                    │      └─ orders                    │
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

## 🔐 Authentication Flow

```
CLIENT                           SERVER
  │                                │
  ├─ POST /api/auth/user/register  │
  │─────────────────────────────→  │
  │                           Hash password
  │                           Create user
  │                           Sign JWT token
  │                           Set httpOnly cookie
  │  ← ─────────────────────────── │
  │   JWT in httpOnly cookie        │
  │   User data in response         │
  │                                │
  │                                │
  ├─ GET /api/food                 │
  │─────────────────────────────→  │
  │  (automatic cookie sent)        │
  │                           authMiddleware
  │                           Verify JWT
  │                           Lookup user/partner
  │                           Set req.user/partner
  │  ← ─────────────────────────── │
  │   Food items + user context     │
```

---

## 🛒 Order Lifecycle Flow

```
STUDENT          FOOD PARTNER      DELIVERY PARTNER       DATABASE
   │                  │                    │                  │
   ├──────────────────────────────────────────────→ Create Order
   │ Place Order                           │        [status: pending]
   │ (items, hostel, address)              │              │
   │                  │                    │              │
   │                  ├─ Fetch Order ─────────────→ Read Order
   │                  │                   │        [status: pending]
   │                  ├─ Update Status ─────────→ Update Order
   │                  │ (confirmed)        │      [status: confirmed]
   │                  │                    │              │
   │                  ├─ Update Status ─────────→ Update Order
   │                  │ (preparing)        │      [status: preparing]
   │                  │                    │              │
   │                  ├─ Update Status ─────────→ Update Order
   │                  │ (ready)            │      [status: ready]
   │                  │                    │      [deliveryPartner: assigned]
   │                  │                    │              │
   │                  │                    ├─ Fetch Orders
   │                  │                    │ (status: ready)
   │                  │                    │              │
   │                  │                    ├─ Update Status ──→ Update Order
   │                  │                    │ (on-the-way)  [status: on-the-way]
   │                  │                    │              │
   │                  │                    ├─ Update Status ──→ Update Order
   │                  │                    │ (delivered)   [status: delivered]
   │                  │                    │              │
   ├─ Track Order ──────────────────────────→ Read Order
   │ (fetch status)   │                    │  [populated]
   │                  │                    │              │
   └────────────────────────────────────────────────────────→
```

---

## 🔄 Three-Role Authentication System

### Architecture Pattern
Each role has three components:

```
ROLE: Student/User
├─ Model: userModel
│  └─ Fields: name, email, password, phone, createdAt
├─ Auth Controller: registerUser, loginUser, getMe
├─ Route: /api/auth/user/register, /api/auth/user/login
└─ Middleware: authUserMiddleware (req.user)

ROLE: Food Partner/Restaurant
├─ Model: foodPartnerModel
│  └─ Fields: name, email, password, phone, address, contactname
├─ Auth Controller: registerFoodPartner, loginFoodPartner
├─ Route: /api/auth/food-partner/register, /api/auth/food-partner/login
└─ Middleware: authfoodpartnermiddle (req.foodPartner)

ROLE: Delivery Partner/Rider
├─ Model: deliveryPartnerModel
│  └─ Fields: name, email, password, phone, vehicle, zone
├─ Auth Controller: registerDeliveryPartner, loginDeliveryPartner
├─ Route: /api/auth/delivery-partner/register, /api/auth/delivery-partner/login
└─ Middleware: authDeliveryPartnerMiddleware (req.deliveryPartner)
```

### JWT Claims & Role Detection
```
JWT Payload:
{
  id: ObjectId,      // Reference to specific role model
  role: string       // Implicit: "user" | "foodPartner" | "deliveryPartner"
}

getMe Endpoint Logic:
1. Verify JWT token
2. Check userModel.findById(id) → if found: role = "user"
3. Check foodPartnerModel.findById(id) → if found: role = "foodPartner"
4. Check deliveryPartnerModel.findById(id) → if found: role = "deliveryPartner"
5. Return { loggedIn: true, role, user/foodPartner/deliveryPartner }
```

---

## 🗄️ Data Model Relationships

```
Order
├─ user ──→ User (many-to-one)
│   └─ Can have multiple orders
│
├─ items (array)
│   ├─ food ──→ Food (reference)
│   ├─ foodPartner ──→ FoodPartner (reference)
│   ├─ price (stored at order time)
│   └─ quantity
│
└─ deliveryPartner ──→ DeliveryPartner (optional, many-to-one)
   └─ Assigned when order status = "ready"

Food
├─ foodPartner ──→ FoodPartner (many-to-one)
│
├─ likes (array)
│   └─ User[] (many-to-many: users who liked)
│
└─ savedBy (array)
   └─ User[] (many-to-many: users who saved)
```

---

## 📡 API Response Patterns

### Success Response (Order Creation)
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

### Error Response
```json
{
  "message": "Invalid order status",
  "error": "Error message details"
}
```

---

## 🔌 Frontend-Backend Communication

### Cookie-Based JWT Flow
```
1. POST /api/auth/user/login
   Response headers: Set-Cookie: jwt=<token>; HttpOnly; Secure; SameSite=Strict

2. Subsequent requests with credentials:true
   axios.get("/api/orders/my", { withCredentials: true })
   Sends: Cookie: jwt=<token>

3. Middleware verifies:
   const token = req.cookies.jwt
   const decoded = jwt.verify(token, JWT_SECRET)
```

### localStorage Architecture (Cart)
```
localStorage['juumato-cart'] = JSON.stringify([
  {
    foodId: "507f1f77bcf86cd799439011",
    quantity: 2,
    price: 120,
    name: "Paneer Wrap"
  },
  {
    foodId: "507f1f77bcf86cd799439012",
    quantity: 1,
    price: 150,
    name: "Butter Chicken"
  }
])

// On checkout:
POST /api/orders with items from localStorage
// Clear localStorage after successful order
```

---

## 🎯 Status Workflow

### Complete Status Enum
```
'pending'      → Order placed, awaiting food partner
'confirmed'    → Food partner accepted
'preparing'    → Food is being prepared
'ready'        → Food ready, delivery partner assigned
'on-the-way'   → Delivery partner in transit
'delivered'    → Order completed
'cancelled'    → Order cancelled by user (only pending/confirmed)
```

### Transitions
```
pending → confirmed → preparing → ready → on-the-way → delivered
   ↓
cancelled (only from pending/confirmed)
```

---

## 🔍 Key Design Decisions

### 1. Automatic Delivery Assignment
- **Decision**: Assign first delivery partner when order status = "ready"
- **Pro**: Simple logic, no queue management needed
- **Con**: May not be scalable for high volume
- **Future**: Implement queue system with zone-based assignment

### 2. localStorage for Cart
- **Decision**: Use browser localStorage for temporary cart
- **Pro**: No backend calls needed, instant updates
- **Con**: No persistence across devices, vulnerable to clearing
- **Future**: Implement server-side cart API

### 3. httpOnly Cookies for JWT
- **Decision**: Store JWT in httpOnly cookies, not localStorage
- **Pro**: More secure against XSS attacks
- **Con**: Requires credentials:true on CORS requests
- **Trade-off**: Security > convenience

### 4. Single MongoDB Database
- **Decision**: All roles share one MongoDB instance
- **Pro**: Simple setup, unified data
- **Con**: No database-level isolation
- **Future**: Multi-tenant architecture if needed

### 5. Three Separate Auth Flows
- **Decision**: Each role has separate registration/login pages
- **Pro**: Role-specific onboarding, clear UX
- **Con**: Code duplication in auth pages
- **Trade-off**: UX clarity > code DRY principle

---

## 🚀 Deployment Architecture

### Recommended Setup
```
┌─────────────────────┐
│   Vercel            │  Frontend (React)
│   - Next.js/Vite    │  - Automatic builds
│   - CDN Edge        │  - Global distribution
└──────────┬──────────┘
           │ https
           ▼
┌─────────────────────────────────────────────┐
│   Railway/Render                            │
│   - Express.js Backend                      │
│   - Node.js runtime                         │
│   - Environment variables                   │
└──────────┬──────────────────────────────────┘
           │ Database connection
           ▼
┌─────────────────────────────────────────────┐
│   MongoDB Atlas                             │
│   - Cloud database                          │
│   - Automatic backups                       │
│   - Cluster monitoring                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│   ImageKit                                  │
│   - Media storage & CDN                     │
│   - Video processing                        │
│   - Real-time analytics                     │
└─────────────────────────────────────────────┘
```

---

## 📊 Scalability Considerations

### Current Bottlenecks
1. **Automatic delivery assignment**: Doesn't scale with multiple riders
2. **No caching**: Every request hits database
3. **Single MongoDB instance**: No read replicas
4. **No async job queue**: Video processing is synchronous

### Scaling Recommendations
1. Implement Redis for caching
2. Add message queue (Bull/RabbitMQ) for async jobs
3. Database indexing on frequently queried fields
4. Implement CDN caching for static assets
5. Use connection pooling for database

---

**Architecture Document Last Updated**: Current Session  
**Version**: 1.0 - MVP
