# JUUMATO API — Feature Roadmap

## Mission

REST API for a campus food ordering platform enabling students to order from campus cafés and nearby restaurants with hostel-based delivery, order tracking, and role-based restaurant/delivery management.

---

## Phase 1: Core API (Completed)

### Authentication & Roles
- [x] Student registration, login, and logout
- [x] Food partner registration, login, and logout
- [x] Delivery partner registration, login, and logout
- [x] Role-based JWT authentication with httpOnly cookies
- [x] `/me` endpoint for session validation

### Student Endpoints
- [x] Browse food items feed
- [x] Like and save food items
- [x] Place orders with delivery details
- [x] View order history
- [x] Cancel orders (pending/confirmed only)

### Food Partner Endpoints
- [x] Create food items with video upload
- [x] Set prices for food items
- [x] View incoming orders
- [x] Update order status: pending → confirmed → preparing → ready
- [x] Auto-assignment of delivery partner on "ready"

### Delivery Partner Endpoints
- [x] View assigned orders
- [x] Update delivery status: on-the-way → delivered

### Order Lifecycle
- [x] pending — order placed
- [x] confirmed — food partner accepted
- [x] preparing — food being prepared
- [x] ready — delivery partner assigned
- [x] on-the-way — delivery in progress
- [x] delivered — order complete
- [x] cancelled — student cancelled

### Backend Infrastructure
- [x] Express.js REST API
- [x] MongoDB Mongoose models
- [x] Cookie-parser for JWT storage
- [x] Configurable CORS
- [x] bcryptjs password hashing
- [x] ImageKit video upload service
- [x] Multer for multipart handling

---

## Phase 2: Enhancements

### Real-time Updates
- [ ] WebSocket for live order status streaming
- [ ] Server-sent events for order notifications
- [ ] Push notification integration

### Payment Integration
- [ ] Razorpay/Stripe payment gateway
- [ ] Campus wallet system
- [ ] Transaction history
- [ ] Refund management for cancelled orders

### Food Discovery
- [ ] Search food items by name
- [ ] Filter by food partner or category
- [ ] Ratings and reviews API
- [ ] Trending/popular items endpoint

### Delivery Optimization
- [ ] Zone-based delivery partner assignment
- [ ] Delivery time estimates
- [ ] Multiple hostel/zone support
- [ ] Delivery partner availability status

### Admin API
- [ ] Admin authentication
- [ ] Platform analytics endpoints
- [ ] User/partner management
- [ ] Dispute resolution workflow

---

## Phase 3: Optimization & Quality

### Performance
- [ ] Redis caching for food feed
- [ ] Database indexing strategy
- [ ] API response pagination
- [ ] Async video processing queue

### Testing
- [ ] Unit tests for controllers
- [ ] Integration tests for order flow
- [ ] API contract tests
- [ ] Load testing

### Security
- [ ] Rate limiting middleware
- [ ] Input sanitization library
- [ ] CSRF protection
- [ ] Security audit

### DevOps
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Health check endpoint
- [ ] Structured logging

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + httpOnly cookies |
| Hashing | bcryptjs |
| Media | ImageKit CDN |
| Uploads | Multer |

---

## Key Metrics

1. **User acquisition** — registrations per role
2. **Order conversion** — orders placed vs. accounts created
3. **Platform growth** — daily orders, average order value
4. **Partner performance** — response time, completion rate
5. **Delivery efficiency** — average delivery time

---

## Notes

- Default food item price: ₹120 (partners can set custom prices)
- Delivery fee: fixed ₹30
- Payment methods: COD, UPI, Wallet (extensible)
- Delivery assignment: automatic on "ready" status
- Order status polling: client-driven (WebSocket planned for Phase 2)

---

**Status**: Core API complete  
**Next priority**: Real-time updates and payment integration
