const Sale = require('../models/sale');

// GET all sales
exports.getSales = async (req, res) => {
    const sales = await Sale.find().populate('vendorId');
    res.json(sales);
};

// POST new sale
exports.createSale = async (req, res) => {
    try {
        const sale = new Sale(req.body);
        const saved = await sale.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update sale
exports.updateSale = async (req, res) => {
    try {
        const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE sale
exports.deleteSale = async (req, res) => {
    try {
        await Sale.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sale deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT payment
exports.recordPayment = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        const amount = Number(req.body.amount);
        sale.amountPaid += amount;
        sale.balance -= amount;
        sale.status = sale.balance <= 0 ? 'paid' : (sale.amountPaid > 0 ? 'partial' : 'unpaid');

        const updated = await sale.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
