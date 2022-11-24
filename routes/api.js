const express = require('express');

const userAPIController = require('../route-controllers/apiController-user');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);

module.exports = router;