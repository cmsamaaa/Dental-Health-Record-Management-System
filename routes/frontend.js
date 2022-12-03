const express = require('express');

const routeController = require('../route-controllers/routeController');
const adminRouteController = require('../route-controllers/routeController-admin');
const patientRouteController = require('../route-controllers/routeController-patient');
const dentistRouteController = require('../route-controllers/routeController-dentist');
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

// Admin Route
router.get('/admin/patient/view-all', isAuth, adminRouteController.viewPatients);
router.get('/admin/patient/create', isAuth, adminRouteController.createPatient);
router.get('/admin/appointment/create', isAuth, adminRouteController.createAppointment);
router.get('/admin/appointment/view-all', isAuth, adminRouteController.viewAppointments);
router.get('/admin/inventory/view-all', isAuth, adminRouteController.viewInventory);
router.get('/admin/inventory/new-record', isAuth, adminRouteController.createInventory);
router.get('/admin/bill/view-all', isAuth, adminRouteController.viewBills);

// Patient Route
router.get('/patient/appointment/create', isAuth, patientRouteController.createAppointment);
router.get('/patient/appointment/view-all', isAuth, patientRouteController.viewAppointments);
router.get('/patient/bill/view-all', isAuth, patientRouteController.viewBills);

// Dentist Route
router.get('/dentist/appointment/view-all', isAuth, dentistRouteController.viewAppointments);

module.exports = router;