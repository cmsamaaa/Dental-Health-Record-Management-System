const express = require('express');

const userAPIController = require('../controllers/userAPIController');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);

module.exports = router;