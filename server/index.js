const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const saleRoutes = require('./routes/saleRoutes');
const crateReturnRoutes = require('./routes/crateReturnRoutes');
const reportRoutes = require('./routes/reportRoute');

const vendorRoutes = require('./routes/vendorRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/vendors', vendorRoutes);
app.use('/api/sales', saleRoutes);

app.use('/api/crate-returns', crateReturnRoutes);
app.use('/api/reports', reportRoutes);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error(err));
