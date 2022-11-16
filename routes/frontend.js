const express = require('express');

const frontendController = require('../controllers/frontendController');

const router = express.Router();

router.get('/', frontendController.viewIndex);
router.get('/home', frontendController.viewIndex);
router.get('/index', frontendController.viewIndex);
router.get('/login', frontendController.viewLogin);
router.get('/register', frontendController.viewRegister);
router.get('/forgot-password', frontendController.viewForgotPassword);
router.get('/invoice', frontendController.viewInvoice);
router.get('/invoice-print', frontendController.viewInvoicePrint);

module.exports = router;