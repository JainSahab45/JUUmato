const foodModel = require("../model/fooditem.model")

async function createfood(req,res) {
    console.log(req.foodPartner);
    console.log(req.body);
    console.log(req.file);
    
    res.send("Food created")
}

module.exports = { createfood }