const express = require('express');

const userController = require('../controllers/userController');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.post('/admin/patient/create', patientController.registerPatient);

module.exports = router;