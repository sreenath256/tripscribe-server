const express = require("express");
const upload = require("../middlewares/upload");
const { getUserDataFirst } = require("../controllers/user/userController");
const categoryRoutes = require("../subRoutes/categoryRoutes");
const modelRoutes = require("../subRoutes/modelRoutes");

const { getAllCategoryNames } = require("../controllers/user/categoryController");

const router = express.Router();

// Get user data first
router.get("/", getUserDataFirst)


// 
router.use("/category", categoryRoutes)
router.use("/model",modelRoutes)

router.get('/category-names',  getAllCategoryNames);



module.exports = router;
