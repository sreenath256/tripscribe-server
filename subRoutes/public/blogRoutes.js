const express = require('express');
const router = express.Router();

const { getBlogs, getBlog } = require('../../controllers/public/blogController');



// Public Routes
router.get('/', getBlogs);
router.get('/:id', getBlog);

module.exports = router;
