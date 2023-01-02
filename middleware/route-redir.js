exports.defaultPage = (req, res, next) => {
    if (req.session.userRole === 'Administrator') {
        return res.redirect('/admin/clinic');
    }

    if (req.session.userRole === 'Patient') {
        return res.redirect('/patient/appointment/upcoming');
    }

    if (req.session.userRole === 'Dentist' || req.session.userRole === 'Dental Assistant') {
        return res.redirect('/dentist/appointment/view-all');
    }

    next();
};