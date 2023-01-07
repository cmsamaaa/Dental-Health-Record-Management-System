const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');

const Patient = require('../entities/patient');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.login = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const patient = new Patient(req.body);
        const result = await patient.authenticatePatient();

        if (!_.isEmpty(result)) {
            req.session.isLoggedIn = true;
            req.session.userRole = 'Patient';
            req.session.userInfo = result;

            res.redirect(parse_uri.parse(req, '/index?result=true&id=' + req.session.userInfo.userId));
        }
        else
            res.redirect(parse_uri.parse(req, '/login?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/login?error=true'));
};

exports.register = async (req, res, next) => {
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
            if (req.session.userRole === 'Administrator')
                res.redirect(parse_uri.parse(req, '/admin/patient/view-all?action=create&id=' + results[0]));
            else
                res.redirect(parse_uri.parse(req, '/login'));
        else
            if (req.session.userRole === 'Administrator')
                res.redirect(parse_uri.parse(req, '/admin/patient/create?error=true'));
            else
                res.redirect(parse_uri.parse(req, '/register?error=true'));
    }
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const patient = new Patient(req.body);
        const results = await patient.updatePatient();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/patient/view-all?action=edit&id=' + req.body.userId));
        else
            res.redirect(parse_uri.parse(req, '/admin/patient/edit/' + req.body.userId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/patient/edit/' + req.body.userId + '?error=true'));
};

exports.viewLogin = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        query: req.query
    });
};

exports.viewRegister = async (req, res, next) => {

    res.status(HTTP_STATUS.OK).render('auth/register', {
        pageTitle: 'Patient Register',
        path: '/register',
        query: req.query
    });
};

exports.viewCreatePatient = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/patient', {
        pageTitle: 'Patient',
        path: '/admin/patient/create',
        query: req.query
    });
};

exports.viewEditPatient = async (req, res, next) => {
    const patient = new Patient({
        userId: req.params.userId
    });
    const result = await patient.getPatient();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/patient', {
            pageTitle: 'Patient',
            path: '/admin/patient/edit',
            query: req.query,
            patientData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/patient/view-all?error=true'));
};

exports.viewPatients = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/patient/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('table/patients', {
                pageTitle: 'Patient',
                path: '/admin/patient/view-all',
                query: req.query,
                patientData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Patient',
                path: '/admin/patient/view-all',
                query: req.query
            });
        }
    });
};

exports.viewPatient = async (req, res, next) => {
    const patient = new Patient({
        userId: req.params.userId
    });
    const result = await patient.getPatient();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/patient', {
            pageTitle: 'Patient',
            path: '/admin/patient/view',
            query: req.query,
            patientData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/patient/view-all?error=true'));
};

exports.viewProfile = async (req, res, next) => {
    const patient = new Patient({
        userId: req.session.userInfo.userId
    });
    const result = await patient.getProfile();
    
    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/profile', {
            pageTitle: 'Profile',
            path: '/patient/profile',
            query: req.query,
            profileData: result
        });
    }
    else {
        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
            pageTitle: 'Profile',
            path: '/patient/profile'
        });
    }
};

exports.viewEditProfile = async (req, res, next) => {
    const patient = new Patient({
        userId: req.session.userInfo.userId
    });
    const result = await patient.getProfile();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/profile', {
            pageTitle: 'Profile',
            path: '/patient/profile/edit/:userId',
            query: req.query,
            profileData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/profile?error=true'));
};

exports.editProfile = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const patient = new Patient(req.body);
        const results = await patient.updateProfile();

        if (results)
            res.redirect(parse_uri.parse(req, '/patient/profile?action=edit&id=' + req.body.userId));
        else
            res.redirect(parse_uri.parse(req, '/patient/profile/edit/' + req.body.userId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/profile/edit/' + req.body.userId + '?error=true'));
};