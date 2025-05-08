const CrateReturn = require('../models/crateReturn');
const Sale = require('../models/sale');

exports.getSummary = async (req, res) => {
    try {
        const [sent, returned] = await Promise.all([
            Sale.aggregate([{ $group: { _id: null, total: { $sum: "$cratesSold" } } }]),
            CrateReturn.aggregate([{ $group: { _id: null, total: { $sum: "$cratesReturned" } } }])
        ]);

        const cratesSent = sent[0]?.total || 0;
        const cratesReturned = returned[0]?.total || 0;

        res.json({
            crateStats: {
                sent: cratesSent,
                returned: cratesReturned,
                outstanding: cratesSent - cratesReturned,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error generating summary', error: err.message });
    }
};
