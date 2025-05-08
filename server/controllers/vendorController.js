const Vendor = require('../models/vendor'); 

// GET all vendors
exports.getVendors = async (req, res) => {
    const vendors = await Vendor.find();
    res.json(vendors);
};

// CREATE vendor
exports.addVendor = async (req, res) => {
    try {
        const vendor = new Vendor(req.body);
        const savedVendor = await vendor.save();
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE vendor
exports.updateVendor = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE vendor
exports.deleteVendor = async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vendor deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
