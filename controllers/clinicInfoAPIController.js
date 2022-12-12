const ClinicInfo = require('../entities/clinicInfo');
const HTTP_STATUS = require("../constants/http_status");

const _ = require('lodash');

exports.getAll = async (req, res, next) => {
    const clinicInfo = new ClinicInfo();
    const result = await clinicInfo.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.get = async (req, res, next) => {
    const clinicInfo = new ClinicInfo({
        infoKey: req.params.key
    });
    const result = await clinicInfo.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};