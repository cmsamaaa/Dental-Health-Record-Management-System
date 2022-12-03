const Patient = require('../entities/patient');

const HTTP_STATUS = require("../constants/http_status");
const _ = require('lodash');

exports.registerPatient = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const patient = new Patient(req.body);
        const results = await patient.registerPatient();

        if (!_.isEmpty(results))
            res.status(HTTP_STATUS.CREATED).json({ patientId: results[0] });
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.getAllPatients = async (req, res, next) => {
    const patient = new Patient();
    const result = await patient.getAllPatients();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};