const express = require('express');
const router = express.Router();
const controller = require('../controllers/saleController');

router.get('/', controller.getSales);
router.post('/', controller.createSale);
router.put('/:id', controller.updateSale);
router.delete('/:id', controller.deleteSale);
router.put('/:id/payment', controller.recordPayment);

module.exports = router;
