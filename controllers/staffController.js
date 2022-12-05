const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const Staff = require('../entities/staff');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.nric, 12); // encrypt password with bcrypt, salt length 12
    if (!_.isEmpty(req.body)) {
        const staff = new Staff({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nric: req.body.nric,
            DOB: req.body.DOB,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });
        const results = await staff.registerStaff();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/staff/view-all?register=true&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/admin/staff/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/create?error=true'));
};

exports.login = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const staff = new Staff(req.body);
        const result = await staff.authenticateStaff();

        if (!_.isEmpty(result)) {
            req.session.isLoggedIn = true;
            req.session.userRole = result.role;
            req.session.userInfo = result;

            request.get({
                url: parse_uri.parse(req, '/api/info/get/all'),
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {
                    const clinicInfo = JSON.parse(body);
                    const infoDict = {};
                    for (let i = 0; i < clinicInfo.length; i++) {
                        infoDict[clinicInfo[i].infoKey] = clinicInfo[i].value;
                    }

                    req.session.clinicInfo = infoDict;
                    res.redirect(parse_uri.parse(req, '/index?result=true&id=' + req.session.userInfo.userId));
                }
                else
                    res.redirect(parse_uri.parse(req, '/staff/login?error=true'));
            });
        }
        else
            res.redirect(parse_uri.parse(req, '/staff/login?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/staff/login?error=true'));
};