const express = require('express');

const routeController = require('../controllers/getRouteController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Non-protected routes
router.get('/login', routeController.viewLogin);
router.get('/register', routeController.viewRegister);
router.get('/forgot-password', routeController.viewForgotPassword);

// Protected routes
router.get('/', isAuth, routeController.viewIndex);
router.get('/home', isAuth, routeController.viewIndex);
router.get('/index', isAuth, routeController.viewIndex);
router.get('/invoice', isAuth, routeController.viewInvoice);
router.get('/invoice-print', isAuth, routeController.viewInvoicePrint);

module.exports = router;