// create server 
const express = require('express');
const cookieparser = require('cookie-parser')
const authroutes = require('./routes/auth.routes')
const app = express();
app.use(cookieparser());
app.use(express.json());

app.get('/' , (req,res) => {
    res.send("Hello USER")
})

app.use('/api/auth' , authroutes)

module.exports = app