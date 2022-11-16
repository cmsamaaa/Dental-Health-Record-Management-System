const express = require('express');

const frontendController = require('../controllers/frontendController');

const router = express.Router();

router.get('/', frontendController.viewIndex);
router.get('/index', frontendController.viewIndex);

module.exports = router;