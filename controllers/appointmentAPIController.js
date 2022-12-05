const _ = require('lodash');
const Appointment = require('../entities/appointment');
const HTTP_STATUS = require("../constants/http_status");

exports.createAppointment = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const appointment = new Appointment(req.body);
        const results = await appointment.createAppointment();

        if (!_.isEmpty(results))
            res.status(HTTP_STATUS.CREATED).json({ apptId: results[0] });
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.getAllAppointments = async (req, res, next) => {
    const appointment = new Appointment();
    const result = await appointment.getAllAppointments();

    res.status(HTTP_STATUS.OK).json(result);
};

exports.getAllUserAppointments = async (req, res, next) => {
    const appointment = new Appointment({
        userId: req.params.userId
    });
    const result = await appointment.getAllUserAppointments();

    res.status(HTTP_STATUS.OK).json(result);
};