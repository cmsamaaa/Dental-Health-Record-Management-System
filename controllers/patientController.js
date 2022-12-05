const _ = require('lodash');
const bcrypt = require('bcryptjs');

const Patient = require('../entities/patient');
const parse_uri = require("../lib/parse_uri");

exports.registerPatient = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.nric, 12); // encrypt password with bcrypt, salt length 12
    if (!_.isEmpty(req.body)) {
        const patient = new Patient({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nric: req.body.nric,
            DOB: req.body.DOB,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword,
            medicareId: req.body.medicareId,
            address: req.body.address,
            postal: req.body.postal,
            unit: req.body.unit,
            familyId: req.body.familyId
        });
        const results = await patient.registerPatient();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/patient/view-all?register=true&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/admin/patient/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/patient/create?error=true'));
};