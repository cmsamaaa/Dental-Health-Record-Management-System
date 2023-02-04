const _ = require('lodash');
const Review = require('../entities/review');
const Staff = require('../entities/staff');
const Clinic = require('../entities/clinic');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.create = async (req, res, next) => {

    if (!_.isEmpty(req.body)) {
        const review = new Review({ 
            reviewScore: req.body.reviewScore,
            reviewDescription: req.body.reviewDescription,
            reviewTitle: req.body.reviewTitle,
            clinicId: req.body.clinicId,
            patientId: req.body.patientId
        });
        const results = await review.add();

        if (results)
            res.redirect(parse_uri.parse(req, '/review/view-all/' + req.body.clinicId));
        else
            res.redirect(parse_uri.parse(req, '/patient/review/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/review/create?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const review = new Review(req.body);
        const results = await review.update();
        
        if (results)
            res.redirect(parse_uri.parse(req,  '/review/view-all/' + req.body.clinicId));
        else
            res.redirect(parse_uri.parse(req, '/patient/review/edit/' + req.body.reviewId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/review/edit/' + req.body.reviewId + '?error=true'));
};

exports.viewReviews = async (req, res, next) => {
    const review = new Review({
        clinicId: req.params.clinicId
    });
    const result = await review.getAll();
    const avgRating = await review.getAvgRating();

    res.status(HTTP_STATUS.OK).render('table/review', {
        pageTitle: 'Patient Review(s)',
        path: '/review/view-all',
        query: req.query,
        clinicId: req.params.clinicId,
        avgData: !_.isEmpty(avgRating.Average) ? avgRating.Average : [],
        reviewData: !_.isEmpty(result) ? result : []
    });

};

exports.viewMyReviews = async (req, res, next) => {
    const review = new Review({
        patientId: req.session.userInfo.patientId,
        clinicId: req.params.clinicId
    });
    const result = await review.getMyReviews();

    res.status(HTTP_STATUS.OK).render('table/my-review', {
        pageTitle: 'My Review(s)',
        path: '/patient/review/view-all/' + req.params.clinicId,
        query: req.query,
        reviewData: !_.isEmpty(result) ? result : []
    });
};

 exports.viewReview = async (req, res, next) => {
    const review = new Review({
        clinicId: req.params.clinicId
    });
    const result = await review.getClinic();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/review', {
            pageTitle: 'My Review',
            path: '/patient/review/view-all',
            query: req.query,
            reviewData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/review/view-all?error=true'));
}; 

exports.viewEdit = async (req, res, next) => {
    const review = new Review({
        reviewId: req.params.reviewId
    });
    const result = await review.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/review', {
            pageTitle: 'My Review',
            path: '/patient/review/edit',
            query: req.query,
            clinicId: req.params.clinicId,
            staffData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/review/view-all?error=true'));
};

exports.viewCreate = async (req, res, next) => {
    const staff = new Staff({
        clinicId: req.params.clinicId
    });
    const result = await staff.getAllStaffs();

    if (result) {
        res.status(HTTP_STATUS.OK).render('form/review', {
            pageTitle: 'My Review',
            path: '/patient/review/create/' + req.params.clinicId,
            query: req.query,
            clinicId: req.params.clinicId,
            staffData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/patient/review/create?error=true'));
}