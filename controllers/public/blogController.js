const Blog = require("../../models/blogModel");
const mongoose = require("mongoose");

// ✅ controllers/blogController.js
const getBlogs = async (req, res) => {
    try {
        const {
            search,
            category,
            page = 1,      // ✅ Default to page 1
            limit = 10     // ✅ Default to 10 blogs per page
        } = req.query;

        const filter = {
            isActive: true, // only active blogs
        };

        if (search) {
            filter.name = { $regex: new RegExp(search, "i") };
        }

        // Filter by category (case-insensitive)
        if (category && category !== 'all') {
            filter.categories = { $in: [new RegExp(category, "i")] };
        }

        // ✅ Convert page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        
        // ✅ Calculate how many documents to skip
        const skip = (pageNumber - 1) * limitNumber;

        // ✅ Fetch the paginated blogs
        const blogs = await Blog.find(filter, {
            verticalImages: 0,
            horizontalImages: 0,
            content: 0,
        })
        .sort({ createdAt: -1 })  // Sort by latest first
        .skip(skip)               // 👈 Skip blogs from previous pages
        .limit(limitNumber);      // 👈 Limit the number of blogs returned

        // ✅ Get the total count for frontend pagination UI
        const totalBlogs = await Blog.countDocuments(filter);

        res.status(200).json({ 
            blogs,
            // ✅ Send pagination metadata back to the frontend
            pagination: {
                totalBlogs,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalBlogs / limitNumber),
                hasNextPage: pageNumber * limitNumber < totalBlogs,
                hasPrevPage: pageNumber > 1
            }
        });
    } catch (error) {
        console.log("Error", error);
        res.status(400).json({ error: error.message });
    }
};


// Get single Blog
const getBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //   throw Error("Invalid ID!!!");
        // }

        console.log("ID", id);

        const blog = await Blog.findOne({ slug: id });
        console.log("Blog", blog);

        if (!blog) {
            throw Error("No Such Blog");
        }

        res.status(200).json({ blog });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    getBlogs,
    getBlog,

};
