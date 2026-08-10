const express = require('express');
const authcontroller = require("../controller/auth.controller")
const router = express.Router();

router.post("/user/register" , authcontroller.registerUser)
router.post("/user/login" , authcontroller.loginUser)

module.exports = router ;