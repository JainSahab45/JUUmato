// create server 
const express = require('express');
const cookieparser = require('cookie-parser')
const authroutes = require('./routes/auth.routes')
const foodroutes = require('./routes/food.routes')
const orderRoutes = require('./routes/order.routes')
const app = express();
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.use(cookieparser());
app.use(express.json());

app.get('/' , (req,res) => {
    res.send("Hello USER")
})

app.use('/api/auth' , authroutes)
app.use('/api/food' , foodroutes)
app.use('/api/orders', orderRoutes)

module.exports = app