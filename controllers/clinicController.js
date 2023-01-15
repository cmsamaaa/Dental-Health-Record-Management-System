const _ = require('lodash');
const bcrypt = require('bcryptjs');
const request = require('request');
const Clinic = require('../entities/clinic');
const Staff = require('../entities/staff');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // TODO: register clinic
    if (!_.isEmpty(req.body)) {
        const clinic = new Clinic({
            clinicName: req.body.clinicName,
            clinicAddress: req.body.clinicAddress,
            clinicPostal: req.body.clinicPostal,
            clinicUnit: req.body.clinicUnit,
            clinicEmail: req.body.clinicEmail,
            clinicSubEmail: req.body.clinicSubEmail,
            clinicPhone: req.body.clinicPhone,
            clinicSubPhone: req.body.clinicSubPhone
        });
        const results = await clinic.registerClinic();

        if (results) {
            const hashedPassword = await bcrypt.hash(req.body.clinicPhone, 12);
            const staff = new Staff({
                firstName: "Super",
                lastName: "Admin",
                email: req.body.clinicEmail,
                password: hashedPassword,
                DOB: new Date().toISOString().split('T')[0],
                gender: "Male",
                role: "Administrator",
                clinicId: results
            });
            const addSuperAdmin = await staff.registerStaff();

            if (!_.isEmpty(addSuperAdmin))
                res.redirect(parse_uri.parse(req, '/staff/login'));
            else
                res.redirect(parse_uri.parse(req, '/register-clinic?error=true'));
        }
        else
            res.redirect(parse_uri.parse(req, '/register-clinic?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/register-clinic?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinic = new Clinic(req.body);
        const results = await clinic.updateClinic();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/clinic?action=edit'));
        else
            res.redirect(parse_uri.parse(req, '/admin/clinic/edit/' + req.body.clinicId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/clinic/edit/' + req.body.clinicId + '?error=true'));
};

exports.viewRegister = async (req, res, next) => {

    res.status(HTTP_STATUS.OK).render('auth/register-clinic', {
        pageTitle: 'Register Clinic',
        path: '/register-clinic',
        query: req.query
    });
};

exports.findClinicsByPostal = async (req, res, next) => {
    const pageTitle = 'Find Clinics Near Me';
    const path = '/clinic/search';

    if (req.query.type === 'district' || req.query.type === 'region') {
        const uri = parse_uri.parse(req, '/api/clinic/get/all/' + req.query.postal);
        request.get({
            url: uri
        }, (err, response, body) => {
            if (response.statusCode === HTTP_STATUS.OK) {
                res.status(HTTP_STATUS.OK).render('table/clinics-nearby', {
                    pageTitle: pageTitle,
                    path: path,
                    query: req.query,
                    clinicsData: JSON.parse(response.body)
                });
            }
            else {
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: pageTitle,
                    path: path,
                    clinicsData: null
                });
            }
        });
    }
    else {
        res.status(HTTP_STATUS.OK).render('table/clinics-nearby', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            clinicsData: null
        });
    }
};

exports.viewClinicInfo = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Clinic';
    let path = '/clinic/view';
    let clinicId = -1;

    if (req.session.userInfo) {
        if (req.params.clinicId)
            clinicId = req.params.clinicId;
        else {
            path = '/' + user + '/clinic';
            clinicId = req.session.userInfo.clinicId;
        }
    }
    else {
        if (req.params.clinicId)
            clinicId = req.params.clinicId;
    }

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('detail/clinic', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: pageTitle,
                path: path
            });
        }
    });
};

exports.viewEditClinicInfo = async (req, res, next) => {
    const title = 'Clinic';
    const path = '/admin/clinic/edit/' + req.params.clinicId;

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + req.params.clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('form/clinic', {
                pageTitle: title,
                path: path,
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: title,
                path: path
            });
        }
    });
};

exports.viewClinics = async (req, res, next) => {
    const clinic = new Clinic({
        //clinicId: req.session.userInfo.clinicId
    });
    const result = await clinic.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/clinics', {
            pageTitle: 'Clinic',
            path: '/clinic/view-all',
            query: req.query,
            clinicsData: result
        });
    }
    else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.viewClinic = async (req, res, next) => {
    const clinic = new Clinic({
        clinicId: req.params.clinicId
    });
    const result = await clinic.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/clinic', {
            pageTitle: 'Clinic',
            path: '/clinic/view',
            query: req.query,
            clinicData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/clinic/view?error=true'));
};