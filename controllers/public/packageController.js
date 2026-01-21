const Package = require('../../models/packageModel');


// Get All Packages (Public) - Filter & Pagination
exports.getPackages = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, scope, name } = req.query;

        const query = {};
        if (type) query.type = type;
        if (scope) query.scope = scope;
        if (name) query.name = { $regex: name, $options: 'i' };

        // Admin might want to see disabled ones, but public users shouldn't? 
        // Assuming public usage for now, maybe add a query param for includeDisabled if admin
        // query.isDisable = { $ne: true }; // Uncomment if you want to hide disabled by default

        const packages = await Package.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Package.countDocuments(query);

        res.status(200).json({
            packages,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Package (Public)
exports.getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ message: "Package not found" });
        res.status(200).json(pkg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
