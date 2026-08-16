# JUUMATO - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB connection string in `.env`
- ImageKit API credentials for video uploads

### Environment Setup

#### Backend (.env)
Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=your-url-endpoint
```

#### Frontend
No environment file needed - connects to `http://localhost:3000`

---

## 🏃 Running the App

### 1. Start Backend
```bash
cd backend
npm install
node server.js
# Output should show: "server is running on port 3000" and "MongoDb connected"
```

### 2. Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🧪 Testing the Complete Flow

### Test User 1: Student (Order Food)
1. Go to http://localhost:5173
2. Click "Register" → "Student"
3. Fill form → Register
4. Login with your credentials
5. Browse reel feed
6. Click cart button on any food item
7. Go to Cart (bottom nav)
8. Enter hostel name & address
9. Place Order
10. Track order in "Orders" tab

### Test User 2: Food Partner (Manage Orders)
1. Register as Food Partner
2. Create food item with video + price
3. Wait for orders from students
4. View orders in dashboard
5. Update status: pending → confirmed → preparing → ready
6. See delivery partner auto-assigned

### Test User 3: Delivery Partner (Deliver Orders)
1. Register as Delivery Partner
2. Go to Delivery Dashboard
3. Accept orders with status "ready"
4. Update status: ready → on-the-way → delivered

---

## 📂 Project Structure

```
JUUmato/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── auth.controller.js      # Auth logic for all roles
│   │   │   ├── food.controller.js      # Food items & reels
│   │   │   └── order.controller.js     # Order CRUD & status
│   │   ├── model/
│   │   │   ├── user.model.js
│   │   │   ├── fooditem.model.js
│   │   │   ├── foodpartner.model.js
│   │   │   ├── deliverypartner.model.js
│   │   │   └── order.model.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # JWT verification
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── food.routes.js
│   │   │   └── order.routes.js
│   │   ├── services/
│   │   │   └── storage.service.js      # ImageKit upload
│   │   ├── db/
│   │   │   └── db.js                   # MongoDB connection
│   │   └── app.js                      # Express app setup
│   ├── server.js                       # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/                   # Registration/Login pages
│   │   │   ├── user/                   # Student pages
│   │   │   ├── food-partner/           # Restaurant pages
│   │   │   ├── delivery-partner/       # Rider pages
│   │   │   └── general/                # Home, saved items
│   │   ├── components/
│   │   │   ├── ReelFeed.jsx            # Video feed component
│   │   │   └── BottomNav.jsx           # Navigation bar
│   │   ├── styles/
│   │   │   ├── theme.css               # Theme variables
│   │   │   ├── auth-shared.css         # Auth form styling
│   │   │   └── ...other.css
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx           # React Router config
│   │   └── main.jsx                    # App entry point
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/user/register` - Student registration
- `POST /api/auth/user/login` - Student login
- `POST /api/auth/food-partner/register` - Food partner registration
- `POST /api/auth/food-partner/login` - Food partner login
- `POST /api/auth/delivery-partner/register` - Delivery partner registration
- `POST /api/auth/delivery-partner/login` - Delivery partner login
- `GET /api/auth/me` - Get current user info

### Food Items
- `POST /api/food` - Create food item (food partner)
- `GET /api/food` - Get all food items (public)
- `PATCH /api/food/:id/like` - Like a food item
- `PATCH /api/food/:id/save` - Save a food item

### Orders
- `POST /api/orders` - Create order (student)
- `GET /api/orders/my` - Get user's orders (student)
- `GET /api/orders/partner` - Get food partner's orders
- `GET /api/orders/delivery` - Get delivery partner's orders
- `PATCH /api/orders/:id/status` - Update order status (food partner)
- `PATCH /api/orders/:id/delivery-status` - Update delivery status (delivery partner)
- `PATCH /api/orders/:id/cancel` - Cancel order (student)

---

## 💡 Key Features

### For Students
- Browse food reels (vertical scroll)
- Quick add-to-cart from feed
- Persistent cart (localStorage)
- Easy checkout with delivery info
- Real-time order tracking
- Cancel pending orders

### For Food Partners
- Upload food videos with prices
- Manage incoming orders
- Progress through order statuses
- Auto delivery partner assignment

### For Delivery Partners
- View available orders
- Accept deliveries
- Update delivery status
- Track multiple orders

---

## 🎨 Design System

### Colors
- **Primary**: Red (#d62424)
- **Background**: Light (#f5f1f1) / Dark (#0d0a0a)
- **Text**: Dark (#171212) / Light (in dark mode)

### Status Colors
- Pending: Orange (#f59e0b)
- Confirmed: Blue (#3b82f6)
- Preparing: Purple (#8b5cf6)
- Ready: Teal (#14b8a6)
- On-the-way: Red (#ef4444)
- Delivered: Green (#22c55e)

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure port 3000 is available
- Check `.env` file exists with all required variables

### Frontend won't build
- Run `npm install` to ensure dependencies
- Check Node.js version (18+)
- Clear `node_modules` and reinstall if needed

### Can't login/register
- Check MongoDB is running
- Verify JWT_SECRET is set in .env
- Check browser console for CORS errors

### Videos not uploading
- Verify ImageKit credentials in .env
- Check file size (max ~100MB)
- Ensure video format is supported (mp4, webm, mov)

---

## 📞 Support

For issues or feature requests, check the FEATURE_ROADMAP.md for planned enhancements.

---

**Happy Ordering! 🍕🍔🍜**
