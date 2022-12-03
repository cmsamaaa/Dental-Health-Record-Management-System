const bcrypt = require('bcryptjs');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.registerPatient = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/patient/create');
    const hashedPassword = await bcrypt.hash(req.body.nric, 12); // encrypt password with bcrypt, salt length 12
    request.post({
        url: uri,
        form: {
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
        }
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/admin/patient/view-all?register=true&id=' + JSON.parse(body).patientId));
        else
            res.redirect(parse_uri.parse(req, '/admin/patient/create?error=true'));
    });
};