const Stay = require('../../models/stayModel');

// Create Stay (Admin)
exports.createStay = async (req, res) => {
    try {
        const newStay = new Stay(req.body);
        const savedStay = await newStay.save();
        res.status(201).json(savedStay);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Stay (Admin)
exports.updateStay = async (req, res) => {
    try {
        const updatedStay = await Stay.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedStay) return res.status(404).json({ message: "Stay not found" });
        res.status(200).json(updatedStay);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Stay (Admin)
exports.deleteStay = async (req, res) => {
    try {
        const deletedStay = await Stay.findByIdAndDelete(req.params.id);
        if (!deletedStay) return res.status(404).json({ message: "Stay not found" });
        res.status(200).json({ message: "Stay deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
