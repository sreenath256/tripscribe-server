const express = require('express');
const router = express.Router();

const {getPackages, getPackageById} = require('../../controllers/public/packageController');



// Public Routes
router.get('/', getPackages);
router.get('/:id', getPackageById);

module.exports = router;
