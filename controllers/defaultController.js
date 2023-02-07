const HTTP_STATUS = require("../constants/http_status");
const Clinic = require('../entities/clinic');

exports.viewIndex = async (req, res, next) => {
    const clinic = new Clinic({
        //clinicId: req.session.userInfo.clinicId
    });
    const result = await clinic.getAll();

    res.status(HTTP_STATUS.OK).render('index', {
        pageTitle: 'Index',
        path: '/',
        query: req.query,
        clinicsData: result
    });
};

exports.view404 = async (req, res, next) => {
    res.status(HTTP_STATUS.NOT_FOUND).render('404', {
        pageTitle: '404',
        path: '/404',
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Page not found'
    });
};