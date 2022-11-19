const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/user/create');
    request.post({
        url: uri,
        form: req.body
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
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/index?result=true&id=' + JSON.parse(body).userId));
        else
            res.redirect(parse_uri.parse(req, '/login?error=true'));
    });
};