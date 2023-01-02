const User = require('../entities/user');
const parse_uri = require("../lib/parse_uri");

exports.logout = async (req, res, next) => {
    let path = '/login?logout=true';
    if (req.session.userRole === 'Administrator' || req.session.userRole === 'Dentist' || req.session.userRole === 'Dental Assistant')
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

exports.editProfile = async (req, res, next) => {
    const userRole = req.url.split('/')[1];
        const user = new User(req.body);
        const results = await user.updateUserProfile();

        if (results)
            res.redirect(parse_uri.parse(req, '/' + userRole + '/profile?action=edit&id=' + req.body.userId));
        else
            res.redirect(parse_uri.parse(req, '/' + userRole + '/profile/edit/' + req.body.userId + '?error=true'));
};