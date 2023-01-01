const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const Profile = require('../entities/profile');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const profile = new Profile(req.body);
        const results = await profile.updateProfile();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/staff/view-all?action=edit&id=' + req.body.userId));
        else
            res.redirect(parse_uri.parse(req, '/admin/staff/edit/' + req.body.userId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/edit/' + req.body.userId + '?error=true'));
};

exports.viewEdit = async (req, res, next) => {
    const profile = new Profile({
        userId: req.params.userId
    });
    const result = await profile.getProfile();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/profile', {
            pageTitle: 'Profile',
            path: '/admin/profile/edit/:userId',
            query: req.query,
            profileData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/profile?error=true'));
};

exports.view = async (req, res, next) => {
    const profile = new Profile({
        userId: req.session.userId
    });
    const result = await profile.getProfile();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/profile', {
            pageTitle: 'Profile',
            path: '/admin/profile/view/:userId',
            query: req.query,
            profileData: result
        });
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};