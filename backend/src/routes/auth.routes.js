const express = require('express');
const authcontroller = require("../controller/auth.controller")
const router = express.Router();

//user auth api
router.post("/user/register" , authcontroller.registerUser)
router.post("/user/login" , authcontroller.loginUser)
router.get("/user/logout" , authcontroller.logoutUser)

// unified auth check
router.get("/me", authcontroller.getMe)

// food partner auth apis
router.get("/food-partner/logout" , authcontroller.logoutFoodPartner)
router.post("/food-partner/register" , authcontroller.registerfoodpartner)
router.post("/food-partner/login" , authcontroller.loginfoodpartner)

// delivery partner auth apis
router.get("/delivery-partner/logout", authcontroller.logoutDeliveryPartner)
router.post("/delivery-partner/register", authcontroller.registerDeliveryPartner)
router.post("/delivery-partner/login", authcontroller.loginDeliveryPartner)

module.exports = router ;