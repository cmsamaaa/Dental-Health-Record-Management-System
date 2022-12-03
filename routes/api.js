const express = require('express');

const userAPIController = require('../route-controllers/apiController-user');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);
router.get('/user/get/nric/all', userAPIController.getAllNRIC);

module.exports = router;