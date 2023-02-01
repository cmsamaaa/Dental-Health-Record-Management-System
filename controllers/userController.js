const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");


const User = require('../entities/user');
const parse_uri = require('../lib/parse_uri');
const emailer = require('../lib/emailService');
const HTTP_STATUS = require('../constants/http_status');

const from = process.env.EMAIL_USER;

exports.logout = async (req, res, next) => {
    let path = '/login?logout=true';
    if (req.session.userRole === 'Administrator' || req.session.userRole === 'Dentist' || req.session.userRole === 'Dental Assistant')
        path = '/staff' + path;

    req.session.destroy();
    res.redirect(parse_uri.parse(req, path));
};

exports.resetPassword = async (req, res, next) => {
    const uri = parse_uri.parse(req, '/login');
    const path = '/forgot-password';

    const password = randomstring.generate({
        length: 12,
        charset: 'alphanumeric'
    });

    const hashedPassword = await bcrypt.hash(password, 12); // encrypt password with bcrypt, salt length 12
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    const results = await user.resetPassword();

    if (results) {
        const mailOptions = {
            from: from,
            to: req.body.email,
            subject: 'HappySmile - Reset Password',
            html: '<html>'
                + '<body>'
                + '<h1>HappySmile - Reset Password</h1>'
                + '<h2><strong>Your new password:</strong> ' + password + '</h2>'
                + '<p>Click <a href="' + uri + '">here</a> to login with the new password issued.</p>'
                + '</body>'
                + '</html>'
        };

        emailer.sendMail(mailOptions, (err, info) => {
            if (!err)
                res.redirect(parse_uri.parse(req, path + '?reset=success'));
            else
                res.redirect(parse_uri.parse(req, path + '?reset=error&type=service'));
        });
    }
    else
        res.redirect(parse_uri.parse(req, path + '?reset=error&type=email'));
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

exports.editProfile = async (req, res, next) => {
    const userRole = req.url.split('/')[1];
    const user = new User(req.body);
    const results = await user.updateUserProfile();

    if (results)
        res.redirect(parse_uri.parse(req, '/' + userRole + '/profile?action=edit&id=' + req.body.userId));
    else
        res.redirect(parse_uri.parse(req, '/' + userRole + '/profile/edit/' + req.body.userId + '?error=true'));
};

exports.suspendProfile = async (req, res, next) => {
    const user = new User({
        userId: req.session.userInfo.userId
    });
    const results = await user.suspendUser();

    if (results)
        res.redirect(parse_uri.parse(req, '/patient/profile'));
    else
        res.redirect(parse_uri.parse(req, '/patient/profile?error=true'));
};

exports.viewForgotPassword = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/forgot-password', {
        pageTitle: 'Forget Password',
        path: '/forgot-password',
        query: req.query,
    });
};

exports.viewFAQ = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('faq', {
        pageTitle: 'Frequently Asked Questions (For Patients)',
        path: '/faq',
        query: req.query,
    });
};

exports.viewFAQ_Staff = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('faq', {
        pageTitle: 'Frequently Asked Questions (For Clinics)',
        path: '/staff/faq',
        query: req.query,
    });
};