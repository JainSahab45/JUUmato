const express = require('express')
const router = express.Router()
const foodcontroller = require('../controller/food.controller')
const authmiddleware = require("../middleware/auth.middleware")
const multer = require('multer')

const upload = multer({
    storage : multer.memoryStorage(),
})

// protected 
router.post('/', authmiddleware.authfoodpartnermiddle , upload.single("video") ,foodcontroller.createfood)

module.exports = router