const Stay = require('../../models/stayModel');


// Get All Stays (Public) - Filter & Pagination
exports.getStays = async (req, res) => {
    try {
        const { page = 1, limit = 10, district, maxGuests, minPrice, maxPrice } = req.query;

        const query = {};
        if (district) query.district = { $regex: district, $options: 'i' };
        if (maxGuests) query.maxGuests = { $gte: maxGuests };
        // Assuming sellingPrice is what users filter by
        if (minPrice || maxPrice) {
            query.sellingPrice = {};
            if (minPrice) query.sellingPrice.$gte = minPrice;
            if (maxPrice) query.sellingPrice.$lte = maxPrice;
        }

        const stays = await Stay.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Stay.countDocuments(query);

        res.status(200).json({
            stays,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Stay (Public)
exports.getStayById = async (req, res) => {
    try {
        const stay = await Stay.findById(req.params.id);
        if (!stay) return res.status(404).json({ message: "Stay not found" });
        res.status(200).json(stay);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
