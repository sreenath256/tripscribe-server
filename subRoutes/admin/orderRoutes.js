const express = require('express');
const router = express.Router();
const {getOrders, getOrderById, createOrder, updateOrder} = require('../../controllers/admin/orderController');

// All Order routes are Admin protected based on requirement "Entry making to the dashboard... by admin"
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder); // Admin entry
router.put('/:id', updateOrder); // Admin edit

module.exports = router;
