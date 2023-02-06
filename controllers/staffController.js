const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const Staff = require('../entities/staff');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.login = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const staff = new Staff(req.body);
        const result = await staff.authenticateStaff();

        if (!_.isEmpty(result)) {
            req.session.isLoggedIn = true;
            req.session.userRole = result.role;
            req.session.userInfo = result;

            request.get({
                url: parse_uri.parse(req, '/api/clinic/get/' + req.session.userInfo.clinicId),
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {
                    req.session.clinicInfo = JSON.parse(body);

                    if (result.role === 'Administrator')
                        res.redirect(parse_uri.parse(req, '/admin/dashboard?result=true&id=' + req.session.userInfo.userId));
                    else
                        res.redirect(parse_uri.parse(req, '/dentist/appointment/view-all?filter=upcoming&result=true&id=' + req.session.userInfo.userId));
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
            role: req.body.role,
            clinicId: req.body.clinicId
        });
        const results = await staff.registerStaff();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/staff/view-all?action=create&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/admin/staff/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/create?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const staff = new Staff(req.body);
        const results = await staff.updateStaff();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/staff/view-all?action=edit&id=' + req.body.userId));
        else
            res.redirect(parse_uri.parse(req, '/admin/staff/edit/' + req.body.userId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/edit/' + req.body.userId + '?error=true'));
};

exports.viewLogin = async (req, res, next) => {
    if (req.session.isLoggedIn) {
        if (req.session.userRole === 'Administrator')
            res.redirect(parse_uri.parse(req, '/admin/dashboard'));
        if (req.session.userRole === 'Dentist' || req.session.userRole === 'Dental Assistant')
            res.redirect(parse_uri.parse(req, '/dentist/appointment/view-all?filter=upcoming'));
        if (req.session.userRole === 'Patient')
            res.redirect(parse_uri.parse(req, '/login'));
    }
    else
        res.status(HTTP_STATUS.OK).render('auth/login', {
            pageTitle: 'Staff Login',
            path: '/staff/login',
            query: req.query
        });
};

exports.viewDashboard = async (req, res, next) => {
    const user = req.url.split('/')[1];

    res.status(HTTP_STATUS.OK).render('dashboard', {
        pageTitle: 'Dashboard',
        path: '/' + user + '/dashboard',
        query: req.query,
    });
};

exports.viewCreateStaff = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/staff', {
        pageTitle: 'Staff',
        path: '/admin/staff/create',
        query: req.query
    });
};

exports.viewEditStaff = async (req, res, next) => {
    const staff = new Staff({
        userId: req.params.userId
    });
    const result = await staff.getStaff();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/staff', {
            pageTitle: 'Staff',
            path: '/admin/staff/edit',
            query: req.query,
            staffData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/view-all?error=true'));
};

exports.viewStaffs = async (req, res, next) => {
    const staff = new Staff({
        clinicId: req.session.userInfo.clinicId
    });
    const result = await staff.getAllStaffs();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/staffs', {
            pageTitle: 'Staff',
            path: '/admin/staff/view-all',
            query: req.query,
            staffData: result
        });
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.viewStaff = async (req, res, next) => {
    const staff = new Staff({
        userId: req.params.userId
    });
    const result = await staff.getStaff();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/staff', {
            pageTitle: 'Staff',
            path: '/admin/staff/view',
            query: req.query,
            staffData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/staff/view-all?error=true'));
};

exports.viewProfile = async (req, res, next) => {
    const staff = new Staff({
        userId: req.session.userInfo.userId
    });
    const result = await staff.getProfile();
    const userRole = req.url.split('/')[1];

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/profile', {
            pageTitle: 'Profile',
            path: '/' + userRole + '/profile',
            query: req.query,
            profileData: result
        });
    }
    else {
        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
            pageTitle: 'Profile',
            path: '/' + userRole + '/profile'
        });
    }
};

exports.viewEditProfile = async (req, res, next) => {
    const staff = new Staff({
        userId: req.session.userInfo.userId
    });
    const result = await staff.getProfile();
    const userRole = req.url.split('/')[1];

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/profile', {
            pageTitle: 'Profile',
            path: '/' + userRole + '/profile/edit/' + req.session.userInfo.userId,
            query: req.query,
            profileData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/profile?error=true'));
};
