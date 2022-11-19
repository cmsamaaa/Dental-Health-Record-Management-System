const express = require('express');

const userAPIController = require('../controllers/userAPIController');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.retrieveUser);

module.exports = router;