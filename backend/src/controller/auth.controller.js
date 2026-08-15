const userModel = require('../model/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../model/foodpartner.model.js');

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const isUserExist = await userModel.findOne({
        email
    })
    if (isUserExist) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, email, password: hashedpassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
    })
    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    })
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    })
}

async function logoutUser(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function registerfoodpartner(req, res) {
    const { name, email, password, phone, address, contactname } = req.body
    const isAccoundAlreadyExist = await foodPartnerModel.findOne({
        email
    })
    if (isAccoundAlreadyExist) {
        return res.status(400).json({
            message: "Food Partner account already exists"
        })
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const foodPartner = await foodPartnerModel.create({
        name, email, password: hashedpassword, phone, address, contactname
    })
    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    })

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            phone : foodPartner.phone,
            address: foodPartner.address,
            contactname :foodPartner.contactname
        }
    })
}

async function loginfoodpartner(req, res) {
    const { email, password } = req.body

    const foodPartner = await foodPartnerModel.findOne({
        email
    })
    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Email or Passowrd"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET)
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    })

    res.status(200).json({
        message: "Food Partner Logged in successfully!",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            phone: foodPartner.phone,
            address: foodPartner.address,
            contactname: foodPartner.contactname
        }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "Food Partner logged out successfully"
    })
}

async function getMe(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(200).json({ loggedIn: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await userModel.findById(decoded.id).select("-password");
        if (user) {
            return res.status(200).json({ loggedIn: true, role: 'user', user });
        }
        let foodPartner = await foodPartnerModel.findById(decoded.id).select("-password");
        if (foodPartner) {
            return res.status(200).json({ loggedIn: true, role: 'food-partner', foodPartner });
        }
        return res.status(200).json({ loggedIn: false });
    } catch (err) {
        return res.status(200).json({ loggedIn: false });
    }
}

module.exports = { registerUser, loginUser, logoutUser, registerfoodpartner, loginfoodpartner, logoutFoodPartner, getMe }