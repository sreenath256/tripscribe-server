const express = require('express');
const router = express.Router();
const {createStay, updateStay, deleteStay} = require('../../controllers/admin/stayController');


// Admin Routes
router.post('/', createStay);
router.put('/:id', updateStay);
router.delete('/:id', deleteStay);

module.exports = router;
