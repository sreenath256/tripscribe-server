const express = require('express');
const router = express.Router();

const {createPackage, updatePackage, deletePackage} = require('../../controllers/admin/packageController');



// Admin Routes
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
