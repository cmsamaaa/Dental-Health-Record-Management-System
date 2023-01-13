const _ = require('lodash');
const Queue = require('../entities/queue');
const HTTP_STATUS = require("../constants/http_status");

// exports.getQueueCount = async (req, res, next) => {
//     const queue = new Queue({
//         clinicId: req.params.clinicId
//     });
//     const result = await queue.getQueueCount();

//     if (result)
//         res.status(HTTP_STATUS.OK).json(result);
//     else
//         res.status(HTTP_STATUS.NOT_FOUND).json({});
// };

exports.getPatientQueue = async (req, res, next) => {
    const queue = new Queue({
        patientId: req.params.patientId
    });
    const result = await queue.getPatientQueue();

    if (!_.isNull(result.queueNo))
        res.status(HTTP_STATUS.OK).json(result);
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};