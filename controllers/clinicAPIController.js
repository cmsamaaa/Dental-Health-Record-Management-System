const Clinic = require('../entities/clinic');
const HTTP_STATUS = require("../constants/http_status");

const _ = require('lodash');

exports.getAll = async (req, res, next) => {
    const clinic = new Clinic();
    const result = await clinic.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.getAllDentists = async (req, res, next) => {
    const clinic = new Clinic({
        clinicId: req.params.clinicId
    });
    const result = await clinic.getAllDentists();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.get = async (req, res, next) => {
    const clinic = new Clinic({
        clinicId: req.params.clinicId
    });
    const result = await clinic.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};