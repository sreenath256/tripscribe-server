const express = require('express');
const router = express.Router();
const { createStay, updateStay, deleteStay, getAllStays, getStayById } = require('../../controllers/admin/stayController');
const upload = require('../../middlewares/upload');


// Admin Routes
router.post('/', upload.any(), createStay);
router.get('/:id', getStayById)
router.get('/', getAllStays);
router.put('/:id', upload.any(), updateStay);
router.delete('/:id', deleteStay);

module.exports = router;
