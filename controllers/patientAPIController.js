const _ = require('lodash');
const Patient = require('../entities/patient');
const HTTP_STATUS = require("../constants/http_status");

exports.getAllPatients = async (req, res, next) => {
    const patient = new Patient();
    const result = await patient.getAllPatients();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.getPatient = async (req, res, next) => {
    const patient = new Patient({
        userId: req.params.userId
    });
    const result = await patient.getPatient();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};