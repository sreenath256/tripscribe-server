const express = require('express');
const router = express.Router();
const {
    createModel,
    getAllModels,
    getModelById,
    updateModel,
    deleteModel
} = require('../controllers/user/modelController');
const upload = require('../middlewares/upload');

// Routes for Model CRUD operations
router.post('/', upload.any(), createModel);       // Create new model
router.get('/', getAllModels);          // Get all models
router.get('/:id', getModelById);    // Get model by ID
router.put('/:id', upload.any(), updateModel);     // Update model by ID
router.delete('/:id', deleteModel);  // Delete model by ID

module.exports = router;
