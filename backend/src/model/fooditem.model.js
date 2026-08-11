const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    video : {
        type : String,
        required : true,
    },
    description : {
        type : String
    },
    foodpartner : {
        type : mongoose.Schema.ObjectId,
        ref :  "foodPartner", 
    }
} , {timestamps : true})

const foodModel = mongoose.model("food" , foodSchema)