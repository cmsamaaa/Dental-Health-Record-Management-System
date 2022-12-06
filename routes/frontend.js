const express = require('express');

const appointmentController = require('../controllers/appointmentController');
const billController = require('../controllers/billController');
const clinicInfoController = require('../controllers/clinicInfoController');
const inventoryController = require('../controllers/inventoryController');
const staffController = require('../controllers/staffController');
const patientController = require('../controllers/patientController');

const routeController = require('../route-controllers/routeController');
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
router.get('/admin/clinic/add-information', routeAuth.isAuth, routeAuth.isAdmin, clinicInfoController.viewAddClinicInfo);
router.get('/admin/clinic/view-all', routeAuth.isAuth, routeAuth.isAdmin, clinicInfoController.viewClinicInfo);
router.get('/admin/staff/create', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewCreateStaff);
router.get('/admin/staff/view-all', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewStaffs);
router.get('/admin/patient/create', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewCreatePatient);
router.get('/admin/patient/view-all', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewPatients);
router.get('/admin/appointment/create', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewCreateAppointment_Admin);
router.get('/admin/appointment/view-all', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewAppointments_Admin);
router.get('/admin/inventory/view-all', routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewInventory);
router.get('/admin/inventory/new-record', routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewCreateInventory);
router.get('/admin/bill/view-all', routeAuth.isAuth, routeAuth.isAdmin, billController.viewBills_Admin);

// Patient Route
router.get('/patient/appointment/create', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewCreateAppointment_Patient);
router.get('/patient/appointment/view-all', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewAppointments_Patient);
router.get('/patient/bill/view-all', routeAuth.isAuth, routeAuth.isPatient, billController.viewBills_Patient);

// Dentist Route
router.get('/dentist/appointment/view-all', routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewAppointments_Dentist);

module.exports = router;