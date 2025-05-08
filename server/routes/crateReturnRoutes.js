const express = require('express');
const router = express.Router();
const controller = require('../controllers/crateReturnController');

router.get('/', controller.getReturns);
router.post('/', controller.createReturn);
router.delete('/:id', controller.deleteReturn);

module.exports = router;
