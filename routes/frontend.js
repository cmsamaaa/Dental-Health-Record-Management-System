const express = require('express');

const defaultController = require('../controllers/defaultController');
const appointmentController = require('../controllers/appointmentController');
const billController = require('../controllers/billController');
const clinicInfoController = require('../controllers/clinicInfoController');
const inventoryController = require('../controllers/inventoryController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');

const routeAuth = require('../middleware/route-auth');
const routeRedir = require('../middleware/route-redir');

const router = express.Router();

// Non-protected routes
router.get('/login', patientController.viewLogin);
router.get('/staff/login', staffController.viewLogin);
router.get('/forgot-password', defaultController.viewForgotPassword);

// Protected routes
router.get('/', routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/home', routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/index', routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/invoice', routeAuth.isAuth, billController.viewInvoice);
router.get('/invoice-print', routeAuth.isAuth, billController.viewInvoicePrint);

/* Start of Admin Route */

// Clinic Info
router.get('/admin/clinic/add-information', routeAuth.isAuth, routeAuth.isAdmin, clinicInfoController.viewAddClinicInfo);
router.get('/admin/clinic/view-all', routeAuth.isAuth, routeAuth.isAdmin, clinicInfoController.viewClinicInfo);

// Staff
router.get('/admin/staff/create', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewCreateStaff);
router.get('/admin/staff/edit/:userId', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewEditStaff);
router.get('/admin/staff/view-all', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewStaffs);
router.get('/admin/staff/view/:userId', routeAuth.isAuth, routeAuth.isAdmin, staffController.viewStaff);

// Patient
router.get('/admin/patient/create', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewCreatePatient);
router.get('/admin/patient/edit/:userId', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewEditPatient);
router.get('/admin/patient/view-all', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewPatients);
router.get('/admin/patient/view/:userId', routeAuth.isAuth, routeAuth.isAdmin, patientController.viewPatient);

// Appointment
router.get('/admin/appointment/create', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewCreateAppointment);
router.get('/admin/appointment/edit/:apptId', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewEditAppointment);
router.get('/admin/appointment/view-all', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewAppointments);
router.get('/admin/appointment/view/:apptId', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewAppointment);

// Inventory
router.get('/admin/inventory/view-all', routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewInventory);
router.get('/admin/inventory/add-inventory', routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewCreateInventory);

// Bill
router.get('/admin/bill/view-all', routeAuth.isAuth, routeAuth.isAdmin, billController.viewBills_Admin);

/* End of Admin Route */


/* Start of Patient Route */

// Appointment
router.get('/patient/appointment/create', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewCreateAppointment);
router.get('/patient/appointment/edit/:apptId', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewEditAppointment);
router.get('/patient/appointment/view-all', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewAppointments);
router.get('/patient/appointment/view/:apptId', routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewAppointment);

// Bill
router.get('/patient/bill/view-all', routeAuth.isAuth, routeAuth.isPatient, billController.viewBills_Patient);

/* End of Patient Route */

/* Start of Dentist Route */

// Appointment
router.get('/dentist/appointment/view-all', routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewAppointments);
router.get('/dentist/appointment/view/:apptId', routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewAppointment);

/* End of Dentist Route */

module.exports = router;