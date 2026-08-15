const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    contactname : {
        type :String ,
        requied : true ,
    },
    phone : {
        type :String ,
        requied : true , 
    },
    address : {
        type :String ,
        requied : true ,
    },
    email : {
        type : String ,
        required : true ,
        unique : true 
    },
    password : {
        type : String ,
        required : true
    }
} , {timestamps : true})

const foodPartnerModel = mongoose.model("foodPartner" , foodPartnerSchema);

module.exports = foodPartnerModel;