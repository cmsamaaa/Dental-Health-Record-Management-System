const express = require('express');

const routeController = require('../controllers/getRouteController');

const router = express.Router();

router.get('/', routeController.viewIndex);
router.get('/home', routeController.viewIndex);
router.get('/index', routeController.viewIndex);
router.get('/login', routeController.viewLogin);
router.get('/register', routeController.viewRegister);
router.get('/forgot-password', routeController.viewForgotPassword);
router.get('/invoice', routeController.viewInvoice);
router.get('/invoice-print', routeController.viewInvoicePrint);

module.exports = router;