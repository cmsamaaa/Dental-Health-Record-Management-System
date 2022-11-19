const bcrypt = require('bcryptjs');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // if password confirmation does not match
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect(parse_uri.parse(req, '/register?mismatchPass=true'));
        return;
    }

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/user/create');
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // encrypt password with bcrypt, salt length 12
    request.post({
        url: uri,
        form: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nric: req.body.nric,
            DOB: req.body.DOB,
            email: req.body.email,
            password: hashedPassword
        }
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/login?register=true&id=' + JSON.parse(body).userId));
        else
            res.redirect(parse_uri.parse(req, '/register?error=true'));
    });
};

exports.login = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/user/login');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            req.session.isLoggedIn = true;
            res.redirect(parse_uri.parse(req, '/index?result=true&id=' + JSON.parse(body).userId));
        }
        else
            res.redirect(parse_uri.parse(req, '/login?error=true'));
    });
};

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.redirect(parse_uri.parse(req, '/login?logout=true'));
};