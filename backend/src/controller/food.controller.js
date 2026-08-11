const foodModel = require("../model/fooditem.model")
const userModel = require("../model/user.model")
const storageService = require("../services/storage.service")
const { v4: uuid } = require("uuid")
async function createfood(req, res) {
    console.log(req.foodPartner);
    console.log(req.body);
    console.log(req.file);

    const fileuploadresult = await storageService.uploadfile(req.file.buffer, uuid())

    const fooditem = await foodModel.create({
        name : req.body.name,
        description : req.body.description,
        video : fileuploadresult.url,
        foodPartner : req.foodPartner._id
    })
    
    res.status(201).json({
        message : "Food Added Successfully",
        food : fooditem
    })
}

async function getfooditems(req,res) {
    const fooditem = await foodModel.find({})
    res.status(200).json({
        message : "Food item fetched :)",
        fooditem
    })
    
}

module.exports = { createfood , getfooditems}