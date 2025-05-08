const CrateReturn = require('../models/crateReturn');

// Get all returns
exports.getReturns = async (req, res) => {
    try {
        const returns = await CrateReturn.find().sort({ date: -1 });
        res.json(returns);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching crate returns', error: err.message });
    }
};

// Create return
exports.createReturn = async (req, res) => {
    try {
        const newReturn = new CrateReturn(req.body);
        const saved = await newReturn.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Failed to record return', error: err.message });
    }
};

// Delete return
exports.deleteReturn = async (req, res) => {
    try {
        await CrateReturn.findByIdAndDelete(req.params.id);
        res.json({ message: 'Crate return deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to delete', error: err.message });
    }
};
