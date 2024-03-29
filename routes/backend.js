const express = require('express');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const billController = require('../controllers/billController');
const userController = require('../controllers/userController');
const clinicController = require('../controllers/clinicController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');
const appointmentController = require('../controllers/appointmentController');
const participantController = require('../controllers/participantController');
const inventoryController = require('../controllers/inventoryController');
const clinicTreatmentController = require('../controllers/clinicTreatmentController');
const oralRecordController = require('../controllers/oralRecordController');
const treatmentController = require('../controllers/treatmentController');
const queueController = require('../controllers/queueController');
const reviewController = require('../controllers/reviewController');
const usedMaterialController = require('../controllers/usedMaterialController');
const routeAuth = require('../middleware/route-auth');

const router = express.Router();

// Non-protected routes
router.post('/login', routeAuth.setSession, patientController.login);
router.post('/register', routeAuth.setSession, patientController.register);
router.post('/register-clinic', routeAuth.setSession, clinicController.register);
router.post('/staff/login', routeAuth.setSession, staffController.login);
router.post('/forgot-password', userController.resetPassword);
router.get('/logout', routeAuth.setSession, userController.logout);

// Protected routes
router.post('/admin/clinic/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.edit);

router.post('/admin/user/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, userController.suspend);
router.post('/admin/user/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, userController.reactivate);

router.post('/admin/profile/edit', routeAuth.setSession, routeAuth.isAdmin, userController.editProfile);

router.post('/admin/bill/payment', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.updatePayment);
router.post('/admin/bill/medicare', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, upload.single('pdfFile'), billController.updateMedicare);
router.post('/admin/bill/medicare/download', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, billController.downloadMedicareFile);

router.post('/admin/staff/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.register);
router.post('/admin/staff/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.edit);

router.post('/admin/patient/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.register);
router.post('/admin/patient/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.edit);

router.post('/admin/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.createAppointment);
router.post('/admin/appointment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.editAppointment);
router.post('/admin/appointment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.suspendAppointment);

router.post('/admin/queue/call', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, queueController.callQueue);
router.post('/admin/queue/skip', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, queueController.skipQueue);
router.post('/admin/queue/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, queueController.editQueue_Admin);
router.post('/admin/queue/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, queueController.suspendQueueById);

router.post('/admin/treatment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.createTreatment);
router.post('/admin/treatment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.editTreatment);
router.post('/admin/treatment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.suspendTreatment);
router.post('/admin/treatment/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.reactivateTreatment);

router.post('/admin/inventory/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.createInventory);
router.post('/admin/inventory/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.editInventory);
router.post('/admin/inventory/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.suspendInventory);
router.post('/admin/inventory/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.reactivateInventory);

router.post('/patient/profile/edit', routeAuth.setSession, routeAuth.isPatient, patientController.editProfile);
router.post('/patient/profile/suspend', routeAuth.setSession, routeAuth.isPatient, userController.suspendProfile);

router.post('/patient/queue/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, queueController.createQueue);
router.post('/patient/queue/cancel', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, queueController.suspendQueue);

router.post('/patient/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.createAppointment);
router.post('/patient/appointment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.editAppointment);
router.post('/patient/appointment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.suspendAppointment);

router.post('/patient/bill/payment', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, billController.updatePayment);

router.post('/patient/review/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.create);
router.post('/patient/review/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, reviewController.edit);

router.post('/dentist/profile/edit', routeAuth.setSession, routeAuth.isDentist, userController.editProfile);

router.post('/dentist/appointment/in-session/end', routeAuth.setSession, routeAuth.isDentist, appointmentController.endInSessionAppointment);
router.post('/dentist/appointment/in-session/treatment/add', routeAuth.setSession, routeAuth.isDentist, treatmentController.addTreatment);
router.post('/dentist/appointment/in-session/treatment/edit', routeAuth.setSession, routeAuth.isDentist, treatmentController.editTreatment);
router.post('/dentist/appointment/in-session/treatment/complete', routeAuth.setSession, routeAuth.isDentist, treatmentController.completeTreatment);
router.post('/dentist/appointment/in-session/treatment/delete', routeAuth.setSession, routeAuth.isDentist, treatmentController.deleteTreatment);
router.post('/dentist/appointment/in-session/participant/add', routeAuth.setSession, routeAuth.isDentist, participantController.addParticipant);
router.post('/dentist/appointment/in-session/participant/delete', routeAuth.setSession, routeAuth.isDentist, participantController.deleteParticipant);
router.post('/dentist/appointment/in-session/used-materials/add', routeAuth.setSession, routeAuth.isDentist, usedMaterialController.addUsedMaterial);
router.post('/dentist/appointment/in-session/used-materials/delete', routeAuth.setSession, routeAuth.isDentist, usedMaterialController.deleteUsedMaterial);

router.post('/dentist/queue/call', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, queueController.callQueue);
router.post('/dentist/queue/skip', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, queueController.skipQueue);
router.post('/dentist/queue/start-session', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, queueController.startSession);

router.post('/dentist/treatment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.createTreatment);
router.post('/dentist/treatment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.editTreatment);
router.post('/dentist/treatment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.suspendTreatment);
router.post('/dentist/treatment/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, clinicTreatmentController.reactivateTreatment);

router.post('/dentist/oral-record/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.create);
router.post('/dentist/oral-record/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isDentist, oralRecordController.edit);

module.exports = router;