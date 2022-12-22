const _ = require('lodash');
const Staff = require('../entities/staff');
const HTTP_STATUS = require("../constants/http_status");

exports.getDentist = async (req, res, next) => {
    const staff = new Staff({
        staffId: req.params.staffId
    });
    const result = await staff.getDentist();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};