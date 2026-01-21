// controllers/categoryController.js
const Category = require('../../models/categoryModel');


// Create new category
const createCategory = async (req, res) => {
    try {
        const { name, shortDescription } = req.body;

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove consecutive hyphens
        // Check if slug already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            throw new Error("A category with this name already exists")

        }

        // Check if image exists in request
        if (!req.file) {
            return res.status(400).json({ message: 'Category image is required' });
        }


        // Get the highest order value and add 1 for the new testimonial
        const lastCategory = await Category.findOne().sort({ order: -1 });
        const newOrder = lastCategory ? lastCategory.order + 1 : 1;

        // Create new category
        const newCategory = new Category({
            name,
            slug,
            shortDescription,
            image: req.file.path, // Cloudinary URL from the middleware
            order: newOrder
        });

        await newCategory.save();

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({ err: error, message: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, shortDescription, isActive, order } = req.body;

        // Generate slug from name if provided
        let slug;
        if (name) {
            slug = name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            // Check if updated slug already exists for different category
            const existingCategory = await Category.findOne({
                slug,
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(400).json({ message: 'A category with this name already exists' });
            }
        }

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;
        if (shortDescription) updateData.shortDescription = shortDescription;
        if (isActive !== undefined) updateData.isActive = isActive === 'true';
        if (order !== undefined) updateData.order = parseInt(order) || 0;

        // Update image if a new file was uploaded
        if (req.file) {
            updateData.image = req.file.path;

            // Delete old image from Cloudinary
            if (category.image) {
                // Extract public_id from the Cloudinary URL
                const publicId = category.image.split('/').pop().split('.')[0];
                // try {
                //     await cloudinary.uploader.destroy('uploads/' + publicId);
                // } catch (error) {
                //     console.error('Failed to delete old image:', error);
                // }
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/// Function to update category order (for drag-and-drop functionality)
const updateCategoryOrder = async (req, res) => {
    const { categoryIds } = req.body;
    if (!categoryIds || !Array.isArray(categoryIds)) {
        return res.status(400).json({ error: 'Invalid input: CategoryIds must be an array' });
    }

    try {
        // Step 1: First set all orders to negative values to avoid conflicts
        // Since these are temporary values, we'll use the index position but negative
        // This ensures no conflicts with the positive values we'll set later
        for (let i = 0; i < categoryIds.length; i++) {
            await Category.findByIdAndUpdate(
                categoryIds[i],
                { order: -1000 - i }, // Using negative values far from our normal range
                { runValidators: false } // Bypass validators if they exist
            );
        }

        // Step 2: Now set them to their actual order values
        for (let i = 0; i < categoryIds.length; i++) {
            await Category.findByIdAndUpdate(
                categoryIds[i],
                { order: i + 1 },
                { runValidators: false }
            );
        }

        return res.status(200).json({ success: 'Order updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: String(error) });
    }
};


// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete image from Cloudinary
        if (category.image) {
            // Extract public_id from the Cloudinary URL
            const publicId = category.image.split('/').pop().split('.')[0];
            // try {
            //     await cloudinary.uploader.destroy('uploads/' + publicId);
            // } catch (error) {
            //     console.error('Failed to delete image:', error);
            // }
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all categories
const getAllCategoryNames = async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, createdAt: -1 }).select('name slug');
        res.status(200).json(categories);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    deleteCategory,
    updateCategory,
    getCategoryById,
    createCategory,
    getAllCategories,
    getAllCategoryNames,
    updateCategoryOrder
};