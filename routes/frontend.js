const express = require('express');

const defaultController = require('../controllers/defaultController');
const appointmentController = require('../controllers/appointmentController');
const billController = require('../controllers/billController');
const clinicController = require('../controllers/clinicController');
const inventoryController = require('../controllers/inventoryController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');
const clinicTreatmentController = require('../controllers/clinicTreatmentController');
const oralRecordController = require('../controllers/oralRecordController');
const queueController = require('../controllers/queueController');
const reviewController = require('../controllers/reviewController');
const usedMaterialController = require('../controllers/usedMaterialController');

const routeAuth = require('../middleware/route-auth');
const statusMiddleware = require('../middleware/statusMiddleware');

const router = express.Router();

// Non-protected routes
router.get('/', defaultController.viewIndex);
router.get('/home', defaultController.viewIndex);
router.get('/index', defaultController.viewIndex);
router.get('/login', patientController.viewLogin);
router.get('/register', patientController.viewRegister);
router.get('/register-clinic', clinicController.viewRegister);
router.get('/staff/login', staffController.viewLogin);
router.get('/forgot-password', userController.viewForgotPassword);
router.get('/faq', userController.viewFAQ);
router.get('/staff/faq', userController.viewFAQ_Staff);
router.get('/clinic/search', routeAuth.setSession, clinicController.findClinicsByPostal);
router.get('/clinic/treatments/compare', routeAuth.setSession, clinicTreatmentController.viewCompareTreatments);
router.get('/clinic/view/:clinicId', routeAuth.setSession, clinicController.viewClinicInfo);
router.get('/clinic/view-all', routeAuth.setSession, clinicController.viewClinics);
router.get('/review/view-all/:clinicId', routeAuth.setSession, reviewController.viewReviews);
router.get('/queue', routeAuth.setSession, statusMiddleware.updateMissedQueue, queueController.viewQueues);

// Protected routes

/* Start of Admin Route */

// Dashboard
router.get('/admin/dashboard', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.viewDashboard);

// Profile
router.get('/admin/profile', routeAuth.setSession, routeAuth.isAdmin, staffController.viewProfile);
router.get('/admin/profile/edit/:userId', routeAuth.setSession, routeAuth.isAdmin, staffController.viewEditProfile);

// Clinic Info
router.get('/admin/clinic', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.viewClinicInfo);
router.get('/admin/clinic/edit/:clinicId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.viewEditClinicInfo);

// Bill
router.get('/admin/bill/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.viewBills);
router.get('/admin/bill/invoice', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.viewInvoice);
router.get('/admin/bill/invoice-print', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.viewInvoice);
router.get('/admin/bill/medicare', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.viewMedicare);

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

// Queue
router.get('/admin/queue/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, statusMiddleware.updateMissedQueue, queueController.viewClinicQueues);
router.get('/admin/queue/edit/:queueId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, queueController.viewEditQueue_Admin);

// Appointment
router.get('/admin/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewCreateAppointment);
router.get('/admin/appointment/edit/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.viewEditAppointment);
router.get('/admin/appointment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, statusMiddleware.updateMissedAppt, appointmentController.viewAppointments);
router.get('/admin/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, statusMiddleware.updateMissedAppt, appointmentController.viewAppointment);

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
router.get('/admin/inventory/history', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, usedMaterialController.viewUsedMaterials);
router.get('/admin/inventory/history/report', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, usedMaterialController.viewUsedMaterialsReport);

/* End of Admin Route */


/* Start of Patient Route */

// Profile
router.get('/patient/profile', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, patientController.viewProfile);
router.get('/patient/profile/edit/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, patientController.viewEditProfile);

// Bill
router.get('/patient/bill/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, billController.viewBills);
router.get('/patient/bill/invoice', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, billController.viewInvoice);
router.get('/patient/bill/invoice-print', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, billController.viewInvoice);

// Queue
router.get('/patient/queue/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, statusMiddleware.updateMissedQueue, queueController.viewCreateQueue);
router.get('/patient/queue', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, statusMiddleware.updateMissedQueue, queueController.viewPatientQueueNumber);

// Appointment
router.get('/patient/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewCreateAppointment);
router.get('/patient/appointment/edit/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.viewEditAppointment);
router.get('/patient/appointment/upcoming', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, statusMiddleware.updateMissedAppt, appointmentController.viewAppointments);
router.get('/patient/appointment/past', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, statusMiddleware.updateMissedAppt, appointmentController.viewPastAppointments);
router.get('/patient/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, statusMiddleware.updateMissedAppt, appointmentController.viewAppointment);

// Oral Record
router.get('/patient/oral-record/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, oralRecordController.viewMyRecords);
router.get('/patient/oral-record/view/:recordId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, oralRecordController.viewRecord);

//Review
router.get('/patient/review/create/:clinicId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.viewCreate);
router.get('/patient/review/edit/:reviewId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.viewEdit);
router.get('/patient/review/view-all/:clinicId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.viewMyReviews);
router.get('/patient/review/view/:reviewId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.viewReview);

/* End of Patient Route */

/* Start of Dentist Route */

// Profile
router.get('/dentist/profile', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, staffController.viewProfile);
router.get('/dentist/profile/edit/:userId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, staffController.viewEditProfile);

// Appointment
router.get('/dentist/clinic', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicController.viewClinicInfo);
router.get('/dentist/appointment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, statusMiddleware.updateMissedAppt, appointmentController.viewAppointments);
router.get('/dentist/appointment/view/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, statusMiddleware.updateMissedAppt, appointmentController.viewAppointment);
router.get('/dentist/appointment/in-session', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, appointmentController.viewInSessionAppointment);

// Queue
router.get('/dentist/queue/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, statusMiddleware.updateMissedQueue, queueController.viewClinicQueues);

// Treatment
router.get('/dentist/treatment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.viewCreateTreatment);
router.get('/dentist/treatment/edit/:ctId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.viewEditTreatment);
router.get('/dentist/treatment/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.viewTreatments);
router.get('/dentist/treatment/view/:ctId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.viewTreatment);

//Oral Record
router.get('/dentist/patient/view-all', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, patientController.viewPatients);

router.get('/dentist/oral-record/create/:apptId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.viewCreate);
router.get('/dentist/oral-record/edit/:recordId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.viewEdit);
router.get('/dentist/oral-record/view/:recordId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.viewRecord);
router.get('/dentist/oral-record/view-all/:patientId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.viewRecords);

/* End of Dentist Route */

module.exports = router;