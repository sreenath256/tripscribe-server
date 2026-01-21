const Order = require('../../models/orderModel');

// Create Order (Admin Entry)
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Order (Admin)
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Orders (Admin) - Filter & Pagination
exports.getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, customerName, type } = req.query;

        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (customerName) query.customerName = { $regex: customerName, $options: 'i' };

        const orders = await Order.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
