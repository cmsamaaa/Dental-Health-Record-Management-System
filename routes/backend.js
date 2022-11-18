const express = require('express');

const routeController = require('../controllers/postRouteController');

const router = express.Router();

router.post('/register', routeController.register);

module.exports = router;