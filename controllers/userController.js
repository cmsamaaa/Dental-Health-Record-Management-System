const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const User = require('../entities/user');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.logout = async (req, res, next) => {
    let path = '/login?logout=true';
    if (req.session.userRole !== 'Patient')
        path = '/staff' + path;

    req.session.destroy();
    res.redirect(parse_uri.parse(req, path));
};

exports.suspend = async (req, res, next) => {
    const user = new User({
        userId: req.body.userId
    });
    const results = await user.suspendUser();

    let path = req.body.for === 'staff' ? '/admin/staff' : '/admin/patient';

    if (results)
        res.redirect(parse_uri.parse(req, path + '/view-all?action=suspend&userId=' + req.body.userId));
    else
        res.redirect(parse_uri.parse(req, path + '/view-all?error=true'));
};

exports.reactivate = async (req, res, next) => {
    const user = new User({
        userId: req.body.userId
    });
    const results = await user.reactivateUser();

    let path = req.body.for === 'staff' ? '/admin/staff' : '/admin/patient';
    if (results)
        res.redirect(parse_uri.parse(req, path + '/view-all?action=reactivate&userId=' + req.body.userId));
    else
        res.redirect(parse_uri.parse(req, path + '/view-all?error=true'));
};