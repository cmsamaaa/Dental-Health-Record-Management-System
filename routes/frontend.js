const express = require('express');

const routeController = require('../route-controllers/routeController');
const adminRouteController = require('../route-controllers/routeController-admin');
const patientRouteController = require('../route-controllers/routeController-patient');
const dentistRouteController = require('../route-controllers/routeController-dentist');
const routeAuth = require('../middleware/route-auth');
const routeRedir = require('../middleware/route-redir');

const router = express.Router();

// Non-protected routes
router.get('/login', routeController.viewPatientLogin);
router.get('/staff/login', routeController.viewStaffLogin);
router.get('/register', routeController.viewRegister);
router.get('/forgot-password', routeController.viewForgotPassword);

// Protected routes
router.get('/', routeAuth.isAuth, routeRedir.defaultPage, routeController.viewIndex);
router.get('/home', routeAuth.isAuth, routeRedir.defaultPage, routeController.viewIndex);
router.get('/index', routeAuth.isAuth, routeRedir.defaultPage, routeController.viewIndex);
router.get('/invoice', routeAuth.isAuth, routeController.viewInvoice);
router.get('/invoice-print', routeAuth.isAuth, routeController.viewInvoicePrint);

// Admin Route
router.get('/admin/clinic/add-information', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.addClinicInfo);
router.get('/admin/clinic/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewClinicInfo);
router.get('/admin/staff/create', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.createStaff);
router.get('/admin/staff/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewStaffs);
router.get('/admin/patient/create', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.createPatient);
router.get('/admin/patient/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewPatients);
router.get('/admin/appointment/create', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.createAppointment);
router.get('/admin/appointment/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewAppointments);
router.get('/admin/inventory/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewInventory);
router.get('/admin/inventory/new-record', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.createInventory);
router.get('/admin/bill/view-all', routeAuth.isAuth, routeAuth.isAdmin, adminRouteController.viewBills);

// Patient Route
router.get('/patient/appointment/create', routeAuth.isAuth, routeAuth.isPatient, patientRouteController.createAppointment);
router.get('/patient/appointment/view-all', routeAuth.isAuth, routeAuth.isPatient, patientRouteController.viewAppointments);
router.get('/patient/bill/view-all', routeAuth.isAuth, routeAuth.isPatient, patientRouteController.viewBills);

// Dentist Route
router.get('/dentist/appointment/view-all', routeAuth.isAuth, routeAuth.isDentist, dentistRouteController.viewAppointments);

module.exports = router;