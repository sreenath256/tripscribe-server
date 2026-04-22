

const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload.js');
const {getBlogs, getBlog, deleteBlog, updateBlog, addBlog} = require('../../controllers/admin/blogController.js');



// Blogs Routes
router.get("/", getBlogs);
router.get("/:id", getBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", upload.any(), updateBlog);
router.post("/", upload.single('primaryImage'), addBlog);


module.exports = router;
