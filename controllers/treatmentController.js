const _ = require('lodash');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const ClinicTreatment = require("../entities/clinicTreatment");
const Treatment = require("../entities/treatment");

exports.addTreatment = async (req, res, next) => {
    // Get clinic's treatment data
    const clinicTreatment = new ClinicTreatment({ ctId: req.body.ctId });
    const clinicTreatmentData = await clinicTreatment.get();

    if (!_.isEmpty(clinicTreatmentData)) {
        // Create treatment record
        const treatment = new Treatment({
            treatmentName: clinicTreatmentData.ctName,
            treatmentPrice: clinicTreatmentData.ctPrice,
            treatmentTeeth: req.body.treatmentTeeth.constructor === Array ? req.body.treatmentTeeth.join(',') : req.body.treatmentTeeth,
            apptId: req.body.apptId
        });
        const treatmentData = await treatment.createTreatment();

        if (!_.isEmpty(treatmentData))
            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?action=create'));
        else
            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?error=true'));
};

exports.editTreatment = async (req, res, next) => {
    // Get clinic's treatment data
    const clinicTreatment = new ClinicTreatment({ ctId: req.body.ctId });
    const clinicTreatmentData = await clinicTreatment.get();

    if (!_.isEmpty(clinicTreatmentData)) {
        // Create treatment record
        const treatment = new Treatment({
            treatmentId: req.body.treatmentId,
            treatmentName: clinicTreatmentData.ctName,
            treatmentPrice: clinicTreatmentData.ctPrice,
            treatmentTeeth: req.body.treatmentTeeth.constructor === Array ? req.body.treatmentTeeth.join(',') : req.body.treatmentTeeth
        });
        const treatmentData = await treatment.updateTreatment();
        console.log(treatmentData);

        if (treatmentData)
            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?action=edit'));
        else
            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?error=true'));
};