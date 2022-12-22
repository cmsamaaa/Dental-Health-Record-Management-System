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
    const results = await appointment.getAllUserAppointments();

    if (!_.isEmpty(results))
        res.status(HTTP_STATUS.OK).json(results);
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};

exports.getAppointment = async (req, res, next) => {
    const appointment = new Appointment({
        apptId: req.params.apptId
    });
    const result = await appointment.getAppointment();

    if (!_.isEmpty(result))
        res.status(HTTP_STATUS.OK).json(result);
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};

exports.editAppointment = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const appointment = new Appointment(req.body);
        const results = await appointment.updateAppointment();

        if (results)
            res.status(HTTP_STATUS.OK).json({ success: true });
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.suspendAppointment = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const appointment = new Appointment(req.body);
        const results = await appointment.suspendAppointment();

        if (results)
            res.status(HTTP_STATUS.OK).json({ success: true });
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};