const ClinicInfo = require('../entities/clinicInfo');
const HTTP_STATUS = require("../constants/http_status");

const _ = require('lodash');

exports.add = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinicInfo = new ClinicInfo(req.body);
        const results = await clinicInfo.add();

        if (!_.isEmpty(results))
            res.status(HTTP_STATUS.CREATED).json({ isCreated: true });
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

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
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};