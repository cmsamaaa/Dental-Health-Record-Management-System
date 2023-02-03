const _ = require('lodash');
const oralRecord = require('../entities/oralRecord');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Appointment = require("../entities/appointment");

exports.create = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        if (req.body.recordTeeth) {
            const oralrecord = new oralRecord({
                recordTeeth: req.body.recordTeeth.constructor === Array ? req.body.recordTeeth.join(',') : req.body.recordTeeth,
                recordDescription: req.body.recordDescription,
                recordCreatedAt: new Date().toISOString().slice(0, 10),
                patientId: req.body.patientId,
                apptId: req.body.apptId
            });
            const results = await oralrecord.add();

            if (results)
                res.redirect(parse_uri.parse(req, '/dentist/oral-record/view/' + results[0]));
            else
                res.redirect(parse_uri.parse(req, '/dentist/oral-record/create/' + req.body.apptId + '?error=true'));
        }
        else
            res.redirect(parse_uri.parse(req, '/dentist/oral-record/create/' + req.body.apptId + '?empty=teeth'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oral-record/create/' + req.body.apptId + '?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const oralrecord = new oralRecord({
            recordId: req.body.recordId,
            recordTeeth: req.body.recordTeeth.constructor === Array ? req.body.recordTeeth.join(',') : req.body.recordTeeth,
            recordDescription: req.body.recordDescription
        });
        const results = await oralrecord.update();

        if (results)
            res.redirect(parse_uri.parse(req, '/dentist/oral-record/view/' + req.body.recordId));
        else
            res.redirect(parse_uri.parse(req, '/dentist/oral-record/edit/' + req.body.recordId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oral-record/edit/' + req.body.recordId + '?error=true'));
};

exports.viewRecords = async (req, res, next) => {
    const oralrecord = new oralRecord({
        patientId: req.params.patientId
    });
    const result = await oralrecord.getAll();

    res.status(HTTP_STATUS.OK).render('table/oralrecord', {
        pageTitle: 'Patient Health Card(s)',
        path: '/dentist/oral-record/view-all',
        query: req.query,
        oralrecordData: !_.isEmpty(result) ? result : []
    });

};

exports.viewMyRecords = async (req, res, next) => {
    const oralrecord = new oralRecord({
        patientId: req.session.userInfo.patientId
    });
    const result = await oralrecord.getMyOralRecord();

    res.status(HTTP_STATUS.OK).render('table/oralrecord', {
        pageTitle: 'Patient Health Card(s)',
        path: '/patient/oral-record/view',
        query: req.query,
        oralrecordData: !_.isEmpty(result) ? result : []
    });
};

exports.viewRecord = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();
    const userRole = req.url.split('/')[1];

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/oralRecord', {
            pageTitle: 'Oral Health Record',
            path: '/' + userRole + '/oral-record/view',
            query: req.query,
            oralrecordData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oral-record/view-all?error=true'));
};

exports.viewEdit = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();
    let teeth = result.recordTeeth;
    //const myArray = teeth.split(",");

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/oralRecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oral-record/edit',
            query: req.query,
            teethData: teeth,
            oralrecordData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oral-record/view-all?error=true'));
};

exports.viewCreate = async (req, res, next) => {
    const appointment = new Appointment({
        apptId: req.params.apptId
    });
    const result = await appointment.getAppointment();

    if (result) {
        res.status(HTTP_STATUS.OK).render('form/oralRecord', {
            pageTitle: 'Oral Health Record',
            path: '/dentist/oral-record/create',
            query: req.query,
            oralrecordData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oral-record/create?error=true'));
};