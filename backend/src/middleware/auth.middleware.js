const foodPartnerModel = require('../model/foodpartner.model')
const jwt = require("jsonwebtoken");

async function authfoodpartnermiddle(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message : "Please Login first"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner not found"
            })
        }
        req.foodPartner = foodPartner
        next()
    } catch (err) {
        return res.status(401).json({
            message : "Invalid token"
        })
    }
}

module.exports = {authfoodpartnermiddle}