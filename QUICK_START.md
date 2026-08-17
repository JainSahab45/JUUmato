# JUUMATO API — Quick Start Guide

## Prerequisites

- Node.js 18+
- MongoDB connection string
- ImageKit API credentials (for food video uploads)

---

## Environment Setup

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

`CLIENT_ORIGIN` is a comma-separated list of allowed CORS origins for API clients.

---

## Running the Server

```bash
cd backend
npm install
npm run dev
```

Expected output:

```
MongoDb connected
server is running on port 3000
```

---

## Testing the Complete Flow

Use Postman, Insomnia, or cURL. Enable cookie handling so JWT tokens persist across requests.

### Role 1: Student (Order Food)

1. `POST /api/auth/user/register` — create account
2. `POST /api/auth/user/login` — receive JWT cookie
3. `GET /api/food` — browse available food items
4. `POST /api/food/like` — like a food item
5. `POST /api/food/save` — save a food item
6. `POST /api/orders` — place order with items, hostel, and delivery address
7. `GET /api/orders/my` — view order history
8. `PATCH /api/orders/:id/cancel` — cancel a pending order

### Role 2: Food Partner (Manage Orders)

1. `POST /api/auth/food-partner/register` — create partner account
2. `POST /api/auth/food-partner/login` — receive JWT cookie
3. `POST /api/food` — upload food item with video (multipart/form-data)
4. `GET /api/orders/partner` — view incoming orders
5. `PATCH /api/orders/:id/status` — progress order: `confirmed` → `preparing` → `ready`

### Role 3: Delivery Partner (Deliver Orders)

1. `POST /api/auth/delivery-partner/register` — create delivery account
2. `POST /api/auth/delivery-partner/login` — receive JWT cookie
3. `GET /api/orders/delivery` — view assigned orders
4. `PATCH /api/orders/:id/delivery-status` — update: `on-the-way` → `delivered`

---

## Project Structure

```
JUUmato/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── auth.controller.js
│   │   │   ├── food.controller.js
│   │   │   └── order.controller.js
│   │   ├── model/
│   │   │   ├── user.model.js
│   │   │   ├── fooditem.model.js
│   │   │   ├── foodpartner.model.js
│   │   │   ├── deliverypartner.model.js
│   │   │   └── order.model.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── food.routes.js
│   │   │   └── order.routes.js
│   │   ├── services/
│   │   │   └── storage.service.js
│   │   ├── db/
│   │   │   └── db.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
└── README.md
```

---

## API Endpoints Reference

### Authentication

- `POST /api/auth/user/register`
- `POST /api/auth/user/login`
- `GET /api/auth/user/logout`
- `POST /api/auth/food-partner/register`
- `POST /api/auth/food-partner/login`
- `GET /api/auth/food-partner/logout`
- `POST /api/auth/delivery-partner/register`
- `POST /api/auth/delivery-partner/login`
- `GET /api/auth/delivery-partner/logout`
- `GET /api/auth/me`

### Food Items

- `POST /api/food` — create (multipart: video, name, description, price)
- `GET /api/food` — list all items
- `GET /api/food/partner` — list partner's items
- `POST /api/food/like` — toggle like
- `POST /api/food/save` — toggle save
- `GET /api/food/save` — get saved items

### Orders

- `POST /api/orders` — create order
- `GET /api/orders/my` — student order history
- `GET /api/orders/partner` — food partner orders
- `GET /api/orders/delivery` — delivery partner orders
- `PATCH /api/orders/:id/status` — update fulfillment status
- `PATCH /api/orders/:id/delivery-status` — update delivery status
- `PATCH /api/orders/:id/cancel` — cancel order

---

## Sample Request Bodies

**Register student:**

```json
{
  "name": "Ashish Kumar",
  "email": "ashish@campus.edu",
  "password": "secret123",
  "phone": "9876543210"
}
```

**Place order:**

```json
{
  "items": [
    { "foodId": "507f1f77bcf86cd799439011", "quantity": 2 }
  ],
  "hostel": "North Hostel",
  "deliveryAddress": "Room 101, Block A",
  "paymentMethod": "cod"
}
```

**Update order status (food partner):**

```json
{ "status": "confirmed" }
```

---

## Troubleshooting

### Server won't start

- Verify MongoDB connection string in `.env`
- Ensure port 3000 is available (or set a different `PORT`)
- Confirm all required environment variables are set

### Authentication fails

- Check `JWT_SECRET` is configured
- Ensure cookies are sent with subsequent requests
- Verify the correct role middleware is used for each endpoint

### Video upload fails

- Confirm ImageKit credentials in `.env`
- Use `multipart/form-data` with field name `video`
- Supported formats: mp4, webm, mov

---

For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md).
