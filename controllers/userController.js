const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const User = require('../entities/user');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // if password confirmation does not match
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect(parse_uri.parse(req, '/register?mismatchPass=true'));
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12); // encrypt password with bcrypt, salt length 12
    if (!_.isEmpty(req.body)) {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nric: req.body.nric,
            DOB: req.body.DOB,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword
        });
        const results = await user.createUser();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/login?register=true&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/register?error=true'));
    } else
        res.redirect(parse_uri.parse(req, '/register?error=true'));
};

exports.login = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const user = new User(req.body);
        const result = await user.authenticateUser();

        if (!_.isEmpty(result)) {
            req.session.isLoggedIn = true;
            req.session.userId = result.userId;

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
                    res.redirect(parse_uri.parse(req, '/index?result=true&id=' + req.session.userId));
                }
                else
                    res.redirect(parse_uri.parse(req, '/login?error=true'));
            });
        }
        else
            res.redirect(parse_uri.parse(req, '/login?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/login?error=true'));
};

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.redirect(parse_uri.parse(req, '/login?logout=true'));
};