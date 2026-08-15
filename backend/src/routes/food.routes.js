const express = require('express')
const router = express.Router()
const foodcontroller = require('../controller/food.controller')
const authmiddleware = require("../middleware/auth.middleware")
const multer = require('multer')

const upload = multer({
    storage : multer.memoryStorage(),
})

// partner protected routes
router.post('/', authmiddleware.authfoodpartnermiddle, upload.single("video"), foodcontroller.createfood)
router.get("/partner", authmiddleware.authfoodpartnermiddle, foodcontroller.getPartnerFoodItems)

// user protected routes
router.get("/" , authmiddleware.authUserMiddleware, foodcontroller.getfooditems)
router.post("/like", authmiddleware.authUserMiddleware, foodcontroller.toggleLike)
router.post("/save", authmiddleware.authUserMiddleware, foodcontroller.toggleSave)
router.get("/save", authmiddleware.authUserMiddleware, foodcontroller.getSavedFoods)

module.exports = router