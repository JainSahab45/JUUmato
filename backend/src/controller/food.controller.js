const foodModel = require("../model/fooditem.model")
const storageService = require("../services/storage.service")
const { v4: uuid } = require("uuid")

function serializeFoodItem(item, userId = null) {
    const base = item.toObject ? item.toObject() : item;

    return {
        ...base,
        foodPartner: base.foodPartner && typeof base.foodPartner === 'object'
            ? base.foodPartner._id || base.foodPartner
            : base.foodPartner,
        likeCount: Array.isArray(base.likes) ? base.likes.length : 0,
        savesCount: Array.isArray(base.savedBy) ? base.savedBy.length : 0,
        commentsCount: Array.isArray(base.comments) ? base.comments.length : 0,
        isLiked: Boolean(userId && Array.isArray(base.likes) && base.likes.some((id) => id && id.toString() === userId.toString())),
        isSaved: Boolean(userId && Array.isArray(base.savedBy) && base.savedBy.some((id) => id && id.toString() === userId.toString())),
    };
}

async function createfood(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
    }

    try {
        const fileuploadresult = await storageService.uploadfile(req.file.buffer, uuid())

        const fooditem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price || 120,
            video: fileuploadresult.url,
            foodPartner: req.foodPartner._id
        })

        const populatedFood = await foodModel.findById(fooditem._id).populate("foodPartner", "name address email phone contactname")

        return res.status(201).json({
            message: "Food Added Successfully",
            food: serializeFoodItem(populatedFood, req.foodPartner?._id)
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating food",
            error: error.message
        })
    }
}

async function getfooditems(req, res) {
    try {
        const fooditems = await foodModel.find({}).populate("foodPartner", "name address email phone contactname")
        const mapped = fooditems.map((item) => serializeFoodItem(item, req.user?._id))

        res.status(200).json({
            message: "Food item fetched :)",
            foodItems: mapped
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching food items",
            error: error.message
        })
    }
}

async function getPartnerFoodItems(req, res) {
    try {
        const fooditems = await foodModel.find({ foodPartner: req.foodPartner._id }).populate("foodPartner", "name address email phone contactname")
        res.status(200).json({
            message: "Partner food items fetched",
            foodItems: fooditems.map((item) => serializeFoodItem(item, req.foodPartner?._id))
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching partner food items",
            error: error.message
        });
    }
}

async function toggleLike(req, res) {
    const { foodId } = req.body;

    if (!foodId) {
        return res.status(400).json({ message: "foodId is required" });
    }

    try {
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const alreadyLiked = food.likes.some((id) => id.toString() === req.user._id.toString());

        if (alreadyLiked) {
            food.likes = food.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            food.likes.push(req.user._id);
        }

        await food.save();

        const liked = !alreadyLiked;

        return res.status(200).json({
            message: liked ? "Food liked" : "Food like removed",
            like: liked,
            likeCount: food.likes.length,
            isLiked: liked
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating like",
            error: error.message
        });
    }
}

async function toggleSave(req, res) {
    const { foodId } = req.body;

    if (!foodId) {
        return res.status(400).json({ message: "foodId is required" });
    }

    try {
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const alreadySaved = food.savedBy.some((id) => id.toString() === req.user._id.toString());

        if (alreadySaved) {
            food.savedBy = food.savedBy.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            food.savedBy.push(req.user._id);
        }

        await food.save();

        const saved = !alreadySaved;

        return res.status(200).json({
            message: saved ? "Food saved" : "Food removed from saved list",
            save: saved,
            savesCount: food.savedBy.length,
            isSaved: saved
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating save",
            error: error.message
        });
    }
}

async function getSavedFoods(req, res) {
    try {
        const savedFoods = await foodModel.find({ savedBy: req.user._id }).populate("foodPartner", "name address email phone contactname")

        res.status(200).json({
            message: "Saved food items fetched",
            savedFoods: savedFoods.map((item) => serializeFoodItem(item, req.user._id))
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching saved food items",
            error: error.message
        })
    }
}

module.exports = { createfood, getfooditems, getPartnerFoodItems, toggleLike, toggleSave, getSavedFoods }