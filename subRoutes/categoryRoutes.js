const express = require("express");
const upload = require("../middlewares/upload");
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, updateCategoryOrder, getAllCategoryNames } = require("../controllers/user/categoryController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new category - protected route with image upload
router.post('/', requireAuth, upload.single('image'), createCategory);

// Get all categories - public route
router.get('/', getAllCategories);

// Get category by ID - public route
router.get('/:id', getCategoryById);

// Update category - protected route with image upload
router.put('/:id', requireAuth, upload.single('image'), updateCategory);

// Delete category - protected route
router.delete('/:id', requireAuth, deleteCategory);

// Delete category - protected route
router.post('/order', requireAuth, updateCategoryOrder);

module.exports = router;
