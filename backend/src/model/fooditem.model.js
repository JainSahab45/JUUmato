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
    foodPartner : {
        type : mongoose.Schema.ObjectId,
        ref : "foodPartner",
    },
    likes : [{
        type : mongoose.Schema.ObjectId,
        ref : "user",
    }],
    savedBy : [{
        type : mongoose.Schema.ObjectId,
        ref : "user",
    }],
    comments : [{
        type : String,
    }]
} , {timestamps : true})

const foodModel = mongoose.model("food" , foodSchema)

module.exports = foodModel;