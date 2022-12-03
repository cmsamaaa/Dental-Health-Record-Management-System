const express = require('express');

const userAPIController = require('../route-controllers/apiController-user');
const patientAPIController = require('../route-controllers/apiController-patient');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);
router.get('/user/get/nric/all', userAPIController.getAllNRIC);

router.post('/patient/create', patientAPIController.registerPatient);
router.get('/patient/get/all', patientAPIController.getAllPatients);

module.exports = router;