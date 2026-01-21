const express = require('express');
const router = express.Router();
const { getStayById, getStays } = require('../../controllers/public/stayController');


// Public Routes
router.get('/', getStays);
router.get('/:id', getStayById);


module.exports = router;
