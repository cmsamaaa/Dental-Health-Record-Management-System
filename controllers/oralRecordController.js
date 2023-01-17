const _ = require('lodash');
const oralRecord = require('../entities/oralRecord');
const appointment = require('../entities/appointment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Appointment = require('../entities/appointment');

exports.create = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const oralrecord = new oralRecord({ 
            recordTeeth: req.body.recordTeeth,
            recordDescription: req.body.recordDescription,
            recordCreatedAt: new Date().toISOString().slice(0,10),
            patientId: req.body.patientId,
            apptId: req.body.apptId
        });
        const results = await oralrecord.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view/' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/create?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const oralrecord = new oralRecord({ 
            recordId: req.body.recordId,
            recordTeeth: req.body.recordTeeth,
            recordDescription: req.body.recordDescription
        });
        const results = await oralrecord.update();
        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view/' + req.body.recordId));
        else
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/edit/' + req.body.recordId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/edit/' + req.body.recordId + '?error=true'));
};

exports.viewRecords = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/dentist-oralrecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oralrecord/view-all',
            query: req.query,
            userData: result
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('dentist-oralrecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oralrecord/view-all',
            query: req.query,
            userData: []
        });
};

exports.viewRecord = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/oralRecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oralrecord/view',
            query: req.query,
            oralrecordData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?error=true'));
};

exports.viewEdit = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/oralrecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oralrecord/edit',
            query: req.query,
            userData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?error=true'));
};

exports.viewCreate = async (req, res, next) => {
    const appointment = new Appointment({
            apptId: req.params.apptId
    });
    const result = await appointment.getAppointment();

    if (result) {
        res.status(HTTP_STATUS.OK).render('form/oralRecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oralrecord/create',
            query: req.query,
            userData: result
            //apptId: oralrecord.apptId
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/appointment/view-all'));
}