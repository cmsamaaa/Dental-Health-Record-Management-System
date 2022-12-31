const express = require('express');

const defaultController = require('../controllers/defaultController');
const appointmentController = require('../controllers/appointmentController');
const billController = require('../controllers/billController');
const clinicController = require('../controllers/clinicController');
const inventoryController = require('../controllers/inventoryController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');
const clinicTreatmentController = require('../controllers/clinicTreatmentController');

const routeAuth = require('../middleware/route-auth');
const routeRedir = require('../middleware/route-redir');

const router = express.Router();

// Non-protected routes
router.get('/login', patientController.viewLogin);
router.get('/staff/login', staffController.viewLogin);
router.get('/forgot-password', defaultController.viewForgotPassword);
router.get('/clinic/search', routeAuth.setSession, clinicController.findClinicsByPostal);
router.get('/clinic/view/:clinicId', routeAuth.setSession, clinicController.viewClinicInfo);

// Protected routes
router.get('/', routeAuth.setSession, routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/home', routeAuth.setSession, routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/index', routeAuth.setSession, routeAuth.isAuth, routeRedir.defaultPage, defaultController.viewIndex);
router.get('/invoice', routeAuth.setSession, routeAuth.isAuth, billController.viewInvoice);
router.get('/invoice-print', routeAuth.setSession, routeAuth.isAuth, billController.viewInvoicePrint);

/* Start of Admin Route */

// Clinic Info
// router.get('/admin/clinic/add-information', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.viewAddClinicInfo);
router.get('/admin/clinic', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.viewClinicInfo);
router.get('/admin/clinic/edit/:clinicId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.viewEditClinicInfo);

// Staff
router.get('/admin/staff/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.viewCreateStaff);
router.get('/admin/staff/edit/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.viewEditStaff);
router.get('/admin/staff/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.viewStaffs);
router.get('/admin/staff/view/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.viewStaff);

// Patient
router.get('/admin/patient/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.viewCreatePatient);
router.get('/admin/patient/edit/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.viewEditPatient);
router.get('/admin/patient/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.viewPatients);
router.get('/admin/patient/view/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.viewPatient);

// Appointment
router.get('/admin/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewCreateAppointment);
router.get('/admin/appointment/edit/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewEditAppointment);
router.get('/admin/appointment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewAppointments);
router.get('/admin/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewAppointment);

// Treatment
router.get('/admin/treatment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.viewCreateTreatment);
router.get('/admin/treatment/edit/:ctId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.viewEditTreatment);
router.get('/admin/treatment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.viewTreatments);
router.get('/admin/treatment/view/:ctId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.viewTreatment);

// Inventory
router.get('/admin/inventory/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewCreateInventory);
router.get('/admin/inventory/edit/:inventoryId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewEditInventory);
router.get('/admin/inventory/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewInventories);
router.get('/admin/inventory/view/:inventoryId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.viewInventory);

// Bill
router.get('/admin/bill/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.viewBills_Admin);

/* End of Admin Route */


/* Start of Patient Route */

// Appointment
router.get('/patient/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewCreateAppointment);
router.get('/patient/appointment/edit/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewEditAppointment);
router.get('/patient/appointment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewAppointments);
router.get('/patient/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewAppointment);

// Bill
router.get('/patient/bill/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, billController.viewBills_Patient);

/* End of Patient Route */

/* Start of Dentist Route */

// Appointment
router.get('/dentist/clinic', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicController.viewClinicInfo);
router.get('/dentist/appointment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewAppointments);
router.get('/dentist/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewAppointment);

/* End of Dentist Route */

module.exports = router;